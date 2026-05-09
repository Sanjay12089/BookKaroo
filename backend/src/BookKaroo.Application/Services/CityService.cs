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
            var response = await client.GetStringAsync($"http://ip-api.com/json/{ip}?fields=city", ct);
            var doc = JsonDocument.Parse(response);
            if (!doc.RootElement.TryGetProperty("city", out var cityProp)) return null;
            var cityName = cityProp.GetString();
            if (string.IsNullOrWhiteSpace(cityName)) return null;

            var city = await _cities.FindByNameAsync(cityName, ct);
            if (city == null) return null;

            return new CityResponse(city.Id, city.Name, city.Slug, city.State, city.StateCode, city.Latitude, city.Longitude);
        }
        catch
        {
            return null;
        }
    }
}
