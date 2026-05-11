# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution + all csproj files first → better layer caching for restore
COPY BookKaroo.sln .
COPY src/BookKaroo.Api/BookKaroo.Api.csproj                         src/BookKaroo.Api/
COPY src/BookKaroo.Application/BookKaroo.Application.csproj         src/BookKaroo.Application/
COPY src/BookKaroo.Domain/BookKaroo.Domain.csproj                   src/BookKaroo.Domain/
COPY src/BookKaroo.Infrastructure/BookKaroo.Infrastructure.csproj   src/BookKaroo.Infrastructure/

RUN dotnet restore

# Copy all source files and publish
COPY . .
RUN dotnet publish src/BookKaroo.Api/BookKaroo.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# QuestPDF (PDF generation) requires libfontconfig + libfreetype on Linux
RUN apt-get update && apt-get install -y --no-install-recommends \
    libfontconfig1 \
    libfreetype6 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Render injects PORT at runtime (default 10000).
# ASPNETCORE_URLS is set dynamically by the app from the PORT env var.
ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "BookKaroo.Api.dll"]
