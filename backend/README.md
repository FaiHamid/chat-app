# auth2

Node.js REST API with PostgreSQL, email activation, and JWT access/refresh tokens (Express + Sequelize).

---

## Assignment specification (English)

**Goal:** Build a **Node.js** backend with **Express** (ES modules) that uses **PostgreSQL** via **Sequelize**, implements **email-verified registration**, **login**, an **access + refresh token pair**, and at least one **protected endpoint**.

### Main requirements

1. **Setup** — Initialize the project (`"type": "module"`), wire **Express**, **CORS**, **dotenv**, JSON body parser, and **cookies** (e.g. `cookie-parser`). Connect **Sequelize** to **PostgreSQL** using environment variables. On startup, sync the schema with the database (`sync` / `alter` as appropriate).

2. **Models** — **User:** `email` (unique), `password` (bcrypt hash only), `activationToken` (e.g. UUID). **Token:** store the **refresh token** per user (one user ↔ one token row, or equivalent upsert logic).

3. **Registration and activation** — `POST /registration`: validate `email` / `password`, hash password, save user with temporary `activationToken`. Send email (**Nodemailer**, SMTP) with `{HOST}/activate/{activationToken}`. `GET /activate/:activationToken`: find user, clear `activationToken`.

4. **JWT** — Short-lived **access token** (`JWT_SECRET`). Longer-lived **refresh token** (`JWT_REFRESH_SECRET`). Payload at least `id` and `email` (or equivalent).

5. **Login** — `POST /login`: verify password, issue tokens, persist refresh in DB, return `user` + `accessToken`, set refresh in **HttpOnly** cookie.

6. **Refresh and logout** — `POST /refresh`: read refresh from cookie, verify JWT, rotate tokens in DB. `POST /logout`: delete token row, clear cookie.

7. **Protection** — Middleware: `Authorization: Bearer <accessToken>`, verify access JWT → **401** on failure.

8. **Example protected route** — e.g. `GET /users` — list users only with valid access token.

9. **Errors** — Global error middleware for unhandled failures (e.g. **500** with a generic message).

10. **Configuration** — `.env`: database settings, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `HOST` (activation links), SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`), `PORT`.

11. **Structure** — **routes → controllers → services → models**; separate middlewares for auth and errors.

---

## Специфікація завдання (українською)

**Мета:** бекенд на **Node.js** + **Express** (ES modules), **PostgreSQL** через **Sequelize**, **реєстрація з підтвердженням email**, **логін**, **access + refresh JWT**, **захищений ендпоінт**.

### Основні пункти

1. **Інфраструктура** — Express, CORS, dotenv, JSON, cookies; Sequelize + PostgreSQL з `.env`; синхронізація схеми БД при старті.

2. **Моделі** — **User:** email (унікальний), password (лише bcrypt-хеш), activationToken. **Token:** refresh token у БД, зв’язок один користувач — один запис (або оновлення).

3. **Реєстрація / активація** — `POST /registration`, лист з посиланням активації, `GET /activate/:activationToken`, очистка `activationToken`.

4. **JWT** — окремі секрети для access і refresh, різний термін дії.

5. **Логін** — перевірка пароля, збереження refresh у БД, відповідь з `accessToken`, refresh у HttpOnly cookie.

6. **Refresh / logout** — оновлення пари токенів; вихід — видалення refresh з БД і cookie.

7. **Middleware** — Bearer access token, 401 при невалідному токені.

8. **Приклад** — `GET /users` лише для авторизованих.

9. **Помилки** — глобальний error middleware.

10. **`.env`** — БД, JWT-секрети, HOST, SMTP, PORT.

11. **Структура** — routes, controllers, services, models, middlewares.

---

## API routes (reference)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/registration` | Register; sends activation email |
| GET | `/activate/:activationToken` | Activate account |
| POST | `/login` | Login; sets refresh cookie |
| POST | `/refresh` | New tokens from refresh cookie |
| POST | `/logout` | Invalidate refresh |
| GET | `/users` | Protected list (Bearer access token) |

---

## Environment variables

Set these in `.env` (names align with the codebase):

- **Database:** `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT`
- **JWT:** `JWT_SECRET`, `JWT_REFRESH_SECRET`
- **App / links:** `HOST` (base URL for activation emails), `PORT` (optional; default may be `8000`)
- **SMTP:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

---

## Scripts

```bash
npm install
npm start
```

`npm start` runs `nodemon src/app.js`.

Ensure PostgreSQL is running and the database exists before starting the server.
