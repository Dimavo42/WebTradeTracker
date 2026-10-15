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
- **`market`** – a Yahoo Finance screener for the top stocks, ETFs and bond ETFs in 8 countries (filter by sector, search by name or ticker, choose how many results), plus live quotes and 5-year weekly price history, with a short in-memory cache and validated query DTOs
- Request logging middleware, a response-timing interceptor and CORS for the web and mobile clients

## Run

```bash
docker compose up -d --build
```

Then open http://localhost:3000.

<img width="1897" height="916" alt="pic1" src="https://github.com/user-attachments/assets/0946afa7-729f-4d84-9eff-529bf54c27ec" />
<img width="1862" height="900" alt="pic2" src="https://github.com/user-attachments/assets/ef74faa9-17a2-49b9-b441-018f9f74fc6b" />
<img width="1819" height="820" alt="pic3" src="https://github.com/user-attachments/assets/371a9936-4f42-415d-9428-6c3364c4df41" />
<img width="1184" height="674" alt="pic4" src="https://github.com/user-attachments/assets/80722636-ae24-4769-be40-6fa807851e50" />


