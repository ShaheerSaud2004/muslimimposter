# Khafī Leaderboard API

Small Express + Postgres API for the global leaderboard. Deploy to DigitalOcean App Platform or any Node host.

## Setup

1. **Create a Postgres database** (e.g. DigitalOcean Managed Database).

2. **Run the schema** once:
   ```bash
   psql "$DATABASE_URL" -f schema.sql
   ```
   Or paste the contents of `schema.sql` into your DB console.

3. **Set environment variable**:
   - `DATABASE_URL` – Postgres connection string (e.g. `postgresql://user:pass@host:25060/defaultdb?sslmode=require`).

4. **Install and run**:
   ```bash
   cd leaderboard-api
   npm install
   PORT=8080 npm start
   ```

## Deploy to DigitalOcean (all via CLI)

**Prereqs:** [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) installed and authenticated (`doctl auth init`), `psql` installed, and this repo pushed to GitHub on `main`.

**One-shot deploy** (creates DB, runs schema, creates App):

```bash
cd leaderboard-api
GITHUB_REPO=yourusername/muslimimposter ./deploy-do.sh
```

The script will:

1. Create a Managed Postgres cluster named `khafi-leaderboard-db` (or reuse it if it exists).
2. Run `schema.sql` against it (using `psql` and the connection URI from doctl).
3. Create the App from `app-spec.yaml`, substituting your `GITHUB_REPO`. The spec links the app to that database and sets `DATABASE_URL` via the bindable variable.

**Manual steps** (if you prefer not to use the script):

1. Create DB: `doctl databases create khafi-leaderboard-db --region nyc1 --size db-s-1vcpu-1gb --engine pg --num-nodes 1 --wait`
2. Get URI: `doctl databases connection <cluster-id> --format URI`
3. Run schema: `psql "<URI>" -f schema.sql`
4. Edit `app-spec.yaml`: set `repo: yourusername/muslimimposter` under `github`.
5. Create app: `doctl apps create --spec app-spec.yaml`

**After deploy:** Get the app URL with `doctl apps list` (or in the create output). Set `EXPO_PUBLIC_LEADERBOARD_API_URL` to that URL (e.g. `https://khafi-leaderboard-api-xxxxx.ondigitalocean.app`) when building the Khafī app.

## Endpoints

- `POST /leaderboard/submit` – body: `{ device_id, display_name, won, imposter_win }`. Upserts one round for this device.
- `GET /leaderboard?limit=50&device_id=xxx` – returns `{ top: [...], me: { rank, ... } | null }`.
- `GET /health` – health check.
