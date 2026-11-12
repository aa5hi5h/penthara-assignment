# Leave Management System

MERN stack leave management app with a React + shadcn/ui client and an Express + Prisma + MongoDB server.

## Run

```
npm i
npm start
```

- Client: http://localhost:5173
- API: http://localhost:5000

The first start downloads a MongoDB binary and creates the database in `server/data`. Data persists between restarts.
To use your own MongoDB (must be a replica set, e.g. Atlas), copy `server/.env.example` to `server/.env` and set `DATABASE_URL`.

## Demo accounts

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Employee | employee@company.com | employee123 |
| Admin    | admin@company.com    | admin123    |

## Features

- Mocked login with demo credentials shown on the login page
- Dashboard with leave balance and request summary
- Leave application form with weekday calculation, overlap and balance checks
- Leave history table with status and cancel for pending requests
- Admin view to approve or reject requests (approval deducts the employee balance)

## Structure

```
client/src/{components,pages,services,utils,assets,context}, App.js, index.js
server/src/{config,controllers,routes,middleware,lib,utils}, prisma/schema.prisma
```
