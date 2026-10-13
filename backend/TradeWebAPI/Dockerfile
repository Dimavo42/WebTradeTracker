FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/TradeWebAPI/TradeWebAPI.csproj backend/TradeWebAPI/
RUN dotnet restore backend/TradeWebAPI/TradeWebAPI.csproj

COPY . .
RUN dotnet publish backend/TradeWebAPI/TradeWebAPI.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "TradeWebAPI.dll"]