

# Database-as-a-Service (DBaaS) Dashboard

A full-featured, colorful & modern dashboard where developers can create databases, manage API keys, and perform CRUD operations — all powered by React + Supabase.

---

## 1. Authentication
- **Sign up & login** with email/password
- Protected routes — unauthenticated users redirected to `/auth`
- Proper error handling (duplicate accounts, wrong password, etc.)

---

## 2. Dashboard Home
- Welcome banner with user's project count and usage summary
- Quick-action cards: "Create Database", "View API Keys", "Documentation"
- At-a-glance usage metrics: total requests, databases, storage used
- Colorful gradient header and modern card-based layout

---

## 3. Database Management
- **Create new databases** with a name and optional description
- List all databases in a clean table/card view with status indicators
- View database details: tables, row counts, created date
- **Create tables** within a database, defining columns (name, type, nullable, default)
- **Delete databases and tables** with confirmation dialogs

---

## 4. API Key Management
- Auto-generate an API key per database on creation
- View, copy, and regenerate API keys
- Show connection snippets (curl, JavaScript fetch, PHP) that developers can copy
- Revoke/delete API keys

---

## 5. REST API (Supabase Edge Functions)
- Edge function endpoints that act as the developer-facing API:
  - **Insert** rows into a table
  - **Select** rows with basic filtering
  - **Update** rows by ID
  - **Delete** rows by ID
- All endpoints authenticated via the developer's API key
- Returns JSON responses with proper error handling

---

## 6. Data Explorer
- In-dashboard UI to browse and edit data in any created table
- Inline CRUD: add rows, edit cells, delete rows
- Pagination and basic column sorting

---

## 7. Query Logs & Usage Metrics
- Log every API request (endpoint, method, timestamp, status)
- Usage charts (requests over time) using Recharts
- Filter logs by database, method, or date range

---

## 8. Settings & Profile
- Update display name
- Change password
- Logout

---

## Design Direction
- **Colorful & modern** style inspired by Vercel/Railway
- Vibrant gradient accents on headers and CTAs
- Clean card-based layouts with subtle shadows
- Responsive for desktop and tablet

---

## Backend Architecture (Supabase)
- **Tables**: `databases`, `database_tables`, `table_columns`, `table_rows`, `api_keys`, `query_logs`, `user_roles`
- **Edge Functions**: public REST API endpoint that validates API keys and performs CRUD on the developer's data
- **RLS policies**: users can only access their own databases and keys

