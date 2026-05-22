using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using BookKaroo.Application.DTOs.Chatbot;
using BookKaroo.Application.Interfaces.ExternalServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Infrastructure.ExternalServices;

public class GroqService : IGroqService
{
    private readonly HttpClient            _http;
    private readonly string                _model;
    private readonly ILogger<GroqService>  _log;

    public GroqService(IHttpClientFactory factory, IConfiguration config, ILogger<GroqService> log)
    {
        _http  = factory.CreateClient("groq");
        _model = config["GROQ_MODEL"] ?? "llama-3.3-70b-versatile";
        _log   = log;
    }

    public async Task<GroqIntentResponse> GetIntentAsync(
        string                userMessage,
        List<ConversationTurn> history,
        ChatbotContext        context,
        CancellationToken     ct)
    {
        try
        {
            var systemPrompt = BuildSystemPrompt(context);

            var messages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };
            foreach (var h in history.TakeLast(5))
                messages.Add(new { role = h.Role, content = h.Content });
            messages.Add(new { role = "user", content = userMessage });

            var body = new
            {
                model           = _model,
                temperature     = 0.15,
                max_tokens      = 500,
                response_format = new { type = "json_object" },
                messages
            };

            var json     = JsonSerializer.Serialize(body);
            var content  = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _http.PostAsync("openai/v1/chat/completions", content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync(ct);
                _log.LogWarning("Groq API error {Status}: {Body}", response.StatusCode, err);
                return Fallback();
            }

            var raw = await response.Content.ReadAsStringAsync(ct);
            using var doc     = JsonDocument.Parse(raw);
            var messageContent = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "{}";

            var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            return JsonSerializer.Deserialize<GroqIntentResponse>(messageContent, opts) ?? Fallback();
        }
        catch (Exception ex)
        {
            _log.LogWarning(ex, "Groq service failed — returning fallback response");
            return Fallback();
        }
    }

    private static GroqIntentResponse Fallback() => new()
    {
        Intent = "GENERAL",
        Answer = "I'm having trouble right now. Please try again in a moment. 🙏"
    };

    private static string BuildSystemPrompt(ChatbotContext ctx) => $$"""
        You are BookKaroo Assistant, a helpful AI for India's entertainment booking platform.
        You help users find movies, events, check showtimes, and navigate the site.

        TODAY: {{ctx.TodayDayName}}, {{ctx.TodayDate}}
        USER CITY: {{ctx.CityName}}
        USER STATUS: {{(ctx.IsAuthenticated ? $"Logged in as {ctx.UserName}" : "Guest")}}

        YOUR JOB:
        Understand the user's request and extract structured intent.
        Respond ONLY with valid JSON matching this exact schema:

        {
          "intent": "SHOW_SEARCH | MOVIE_INFO | EVENT_SEARCH | MY_BOOKINGS | RECOMMENDATION | AVAILABILITY | GENERAL",
          "movieTitle": "extracted movie title or null",
          "movieSlug": "url-safe slug e.g. kgf-chapter-2 or null",
          "eventType": "ipl | live_event | play | sport | comedy | activity or null",
          "date": "today | tomorrow | YYYY-MM-DD or null",
          "timeOfDay": "morning | afternoon | evening | night or null",
          "genre": "Action | Comedy | Horror | Drama | Romance | Thriller | Family or null",
          "language": "Hindi | English | Tamil | Telugu | Kannada | Malayalam or null",
          "format": "IMAX | 3D | 2D or null",
          "answer": "Your friendly natural language response. 1-3 sentences. Use emojis. Be concise.",
          "actionType": "navigate | none",
          "actionUrl": "/path or null"
        }

        INTENT RULES:
        - SHOW_SEARCH: user wants to find/book movie shows
        - MOVIE_INFO: user asks about a movie (plot, cast, rating, certificate)
        - EVENT_SEARCH: user wants concerts, IPL, plays, sports, comedy
        - MY_BOOKINGS: user wants to see their bookings (if guest: answer = "Please sign in to view your bookings.")
        - RECOMMENDATION: user wants movie suggestions
        - AVAILABILITY: user asks about seat availability
        - GENERAL: anything else

        TIME OF DAY: morning=6-12, afternoon=12-17, evening=17-21, night=21-24

        SLUG RULES: lowercase, spaces→hyphens, remove special chars.
        "KGF: Chapter 2" → "kgf-chapter-2", "Pushpa 2: The Rule" → "pushpa-2-the-rule"

        NAVIGATION URLS:
        /movies | /movies/{slug} | /movies/{slug}/showtimes | /events | /ipl | /sports | /plays | /profile/bookings | /search?q={query}

        PERSONALITY: Friendly, concise, use emojis 🎬🎟🏏🎭⭐. Never mention SQL or databases.
        """;
}
