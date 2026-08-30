# API Contract

All endpoints except `/api/auth/*` require an `Authorization: Bearer
<token>` header (get the token from register/login). All request/response
bodies are JSON.

This doc should be kept up to date as endpoints are actually built —
treat it as the source of truth both sides of the team code against.
If a response shape changes while you're building, update this file in
the same PR.

## Auth

### `POST /api/auth/register`
Request: `{ name, email, password }`
Response `201`: `{ token, user: { id, name, email } }`
Errors: `400` missing fields, `409` email already registered

### `POST /api/auth/login`
Request: `{ email, password }`
Response `200`: `{ token, user: { id, name, email } }`
Errors: `400` missing fields, `401` wrong email/password

## Boards

### `GET /api/boards`
Boards the logged-in user owns or is a member of.
Response `200`: `[{ id, name, owner, members: [] }, ...]`

### `POST /api/boards`
Request: `{ name }`
Response `201`: `{ id, name, owner, members: [] }` — created with three
default columns (To Do / Doing / Done).

### `GET /api/boards/:id`
Response `200`: `{ id, name, owner, members: [] }`
Errors: `404` not found

### `PATCH /api/boards/:id`
Request: `{ name }`
Response `200`: updated board

### `DELETE /api/boards/:id`
Deletes the board and all its columns/tasks.
Response `204`: no body

### `POST /api/boards/:id/share`
Request: `{ email }`
Response `200`: updated board (with the new member added) — exact
behavior TBD, see the note in `controllers/boardController.js`.

## Columns

### `GET /api/columns/board/:boardId`
Response `200`: `[{ id, boardId, title, order }, ...]`, sorted by order

### `POST /api/columns/board/:boardId`
Request: `{ title }`
Response `201`: `{ id, boardId, title, order }`

### `PATCH /api/columns/:id`
Request: `{ title }`
Response `200`: updated column

### `DELETE /api/columns/:id`
Deletes the column and all its tasks.
Response `204`: no body

## Tasks

### `GET /api/tasks/board/:boardId`
Every task across every column on the board.
Response `200`: `[{ id, columnId, boardId, title, description, dueDate, labels, assignee, order }, ...]`

### `POST /api/tasks/column/:columnId`
Request: `{ title, description?, dueDate?, labels?, assignee? }`
Response `201`: created task

### `PATCH /api/tasks/:id`
Request: any subset of `{ title, description, dueDate, labels, assignee }`
Response `200`: updated task

### `PATCH /api/tasks/:id/move`
Request: `{ columnId, order }`
Response `200`: updated task (with new `columnId`/`order`, and every
other task in the destination column renumbered)

### `DELETE /api/tasks/:id`
Response `204`: no body

## Error shape

Every error response (however it happens):
```
{ "error": "human-readable message" }
```

## Status while backend is being built

Every route above already exists in the codebase. Any endpoint not
yet implemented returns:
```
501 { "error": "<name> not implemented yet — see controllers/<file>.js" }
```
so you can tell at a glance, while testing, which endpoints are real
vs. still TODO.
