# Scout — Supabase Schema & Architecture

## Overview

Scout utilizes Supabase (PostgreSQL) and requires 11 core tables managed via
automated CLI migrations. Data access is strictly controlled via Row-Level
Security (RLS).

All executable SQL schema code is located in the `supabase/migrations/`
directory.

### Role Model

- **Owner**: Creates and manages the pet, invites sitters, and maintains full
  CRUD (Create, Read, Update, Delete) access to all relational data.
- **Sitter**: Granted limited access during an active, time-bound session. Can
  log actions and view specific data.

---

## Data Dictionary

| Table Name                | Description                                 | Key Relationships                                           |
| :------------------------ | :------------------------------------------ | :---------------------------------------------------------- |
| `users`                   | Owner and Sitter accounts.                  | Links to `auth.users`.                                      |
| `pets`                    | Core dog profiles.                          | Belongs to `users` (Owner).                                 |
| `action_logs`             | Daily care tracking (feed, play, medicine). | Belongs to `pets`, `users` (Logger), and `sitter_sessions`. |
| `fulfillment`             | Real-time care metrics (0-100%).            | 1:1 relationship with `pets`.                               |
| `xp_state`                | Gamification leveling system.               | 1:1 relationship with `pets`.                               |
| `achievements`            | Unlocked badges for pet milestones.         | Belongs to `pets`.                                          |
| `streaks`                 | Consecutive perfect day tracking.           | 1:1 relationship with `pets`.                               |
| `sitter_sessions`         | Time-bound access grants for caregivers.    | Belongs to `pets`, `users` (Owner & Sitter).                |
| `sitter_invites`          | Token-based invitations for new sitters.    | Belongs to `pets`, `users` (Owner).                         |
| `inventory`               | Pet supply tracking and restock dates.      | Belongs to `pets`.                                          |
| `product_recommendations` | AI-generated product suggestions.           | Belongs to `pets`.                                          |
| `health_insights`         | AI-generated weekly health analysis.        | Belongs to `pets`.                                          |

---

## Row-Level Security (RLS) Access Matrix

| Table Category                 | Owner Access           | Sitter Access (Active Session Only) |
| :----------------------------- | :--------------------- | :---------------------------------- |
| **Pets & Profiles**            | Read / Write           | Read Only                           |
| **Action Logs**                | Read / Write           | Read (Own) / Write (If Full Access) |
| **Fulfillment Metrics**        | Read Only              | Read / Update (If Full Access)      |
| **Gamification (XP, Streaks)** | Read Only              | Read Only                           |
| **Session Management**         | Create / Read / Update | Read Own Sessions Only              |
| **Inventory & Insights**       | Read / Write           | Read Only                           |

---

## Developer Setup Instructions

### 1. Configure the Supabase CLI

To apply the schema or make updates, use the Supabase CLI. Do not manually apply
SQL patches in the Supabase Dashboard.

```bash
# Initialize the project if not already done
supabase init

# Link to your remote project (fetch your ref ID from the dashboard url)
supabase link --project-ref <your-project-ref>

# Apply the migrations to the database
supabase db push
```
