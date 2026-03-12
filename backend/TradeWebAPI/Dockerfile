FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["TradeWebAPI/TradeWebAPI.csproj", "TradeWebAPI/"]
RUN dotnet restore "TradeWebAPI/TradeWebAPI.csproj"

COPY . .
WORKDIR "/src/TradeWebAPI"
RUN dotnet publish "TradeWebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TradeWebAPI.dll"]