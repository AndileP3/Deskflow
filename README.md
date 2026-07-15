# DeskFlow — Internal IT Service Request Portal

A full-stack ticketing system where **Employees** submit IT tickets and **Admins**
manage and resolve them. Built with React, Node.js/Express, MongoDB (Mongoose),
JWT auth, and Swagger/OpenAPI documentation.

---

## 1. What's in this repo

```
deskflow/
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # login logic, JWT signing
│   │   └── ticketController.js# create / get / update ticket logic
│   ├── middleware/
│   │   ├── auth.js            # protect() + authorize() (role guard)
│   │   └── errorHandler.js    # centralized error + 404 handling
│   ├── models/
│   │   ├── User.js            # Mongoose schema, bcrypt password hashing
│   │   └── Ticket.js          # Mongoose schema, enums for priority/status
│   ├── routes/
│   │   ├── authRoutes.js      # POST /api/auth/login (+ Swagger docs)
│   │   └── ticketRoutes.js    # /api/tickets, /api/tickets/:id (+ Swagger docs)
│   ├── swagger.js             # OpenAPI spec generation (swagger-jsdoc)
│   ├── seed.js                # creates demo Employee + Admin + sample tickets
│   ├── server.js              # app entrypoint
│   ├── package.json
│   ├── .env.example           # copy to .env
│   └── .gitignore
│
├── frontend/                  # React SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/api.js         # axios instance, all API calls in one place
│   │   ├── context/AuthContext.js  # global login state via Context + Hooks
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Navbar.js
│   │   │   ├── TicketForm.js
│   │   │   ├── TicketList.js
│   │   │   ├── TicketItem.js
│   │   │   ├── EmployeeDashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js             # routes between Login / Employee / Admin views
│   │   ├── index.js
│   │   └── styles.css
│   ├── package.json
│   ├── .env.example           # copy to .env
│   └── .gitignore
│
├── postman/
│   └── DeskFlow.postman_collection.json   # v2.1 collection, every endpoint
│
└── README.md                  # you are here
```

---

## 2. Prerequisites

Install these before you start:

| Tool | Version | Check with |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| MongoDB | local install OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster | `mongod --version` |
| Git | any recent | `git --version` |
| Postman (optional, for API testing) | latest | — |

If you don't want to install MongoDB locally, create a free Atlas cluster and
grab its connection string (`mongodb+srv://...`) — you'll paste it into `.env`
in step 4.

---

## 3. Step-by-step setup

### Step 1 — Get the code into a Git repo

```bash
# from the deskflow/ folder
git init
git add .
git commit -m "chore: initial project scaffold"
```

Push to GitHub (create an empty repo on GitHub first, then):

```bash
git remote add origin https://github.com/<your-username>/deskflow.git
git branch -M main
git push -u origin main
```

From here on, **commit as you go** (see Section 7 — Git hygiene matters for grading).

### Step 2 — Backend: install dependencies

```bash
cd backend
npm install
```

### Step 3 — Backend: configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/deskflow
JWT_SECRET=some_long_random_string_at_least_32_chars
JWT_EXPIRES_IN=8h
```

- If using Atlas, replace `MONGO_URI` with your Atlas connection string.
- Generate a strong `JWT_SECRET` quickly with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

`.env` is already listed in `.gitignore` — never commit it.

### Step 4 — Start MongoDB (if running locally)

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or just run it directly
mongod --dbpath /path/to/your/data/dir
```

Skip this step if you're using Atlas — it's already running in the cloud.

### Step 5 — Seed demo users

This creates one Employee and one Admin account, plus two sample tickets, so
the login screen has real accounts to test against:

```bash
npm run seed
```

You should see:
```
Employee login -> employee@deskflow.com / password123
Admin login    -> admin@deskflow.com / password123
```

### Step 6 — Run the backend

```bash
npm run dev
```

You should see:
```
[DB] MongoDB connected: 127.0.0.1
[SERVER] DeskFlow API running on port 5000
[SERVER] Swagger docs at http://localhost:5000/api-docs
```

Visit **http://localhost:5000/api-docs** to see the live, interactive
Swagger/OpenAPI documentation for every endpoint.

Quick sanity check:
```bash
curl http://localhost:5000/api/health
```

### Step 7 — Frontend: install and configure

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` should contain:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 8 — Run the frontend

```bash
npm start
```

This opens **http://localhost:3000**. The login screen has demo credentials
pre-filled — toggle between Employee and Admin and click "Log in" to test both
role-based views.

### Step 9 — Test the API directly with Postman (optional but recommended)

1. Open Postman → Import → select `postman/DeskFlow.postman_collection.json`.
2. The collection includes a `baseUrl` variable already set to
   `http://localhost:5000/api`.
3. Run **Auth → Login as Employee** and **Auth → Login as Admin** first — each
   request has a test script that automatically saves the returned JWT into
   `employeeToken` / `adminToken` collection variables.
4. Run any other request — they already reference `{{employeeToken}}` /
   `{{adminToken}}` in their Authorization headers.
5. "Create Ticket" auto-saves the new ticket's `_id` into `{{ticketId}}` for
   the update request to reuse.

