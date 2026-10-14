# WebTradeTracker

A trading journal app: browse live stock prices, pick stocks to follow, log your trades, and view 5-year price charts.


## Tech Stack

- **Frontend:** React + TypeScript (Vite), Redux Toolkit for state management
- **Mobile:** React Native (Expo)
- **BFF:** NestJS, with live market data from Yahoo Finance (`yahoo-finance2`)
- **Backend:** .NET 8 Web API, Entity Framework Core, SQL Server
- **Auth:** JWT authentication implemented in .NET
- **DevOps:** Docker Compose

## Architecture

```
React (Redux)  ─┐
                ├─►  NestJS BFF  ─►  .NET 8 Web API  ─►  SQL Server
React Native   ─┘        │
                         └─►  Yahoo Finance (live prices, 5-year history)
```

### Backend – .NET 8 Web API

- **Layered architecture:** Controllers → Services → Repositories, with a Unit of Work over EF Core
- **Auth:** register/login with BCrypt password hashing and JWT Bearer tokens
- **Data:** Entity Framework Core with SQL Server and code-first migrations (applied on startup)
- **Mapping & validation:** AutoMapper profiles for DTOs, a dedicated trade validator
- **Middleware:** global exception handling and request logging
- **API docs:** Swagger / OpenAPI
- **Tests:** xUnit, Moq and FluentAssertions

### BFF – NestJS

A Backend-for-Frontend that sits between the clients and the .NET API:

- **`auth`** – proxies login/register to the .NET API
- **`journal`** – trades and stocks in one module, protected by a JWT guard (Passport) that verifies the .NET-issued token
- **`market`** – live quotes for 50 popular stocks and 5-year weekly price history from Yahoo Finance, with a short in-memory cache
- Request logging middleware, a response-timing interceptor and CORS for the web and mobile clients

## Run

```bash
docker compose up -d --build
```

Then open http://localhost:3000.
