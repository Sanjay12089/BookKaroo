using BookKaroo.Application.DTOs.Chatbot;
using BookKaroo.Application.Interfaces.ExternalServices;
using BookKaroo.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace BookKaroo.Application.Services;

public class ChatbotService : IChatbotService
{
    private readonly IGroqService          _groq;
    private readonly IChatbotQueryService  _query;
    private readonly ILogger<ChatbotService> _log;

    public ChatbotService(
        IGroqService groq,
        IChatbotQueryService query,
        ILogger<ChatbotService> log)
    {
        _groq  = groq;
        _query = query;
        _log   = log;
    }

    public async Task<ChatbotMessageResponse> ProcessMessageAsync(
        ChatbotMessageRequest request,
        Guid?                 userId,
        Guid?                 cityId,
        string                cityName,
        string?               userName,
        CancellationToken     ct)
    {
        var context = new ChatbotContext
        {
            CityName        = cityName,
            CityId          = cityId,
            IsAuthenticated = userId.HasValue,
            UserName        = userName,
            TodayDate       = DateOnly.FromDateTime(DateTime.Today).ToString("dd MMM yyyy"),
            TodayDayName    = DateTime.Today.DayOfWeek.ToString(),
        };

        GroqIntentResponse intent;
        try
        {
            intent = await _groq.GetIntentAsync(request.Message, request.History, context, ct);
        }
        catch (Exception ex)
        {
            _log.LogWarning(ex, "Groq call failed; returning generic fallback");
            intent = new GroqIntentResponse
            {
                Intent = "GENERAL",
                Answer = "I'm having trouble right now. Please try again in a moment. 🙏"
            };
        }

        var response = new ChatbotMessageResponse
        {
            Message    = intent.Answer    ?? string.Empty,
            Intent     = intent.Intent    ?? "GENERAL",
            ActionType = intent.ActionType ?? "none",
            ActionUrl  = intent.ActionUrl,
        };

        switch (intent.Intent?.ToUpperInvariant())
        {
            case "SHOW_SEARCH":
            case "AVAILABILITY":
                response.Shows = await _query.SearchShowsAsync(intent, cityId, ct);
                break;

            case "EVENT_SEARCH":
                response.Events = await _query.SearchEventsAsync(intent, cityId, ct);
                break;

            case "MY_BOOKINGS":
                if (userId.HasValue)
                    response.Bookings = await _query.GetUserBookingsAsync(userId.Value, ct);
                break;
        }

        return response;
    }
}