---

## 4. How the pieces fit together (architecture)

```
┌─────────────┐        JWT in           ┌──────────────┐        Mongoose        ┌───────────┐
│   React     │  Authorization header   │   Express     │        queries         │  MongoDB  │
│  (port 3000)│ ───────────────────────▶│  (port 5000)  │ ──────────────────────▶│           │
└─────────────┘◀─────────────────────── └──────────────┘◀────────────────────── └───────────┘
                     JSON responses
```

**Auth flow:**
1. User submits email/password on the Login screen.
2. `POST /api/auth/login` checks the hashed password (bcrypt) and, on success,
   signs a JWT containing `{ id, role }`.
3. Frontend stores the token + user object in `localStorage` and attaches the
   token to every subsequent request via an axios interceptor
   (`frontend/src/api/api.js`).
4. On the backend, `middleware/auth.js`'s `protect` middleware verifies the
   token on every protected route, and `authorize('Admin')` /
   `authorize('Employee')` enforces role-based access at the route level.

**Role-based data scoping** happens in `ticketController.js`'s `getTickets`:
- If `req.user.role === 'Employee'`, the Mongo query filters
  `{ createdBy: req.user._id }`.
- Admins get no filter — they see every ticket, and each ticket is
  `.populate()`-d with the creator's name/email so the Admin dashboard can
  show who submitted it.

**Error handling** is centralized: every controller wraps its logic in
try/catch and calls `next(err)` on failure. `middleware/errorHandler.js`
inspects the error type (Mongoose `CastError`, `ValidationError`, duplicate
key, or a thrown error with `.statusCode`) and returns the right HTTP status
(400/401/403/404/500) with a consistent `{ success: false, message }` shape.
Unknown routes hit `notFound` and return a clean 404 instead of crashing.

---

## 5. API Reference (summary)

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Returns `{ token, user }` |
| POST | `/api/tickets` | Employee | Create a ticket (`title`, `description`, `priority`) |
| GET | `/api/tickets` | Employee, Admin | Employee: own tickets. Admin: all tickets. Supports `?status=` filter |
| PUT | `/api/tickets/:id` | Admin | Update `status` (`Open`, `In Progress`, `Resolved`) |
| GET | `/api/health` | Public | Health check |

Full interactive docs: `http://localhost:5000/api-docs` (once the backend is running).

---

## 6. Security & validation notes

- Passwords are hashed with **bcrypt** before storage (`User.js` pre-save hook) — never stored in plaintext.
- JWTs are signed with a server-side secret (`JWT_SECRET`) and expire (`JWT_EXPIRES_IN`).
- `express-validator` validates every request body (`title`/`description`/`priority`/`status`) and returns `400` with field-level messages on failure — malformed payloads never crash the server.
- Role checks happen server-side (`authorize()` middleware), not just hidden in the UI — an Employee token literally cannot call `PUT /api/tickets/:id` (returns `403`).
- `.env` (DB connection string, JWT secret, port) is excluded from Git via `.gitignore` in both `backend/` and `frontend/`.

---

## 7. Suggested 5-day commit plan (for Git hygiene)

Mirrors the sprint schedule in the brief — commit at each milestone rather than one giant commit at the end:

```
Day 1
  feat: initialize express app and connect mongodb
  feat: add User and Ticket mongoose schemas
  feat: scaffold auth and ticket route files

Day 2
  feat: implement login controller with jwt signing
  feat: implement ticket create/get/update controllers
  feat: add role-based auth middleware
  feat: add centralized error handler and 404 handler
  feat: add swagger/openapi documentation
  test: verify all endpoints via postman collection

Day 3
  feat: bootstrap react app with CRA
  feat: build Login, Navbar, and dashboard shell components
  feat: add AuthContext for global login state

Day 4
  feat: connect TicketForm to POST /api/tickets
  feat: connect TicketList to GET /api/tickets
  feat: implement admin inline status updates via PUT
  fix: handle loading and error states in dashboards

Day 5
  style: polish UI and responsive layout
  fix: edge case error handling cleanup
  docs: finalize README and postman collection
  chore: final repo cleanup before submission
```

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `MongoServerError: connect ECONNREFUSED` | MongoDB isn't running | Start `mongod`, or check your Atlas connection string |
| `401 Not authorized` on every request | Missing/expired token | Log in again; confirm `Authorization: Bearer <token>` header is sent |
| Frontend shows network error | Backend not running, or wrong `REACT_APP_API_URL` | Confirm backend is on port 5000, check `frontend/.env` |
| `403 Forbidden` when updating a ticket | Logged in as Employee | Only Admin accounts can update ticket status by design |
| CORS error in browser console | Backend `cors()` not applied, or wrong port | Confirm `app.use(cors())` in `server.js`, restart backend |

---

## 9. Suggested next steps beyond the MVP

- Ticket comments/audit trail (who changed status and when)
- Pagination on `GET /api/tickets` for large datasets
- Real user registration + password reset flow
- File attachments on tickets (e.g. screenshots)
- Email notifications on status change
