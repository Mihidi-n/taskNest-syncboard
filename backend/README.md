# CollabBoard — Backend

Express + MongoDB (Mongoose) + JWT auth. Structured as
`routes/controllers/models`, per the brief's requirement.

## Setup

```
cd backend
cp .env.example .env      # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev                # restarts on file changes
```

Needs a MongoDB database reachable at `MONGODB_URI` — reuse the Atlas
cluster your group already set up for the earlier syncboard exercise,
or point at a local `mongod`. **Everyone on the backend should point
at the same database** while building this together, so you all see
each other's test data and don't each end up debugging against an
empty DB.

Once running, confirm it's alive:
```
curl http://localhost:4000/health
```

## Folder guide

```
backend/
├── server.js            Entry point — Express app, Mongo connection, route mounting
├── config/db.js          Mongoose connection helper
├── models/                Mongoose schemas: User, Board, Column, Task
├── controllers/           Route handler logic — mostly TODO stubs, see TEAM_TASKS_BACKEND.md
├── routes/                URL → controller wiring — already complete, don't need edits
├── middleware/auth.js     JWT verification — TODO stub (see TEAM_TASKS_BACKEND.md)
├── scripts/seed.js        Populates test data directly via the models
└── serialize.js           Converts Mongoose docs to the plain shape the frontend expects
```

**Every route already exists and the server boots as-is** — hitting
any endpoint before its controller is built returns a `501 Not
Implemented` with a message pointing at which file to open. That's
expected; it's how 7 people can build this in parallel. See
`TEAM_TASKS_BACKEND.md` for who's building what.

## Why routes/controllers/models (and not everything in one file)

The brief specifically asks for this split. In practice it also means
whoever's building the Task endpoints never has to open the file
whoever's building Board endpoints is working in — each owns their own
model + controller + route trio, and merge conflicts stay rare.

## Once controllers are built: testing without the frontend

```
npm run seed
```
creates a test user, board, columns, and a couple of tasks directly in
the database (bypassing the API, since it doesn't need any controller
to be finished). Useful for testing endpoints with `curl` or Postman
before the frontend is wired up. See `API_CONTRACT.md` for exact
request/response shapes to test against.

## Connecting the frontend

Once endpoints are working, the frontend's `useBoards.js` hook (currently
using in-memory mock state) needs to be swapped to call this API
instead — see `TEAM_TASKS_BACKEND.md`, "Frontend integration" for that
scope. `frontend/.env` will need `VITE_API_URL=http://localhost:4000/api`
(or wherever this is deployed later).
