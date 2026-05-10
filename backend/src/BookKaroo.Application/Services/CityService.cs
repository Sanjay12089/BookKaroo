using System.Net;
using System.Text.Json;
using BookKaroo.Application.DTOs.Cities;
using BookKaroo.Application.Interfaces.Repositories;
using BookKaroo.Application.Interfaces.Services;

namespace BookKaroo.Application.Services;

public class CityService : ICityService
{
    private readonly ICityRepository _cities;
    private readonly IHttpClientFactory _http;

    public CityService(ICityRepository cities, IHttpClientFactory http)
    {
        _cities = cities;
        _http = http;
    }

    public async Task<IEnumerable<CityResponse>> GetAllAsync(CancellationToken ct = default)
    {
        var cities = await _cities.GetActiveAsync(ct);
        return cities
            .OrderBy(c => c.Name)
            .Select(c => new CityResponse(c.Id, c.Name, c.Slug, c.State, c.StateCode, c.Latitude, c.Longitude));
    }

    public async Task<CityResponse?> DetectFromIpAsync(string ip, CancellationToken ct = default)
    {
        try
        {
            var client = _http.CreateClient();

            // For loopback/private IPs (local dev), call ip-api without an IP so it
            // auto-detects using the server's own outbound address (≈ developer's real IP).
            var apiUrl = IsPrivateOrLoopback(ip)
                ? "http://ip-api.com/json?fields=city,status"
                : $"http://ip-api.com/json/{ip}?fields=city,status";

            var response = await client.GetStringAsync(apiUrl, ct);
            var doc = JsonDocument.Parse(response);

            // ip-api returns {status:"fail"} for unresolvable IPs
            if (doc.RootElement.TryGetProperty("status", out var statusProp)
                && statusProp.GetString() == "fail")
                return null;

            if (!doc.RootElement.TryGetProperty("city", out var cityProp)) return null;
            var cityName = cityProp.GetString();
            if (string.IsNullOrWhiteSpace(cityName)) return null;

            // Exact match first
            var city = await _cities.FindByNameAsync(cityName, ct);

            // Fallback: case-insensitive partial match (handles "New Delhi" → "Delhi-NCR" etc.)
            if (city == null)
            {
                var all = await _cities.GetActiveAsync(ct);
                city = all.FirstOrDefault(c =>
                    c.Name.Contains(cityName, StringComparison.OrdinalIgnoreCase) ||
                    cityName.Contains(c.Name, StringComparison.OrdinalIgnoreCase));
            }

            if (city == null) return null;

            return new CityResponse(city.Id, city.Name, city.Slug, city.State, city.StateCode, city.Latitude, city.Longitude);
        }
        catch
        {
            return null;
        }
    }

    private static bool IsPrivateOrLoopback(string ip)
    {
        if (ip is "::1" or "127.0.0.1" or "0.0.0.0" or "::ffff:127.0.0.1") return true;
        if (!IPAddress.TryParse(ip, out var addr)) return true; // unparseable → treat as private
        var mapped = addr.MapToIPv4().GetAddressBytes();
        return mapped[0] == 10
            || (mapped[0] == 172 && mapped[1] >= 16 && mapped[1] <= 31)
            || (mapped[0] == 192 && mapped[1] == 168);
    }
}
