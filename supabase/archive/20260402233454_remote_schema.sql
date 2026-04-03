drop extension if exists "pg_net";

drop policy "Owner can view achievements" on "public"."achievements";

drop policy "Sitter can view achievements" on "public"."achievements";

drop policy "Owner can log actions" on "public"."action_logs";

drop policy "Owner can view action logs" on "public"."action_logs";

drop policy "Sitter can log actions during session" on "public"."action_logs";

drop policy "Sitter can view session logs" on "public"."action_logs";

drop policy "Owner can view fulfillment" on "public"."fulfillment";

drop policy "Sitter can update fulfillment" on "public"."fulfillment";

drop policy "Sitter can view fulfillment" on "public"."fulfillment";

drop policy "Owner can view health insights" on "public"."health_insights";

drop policy "Owner can manage inventory" on "public"."inventory";

drop policy "Owner can update inventory" on "public"."inventory";

drop policy "Owner can view inventory" on "public"."inventory";

drop policy "Sitter can view inventory" on "public"."inventory";

drop policy "Owner can create pet" on "public"."pets";

drop policy "Owner can delete pet" on "public"."pets";

drop policy "Owner can update own pet" on "public"."pets";

drop policy "Owner can view own pet" on "public"."pets";

drop policy "Sitter can view pet during session" on "public"."pets";

drop policy "Owner can view recommendations" on "public"."product_recommendations";

drop policy "Sitter can view recommendations" on "public"."product_recommendations";

drop policy "Owner can create invites" on "public"."sitter_invites";

drop policy "Owner can delete invites" on "public"."sitter_invites";

drop policy "Owner can view invites" on "public"."sitter_invites";

drop policy "Sitter can claim invite" on "public"."sitter_invites";

drop policy "Owner can create sitter session" on "public"."sitter_sessions";

drop policy "Owner can update sitter session" on "public"."sitter_sessions";

drop policy "Owner can view sitter sessions" on "public"."sitter_sessions";

drop policy "Sitter can view own sessions" on "public"."sitter_sessions";

drop policy "Owner can view streaks" on "public"."streaks";

drop policy "Sitter can view streaks" on "public"."streaks";

drop policy "Users can update own profile" on "public"."users";

drop policy "Users can view own profile" on "public"."users";

drop policy "Owner can view xp_state" on "public"."xp_state";

drop policy "Sitter can view xp_state" on "public"."xp_state";

revoke delete on table "public"."achievements" from "anon";

revoke insert on table "public"."achievements" from "anon";

revoke references on table "public"."achievements" from "anon";

revoke select on table "public"."achievements" from "anon";

revoke trigger on table "public"."achievements" from "anon";

revoke truncate on table "public"."achievements" from "anon";

revoke update on table "public"."achievements" from "anon";

revoke delete on table "public"."achievements" from "authenticated";

revoke insert on table "public"."achievements" from "authenticated";

revoke references on table "public"."achievements" from "authenticated";

revoke select on table "public"."achievements" from "authenticated";

revoke trigger on table "public"."achievements" from "authenticated";

revoke truncate on table "public"."achievements" from "authenticated";

revoke update on table "public"."achievements" from "authenticated";

revoke delete on table "public"."achievements" from "service_role";

revoke insert on table "public"."achievements" from "service_role";

revoke references on table "public"."achievements" from "service_role";

revoke select on table "public"."achievements" from "service_role";

revoke trigger on table "public"."achievements" from "service_role";

revoke truncate on table "public"."achievements" from "service_role";

revoke update on table "public"."achievements" from "service_role";

revoke delete on table "public"."action_logs" from "anon";

revoke insert on table "public"."action_logs" from "anon";

revoke references on table "public"."action_logs" from "anon";

revoke select on table "public"."action_logs" from "anon";

revoke trigger on table "public"."action_logs" from "anon";

revoke truncate on table "public"."action_logs" from "anon";

revoke update on table "public"."action_logs" from "anon";

revoke delete on table "public"."action_logs" from "authenticated";

revoke insert on table "public"."action_logs" from "authenticated";

revoke references on table "public"."action_logs" from "authenticated";

revoke select on table "public"."action_logs" from "authenticated";

revoke trigger on table "public"."action_logs" from "authenticated";

revoke truncate on table "public"."action_logs" from "authenticated";

revoke update on table "public"."action_logs" from "authenticated";

revoke delete on table "public"."action_logs" from "service_role";

revoke insert on table "public"."action_logs" from "service_role";

revoke references on table "public"."action_logs" from "service_role";

revoke select on table "public"."action_logs" from "service_role";

revoke trigger on table "public"."action_logs" from "service_role";

revoke truncate on table "public"."action_logs" from "service_role";

revoke update on table "public"."action_logs" from "service_role";

revoke delete on table "public"."fulfillment" from "anon";

revoke insert on table "public"."fulfillment" from "anon";

revoke references on table "public"."fulfillment" from "anon";

revoke select on table "public"."fulfillment" from "anon";

revoke trigger on table "public"."fulfillment" from "anon";

revoke truncate on table "public"."fulfillment" from "anon";

revoke update on table "public"."fulfillment" from "anon";

revoke delete on table "public"."fulfillment" from "authenticated";

revoke insert on table "public"."fulfillment" from "authenticated";

revoke references on table "public"."fulfillment" from "authenticated";

revoke select on table "public"."fulfillment" from "authenticated";

revoke trigger on table "public"."fulfillment" from "authenticated";

revoke truncate on table "public"."fulfillment" from "authenticated";

revoke update on table "public"."fulfillment" from "authenticated";

revoke delete on table "public"."fulfillment" from "service_role";

revoke insert on table "public"."fulfillment" from "service_role";

revoke references on table "public"."fulfillment" from "service_role";

revoke select on table "public"."fulfillment" from "service_role";

revoke trigger on table "public"."fulfillment" from "service_role";

revoke truncate on table "public"."fulfillment" from "service_role";

revoke update on table "public"."fulfillment" from "service_role";

revoke delete on table "public"."health_insights" from "anon";

revoke insert on table "public"."health_insights" from "anon";

revoke references on table "public"."health_insights" from "anon";

revoke select on table "public"."health_insights" from "anon";

revoke trigger on table "public"."health_insights" from "anon";

revoke truncate on table "public"."health_insights" from "anon";

revoke update on table "public"."health_insights" from "anon";

revoke delete on table "public"."health_insights" from "authenticated";

revoke insert on table "public"."health_insights" from "authenticated";

revoke references on table "public"."health_insights" from "authenticated";

revoke select on table "public"."health_insights" from "authenticated";

revoke trigger on table "public"."health_insights" from "authenticated";

revoke truncate on table "public"."health_insights" from "authenticated";

revoke update on table "public"."health_insights" from "authenticated";

revoke delete on table "public"."health_insights" from "service_role";

revoke insert on table "public"."health_insights" from "service_role";

revoke references on table "public"."health_insights" from "service_role";

revoke select on table "public"."health_insights" from "service_role";

revoke trigger on table "public"."health_insights" from "service_role";

revoke truncate on table "public"."health_insights" from "service_role";

revoke update on table "public"."health_insights" from "service_role";

revoke delete on table "public"."users" from "anon";

revoke insert on table "public"."users" from "anon";

revoke references on table "public"."users" from "anon";

revoke select on table "public"."users" from "anon";

revoke trigger on table "public"."users" from "anon";

revoke truncate on table "public"."users" from "anon";

revoke update on table "public"."users" from "anon";

revoke delete on table "public"."users" from "authenticated";

revoke insert on table "public"."users" from "authenticated";

revoke references on table "public"."users" from "authenticated";

revoke select on table "public"."users" from "authenticated";

revoke trigger on table "public"."users" from "authenticated";

revoke truncate on table "public"."users" from "authenticated";

revoke update on table "public"."users" from "authenticated";

revoke delete on table "public"."users" from "service_role";

revoke insert on table "public"."users" from "service_role";

revoke references on table "public"."users" from "service_role";

revoke select on table "public"."users" from "service_role";

revoke trigger on table "public"."users" from "service_role";

revoke truncate on table "public"."users" from "service_role";

revoke update on table "public"."users" from "service_role";

revoke delete on table "public"."xp_state" from "anon";

revoke insert on table "public"."xp_state" from "anon";

revoke references on table "public"."xp_state" from "anon";

revoke select on table "public"."xp_state" from "anon";

revoke trigger on table "public"."xp_state" from "anon";

revoke truncate on table "public"."xp_state" from "anon";

revoke update on table "public"."xp_state" from "anon";

revoke delete on table "public"."xp_state" from "authenticated";

revoke insert on table "public"."xp_state" from "authenticated";

revoke references on table "public"."xp_state" from "authenticated";

revoke select on table "public"."xp_state" from "authenticated";

revoke trigger on table "public"."xp_state" from "authenticated";

revoke truncate on table "public"."xp_state" from "authenticated";

revoke update on table "public"."xp_state" from "authenticated";

revoke delete on table "public"."xp_state" from "service_role";

revoke insert on table "public"."xp_state" from "service_role";

revoke references on table "public"."xp_state" from "service_role";

revoke select on table "public"."xp_state" from "service_role";

revoke trigger on table "public"."xp_state" from "service_role";

revoke truncate on table "public"."xp_state" from "service_role";

revoke update on table "public"."xp_state" from "service_role";

alter table "public"."achievements" drop constraint "achievements_achievement_type_check";

alter table "public"."achievements" drop constraint "achievements_pet_id_achievement_type_key";

alter table "public"."achievements" drop constraint "achievements_pet_id_fkey";

alter table "public"."action_logs" drop constraint "action_logs_activity_type_check";

alter table "public"."action_logs" drop constraint "action_logs_logger_id_fkey";

alter table "public"."action_logs" drop constraint "action_logs_pet_id_fkey";

alter table "public"."action_logs" drop constraint "fk_action_logs_session";

alter table "public"."fulfillment" drop constraint "fulfillment_exercise_percentage_check";

alter table "public"."fulfillment" drop constraint "fulfillment_hunger_percentage_check";

alter table "public"."fulfillment" drop constraint "fulfillment_medicine_percentage_check";

alter table "public"."fulfillment" drop constraint "fulfillment_pet_id_fkey";

alter table "public"."fulfillment" drop constraint "fulfillment_pet_id_key";

alter table "public"."health_insights" drop constraint "health_insights_pet_id_fkey";

alter table "public"."inventory" drop constraint "inventory_unit_check";

alter table "public"."sitter_invites" drop constraint "sitter_invites_accepted_by_id_fkey";

alter table "public"."sitter_invites" drop constraint "sitter_invites_invite_token_key";

alter table "public"."sitter_sessions" drop constraint "sitter_sessions_pet_id_sitter_id_start_date_end_date_key";

alter table "public"."sitter_sessions" drop constraint "sitter_sessions_role_check";

alter table "public"."streaks" drop constraint "streaks_pet_id_key";

alter table "public"."users" drop constraint "users_email_key";

alter table "public"."users" drop constraint "users_role_check";

alter table "public"."xp_state" drop constraint "xp_state_pet_id_fkey";

alter table "public"."xp_state" drop constraint "xp_state_pet_id_key";

alter table "public"."inventory" drop constraint "inventory_item_type_check";

alter table "public"."pets" drop constraint "pets_gender_check";

alter table "public"."pets" drop constraint "pets_owner_id_fkey";

alter table "public"."sitter_invites" drop constraint "sitter_invites_owner_id_fkey";

alter table "public"."sitter_sessions" drop constraint "sitter_sessions_owner_id_fkey";

alter table "public"."sitter_sessions" drop constraint "sitter_sessions_sitter_id_fkey";

alter table "public"."achievements" drop constraint "achievements_pkey";

alter table "public"."action_logs" drop constraint "action_logs_pkey";

alter table "public"."fulfillment" drop constraint "fulfillment_pkey";

alter table "public"."health_insights" drop constraint "health_insights_pkey";

alter table "public"."users" drop constraint "users_pkey";

alter table "public"."xp_state" drop constraint "xp_state_pkey";

drop index if exists "public"."achievements_pet_id_achievement_type_key";

drop index if exists "public"."achievements_pkey";

drop index if exists "public"."action_logs_pkey";

drop index if exists "public"."fulfillment_pet_id_key";

drop index if exists "public"."fulfillment_pkey";

drop index if exists "public"."health_insights_pkey";

drop index if exists "public"."idx_achievements_pet_id";

drop index if exists "public"."idx_action_logs_logged_at";

drop index if exists "public"."idx_action_logs_logger_id";

drop index if exists "public"."idx_action_logs_pet_id";

drop index if exists "public"."idx_fulfillment_pet_id";

drop index if exists "public"."idx_streaks_pet_id";

drop index if exists "public"."idx_users_email";

drop index if exists "public"."idx_users_role";

drop index if exists "public"."idx_xp_state_pet_id";

drop index if exists "public"."sitter_invites_invite_token_key";

drop index if exists "public"."sitter_sessions_pet_id_sitter_id_start_date_end_date_key";

drop index if exists "public"."streaks_pet_id_key";

drop index if exists "public"."users_email_key";

drop index if exists "public"."users_pkey";

drop index if exists "public"."xp_state_pet_id_key";

drop index if exists "public"."xp_state_pkey";

drop index if exists "public"."idx_sitter_invites_token";

drop table "public"."achievements";

drop table "public"."action_logs";

drop table "public"."fulfillment";

drop table "public"."health_insights";

drop table "public"."users";

drop table "public"."xp_state";


  create table "public"."care_logs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "pet_id" uuid not null,
    "logged_by_user_id" uuid,
    "sitter_access_id" uuid,
    "action_type" text not null,
    "details" jsonb not null default '{}'::jsonb,
    "logged_at" timestamp with time zone not null default now()
      );


alter table "public"."care_logs" enable row level security;


  create table "public"."daily_logs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "pet_id" uuid not null,
    "logger_id" uuid not null,
    "activity_type" text not null,
    "notes" text,
    "photo_url" text,
    "logged_at" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."daily_logs" enable row level security;


  create table "public"."daily_tasks" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "pet_id" uuid not null,
    "owner_id" uuid not null,
    "category" text not null,
    "label" text not null,
    "time" text,
    "note" text,
    "is_completed" boolean not null default false,
    "completed_at" timestamp with time zone,
    "date" date not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."daily_tasks" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "role" text not null default 'owner'::text,
    "display_name" text not null,
    "email" text not null,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."rewards" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "owner_id" uuid not null,
    "points" integer not null default 0,
    "feeding_streak_days" integer not null default 0,
    "last_fed_date" date,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."rewards" enable row level security;


  create table "public"."sitter_access" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "owner_id" uuid not null,
    "pet_id" uuid not null,
    "invite_token" text not null default encode(extensions.gen_random_bytes(16), 'hex'::text),
    "invite_email" text,
    "invite_expires_at" timestamp with time zone not null default (now() + '7 days'::interval),
    "is_active" boolean not null default true,
    "general_notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."sitter_access" enable row level security;


  create table "public"."user_settings" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "notifications" jsonb not null default '{"weeklyDigest": false, "sitterUpdates": true, "dailyReminders": true, "missedTaskAlerts": true}'::jsonb,
    "theme" text,
    "language" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."inventory" drop column "restock_date";

alter table "public"."inventory" add column "last_restocked_at" timestamp with time zone not null;

alter table "public"."inventory" alter column "created_at" set not null;

alter table "public"."inventory" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."inventory" alter column "quantity" drop default;

alter table "public"."inventory" alter column "quantity" set data type numeric(10,2) using "quantity"::numeric(10,2);

alter table "public"."inventory" alter column "updated_at" set not null;

alter table "public"."pets" drop column "age_months";

alter table "public"."pets" drop column "photo_url";

alter table "public"."pets" drop column "weight_lbs";

alter table "public"."pets" add column "date_of_birth" date;

alter table "public"."pets" add column "health_context" text;

alter table "public"."pets" add column "personality" text;

alter table "public"."pets" add column "species" text not null;

alter table "public"."pets" add column "weight" numeric(8,2);

alter table "public"."pets" alter column "created_at" set not null;

alter table "public"."pets" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."pets" alter column "is_spayed_neutered" drop default;

alter table "public"."pets" alter column "updated_at" set not null;

alter table "public"."product_recommendations" drop column "cached_at";

alter table "public"."product_recommendations" drop column "category";

alter table "public"."product_recommendations" drop column "chewy_link";

alter table "public"."product_recommendations" drop column "confidence";

alter table "public"."product_recommendations" drop column "description";

alter table "public"."product_recommendations" add column "brand" text not null;

alter table "public"."product_recommendations" add column "chewy_url" text not null;

alter table "public"."product_recommendations" add column "confidence_score" numeric(3,1) not null;

alter table "public"."product_recommendations" add column "created_at" timestamp with time zone not null default now();

alter table "public"."product_recommendations" add column "expires_at" timestamp with time zone not null;

alter table "public"."product_recommendations" add column "external_product_id" text not null;

alter table "public"."product_recommendations" add column "generated_at" timestamp with time zone not null;

alter table "public"."product_recommendations" add column "image_url" text;

alter table "public"."product_recommendations" add column "original_price" numeric(10,2);

alter table "public"."product_recommendations" add column "price" numeric(10,2) not null;

alter table "public"."product_recommendations" add column "reason_snippet" text;

alter table "public"."product_recommendations" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."sitter_invites" drop column "accepted_by_id";

alter table "public"."sitter_invites" drop column "invite_email";

alter table "public"."sitter_invites" drop column "invite_token";

alter table "public"."sitter_invites" drop column "is_claimed";

alter table "public"."sitter_invites" add column "accepted_at" timestamp with time zone;

alter table "public"."sitter_invites" add column "accepted_by" uuid;

alter table "public"."sitter_invites" add column "email" text not null;

alter table "public"."sitter_invites" add column "permissions_scope" text[] not null default ARRAY['read:pet'::text, 'read:logs'::text];

alter table "public"."sitter_invites" add column "role" text not null default 'view_only'::text;

alter table "public"."sitter_invites" add column "token" text not null;

alter table "public"."sitter_invites" add column "updated_at" timestamp with time zone not null default now();

alter table "public"."sitter_invites" alter column "created_at" set not null;

alter table "public"."sitter_invites" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."sitter_sessions" drop column "drop_off_time";

alter table "public"."sitter_sessions" drop column "end_date";

alter table "public"."sitter_sessions" drop column "is_active";

alter table "public"."sitter_sessions" drop column "pick_up_time";

alter table "public"."sitter_sessions" drop column "role";

alter table "public"."sitter_sessions" drop column "start_date";

alter table "public"."sitter_sessions" add column "ended_at" timestamp with time zone;

alter table "public"."sitter_sessions" add column "invite_id" uuid;

alter table "public"."sitter_sessions" add column "notes" text;

alter table "public"."sitter_sessions" add column "started_at" timestamp with time zone not null;

alter table "public"."sitter_sessions" add column "updated_at" timestamp with time zone not null default now();

alter table "public"."sitter_sessions" alter column "created_at" set not null;

alter table "public"."sitter_sessions" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."streaks" drop column "all_time_best";

alter table "public"."streaks" drop column "last_perfect_date";

alter table "public"."streaks" add column "category" text not null;

alter table "public"."streaks" add column "last_completed_date" date;

alter table "public"."streaks" alter column "created_at" set not null;

alter table "public"."streaks" alter column "current_streak" set not null;

alter table "public"."streaks" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."streaks" alter column "updated_at" set not null;

CREATE UNIQUE INDEX care_logs_pkey ON public.care_logs USING btree (id);

CREATE UNIQUE INDEX daily_logs_pkey ON public.daily_logs USING btree (id);

CREATE UNIQUE INDEX daily_tasks_pkey ON public.daily_tasks USING btree (id);

CREATE INDEX idx_care_logs_logged_at ON public.care_logs USING btree (logged_at DESC);

CREATE INDEX idx_care_logs_pet_id ON public.care_logs USING btree (pet_id);

CREATE INDEX idx_daily_logs_activity_type ON public.daily_logs USING btree (activity_type);

CREATE INDEX idx_daily_logs_logged_at ON public.daily_logs USING btree (logged_at);

CREATE INDEX idx_daily_logs_logger_id ON public.daily_logs USING btree (logger_id);

CREATE INDEX idx_daily_logs_pet_id ON public.daily_logs USING btree (pet_id);

CREATE INDEX idx_daily_logs_pet_logged ON public.daily_logs USING btree (pet_id, logged_at);

CREATE INDEX idx_daily_tasks_category ON public.daily_tasks USING btree (category);

CREATE INDEX idx_daily_tasks_is_completed ON public.daily_tasks USING btree (is_completed);

CREATE INDEX idx_daily_tasks_pet_date ON public.daily_tasks USING btree (pet_id, date);

CREATE INDEX idx_inventory_item_type ON public.inventory USING btree (item_type);

CREATE INDEX idx_pets_name ON public.pets USING btree (name);

CREATE INDEX idx_product_recommendations_expires_at ON public.product_recommendations USING btree (expires_at);

CREATE INDEX idx_product_recommendations_external_id ON public.product_recommendations USING btree (external_product_id);

CREATE INDEX idx_product_recommendations_pet_id ON public.product_recommendations USING btree (pet_id);

CREATE INDEX idx_profiles_email ON public.profiles USING btree (email);

CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);

CREATE INDEX idx_sitter_access_pet_id ON public.sitter_access USING btree (pet_id, is_active);

CREATE INDEX idx_sitter_access_token ON public.sitter_access USING btree (invite_token);

CREATE INDEX idx_sitter_invites_email ON public.sitter_invites USING btree (email);

CREATE INDEX idx_sitter_invites_expires_at ON public.sitter_invites USING btree (expires_at);

CREATE INDEX idx_sitter_invites_owner_id ON public.sitter_invites USING btree (owner_id);

CREATE INDEX idx_sitter_invites_pet_id ON public.sitter_invites USING btree (pet_id);

CREATE INDEX idx_sitter_sessions_dates ON public.sitter_sessions USING btree (started_at, ended_at);

CREATE INDEX idx_sitter_sessions_owner_id ON public.sitter_sessions USING btree (owner_id);

CREATE INDEX idx_streaks_pet_category ON public.streaks USING btree (pet_id, category);

CREATE INDEX idx_user_settings_user_id ON public.user_settings USING btree (user_id);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX rewards_owner_id_key ON public.rewards USING btree (owner_id);

CREATE UNIQUE INDEX rewards_pkey ON public.rewards USING btree (id);

CREATE UNIQUE INDEX sitter_access_invite_token_key ON public.sitter_access USING btree (invite_token);

CREATE UNIQUE INDEX sitter_access_pkey ON public.sitter_access USING btree (id);

CREATE UNIQUE INDEX sitter_invites_token_key ON public.sitter_invites USING btree (token);

CREATE UNIQUE INDEX streaks_pet_id_category_key ON public.streaks USING btree (pet_id, category);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (id);

CREATE UNIQUE INDEX user_settings_user_id_key ON public.user_settings USING btree (user_id);

CREATE INDEX idx_sitter_invites_token ON public.sitter_invites USING btree (token);

alter table "public"."care_logs" add constraint "care_logs_pkey" PRIMARY KEY using index "care_logs_pkey";

alter table "public"."daily_logs" add constraint "daily_logs_pkey" PRIMARY KEY using index "daily_logs_pkey";

alter table "public"."daily_tasks" add constraint "daily_tasks_pkey" PRIMARY KEY using index "daily_tasks_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."rewards" add constraint "rewards_pkey" PRIMARY KEY using index "rewards_pkey";

alter table "public"."sitter_access" add constraint "sitter_access_pkey" PRIMARY KEY using index "sitter_access_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."care_logs" add constraint "care_log_has_actor" CHECK (((logged_by_user_id IS NOT NULL) OR (sitter_access_id IS NOT NULL))) not valid;

alter table "public"."care_logs" validate constraint "care_log_has_actor";

alter table "public"."care_logs" add constraint "care_logs_action_type_check" CHECK ((action_type = ANY (ARRAY['feeding'::text, 'workout'::text, 'medication'::text]))) not valid;

alter table "public"."care_logs" validate constraint "care_logs_action_type_check";

alter table "public"."care_logs" add constraint "care_logs_logged_by_user_id_fkey" FOREIGN KEY (logged_by_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."care_logs" validate constraint "care_logs_logged_by_user_id_fkey";

alter table "public"."care_logs" add constraint "care_logs_sitter_access_id_fkey" FOREIGN KEY (sitter_access_id) REFERENCES public.sitter_access(id) not valid;

alter table "public"."care_logs" validate constraint "care_logs_sitter_access_id_fkey";

alter table "public"."daily_logs" add constraint "daily_logs_activity_type_check" CHECK ((activity_type = ANY (ARRAY['feeding'::text, 'walk'::text, 'medication'::text, 'play'::text]))) not valid;

alter table "public"."daily_logs" validate constraint "daily_logs_activity_type_check";

alter table "public"."daily_logs" add constraint "daily_logs_logger_id_fkey" FOREIGN KEY (logger_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."daily_logs" validate constraint "daily_logs_logger_id_fkey";

alter table "public"."daily_logs" add constraint "daily_logs_pet_id_fkey" FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE not valid;

alter table "public"."daily_logs" validate constraint "daily_logs_pet_id_fkey";

alter table "public"."daily_tasks" add constraint "daily_tasks_category_check" CHECK ((category = ANY (ARRAY['food'::text, 'exercise'::text, 'medicine'::text]))) not valid;

alter table "public"."daily_tasks" validate constraint "daily_tasks_category_check";

alter table "public"."daily_tasks" add constraint "daily_tasks_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."daily_tasks" validate constraint "daily_tasks_owner_id_fkey";

alter table "public"."daily_tasks" add constraint "daily_tasks_pet_id_fkey" FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE not valid;

alter table "public"."daily_tasks" validate constraint "daily_tasks_pet_id_fkey";

alter table "public"."product_recommendations" add constraint "product_recommendations_confidence_score_check" CHECK (((confidence_score >= (0)::numeric) AND (confidence_score <= (100)::numeric))) not valid;

alter table "public"."product_recommendations" validate constraint "product_recommendations_confidence_score_check";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'sitter'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

alter table "public"."rewards" add constraint "rewards_feeding_streak_days_check" CHECK ((feeding_streak_days >= 0)) not valid;

alter table "public"."rewards" validate constraint "rewards_feeding_streak_days_check";

alter table "public"."rewards" add constraint "rewards_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."rewards" validate constraint "rewards_owner_id_fkey";

alter table "public"."rewards" add constraint "rewards_owner_id_key" UNIQUE using index "rewards_owner_id_key";

alter table "public"."rewards" add constraint "rewards_points_check" CHECK ((points >= 0)) not valid;

alter table "public"."rewards" validate constraint "rewards_points_check";

alter table "public"."sitter_access" add constraint "sitter_access_invite_token_key" UNIQUE using index "sitter_access_invite_token_key";

alter table "public"."sitter_access" add constraint "sitter_access_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."sitter_access" validate constraint "sitter_access_owner_id_fkey";

alter table "public"."sitter_invites" add constraint "sitter_invites_accepted_by_fkey" FOREIGN KEY (accepted_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."sitter_invites" validate constraint "sitter_invites_accepted_by_fkey";

alter table "public"."sitter_invites" add constraint "sitter_invites_role_check" CHECK ((role = ANY (ARRAY['full_access'::text, 'view_only'::text]))) not valid;

alter table "public"."sitter_invites" validate constraint "sitter_invites_role_check";

alter table "public"."sitter_invites" add constraint "sitter_invites_token_key" UNIQUE using index "sitter_invites_token_key";

alter table "public"."sitter_sessions" add constraint "sitter_sessions_invite_id_fkey" FOREIGN KEY (invite_id) REFERENCES public.sitter_invites(id) ON DELETE SET NULL not valid;

alter table "public"."sitter_sessions" validate constraint "sitter_sessions_invite_id_fkey";

alter table "public"."streaks" add constraint "streaks_category_check" CHECK ((category = ANY (ARRAY['food'::text, 'exercise'::text, 'medicine'::text]))) not valid;

alter table "public"."streaks" validate constraint "streaks_category_check";

alter table "public"."streaks" add constraint "streaks_pet_id_category_key" UNIQUE using index "streaks_pet_id_category_key";

alter table "public"."user_settings" add constraint "user_settings_theme_check" CHECK ((theme = ANY (ARRAY['light'::text, 'dark'::text]))) not valid;

alter table "public"."user_settings" validate constraint "user_settings_theme_check";

alter table "public"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_key" UNIQUE using index "user_settings_user_id_key";

alter table "public"."inventory" add constraint "inventory_item_type_check" CHECK ((item_type = ANY (ARRAY['toy'::text, 'medicine'::text, 'food'::text]))) not valid;

alter table "public"."inventory" validate constraint "inventory_item_type_check";

alter table "public"."pets" add constraint "pets_gender_check" CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text, 'unknown'::text]))) not valid;

alter table "public"."pets" validate constraint "pets_gender_check";

alter table "public"."pets" add constraint "pets_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."pets" validate constraint "pets_owner_id_fkey";

alter table "public"."sitter_invites" add constraint "sitter_invites_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."sitter_invites" validate constraint "sitter_invites_owner_id_fkey";

alter table "public"."sitter_sessions" add constraint "sitter_sessions_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."sitter_sessions" validate constraint "sitter_sessions_owner_id_fkey";

alter table "public"."sitter_sessions" add constraint "sitter_sessions_sitter_id_fkey" FOREIGN KEY (sitter_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."sitter_sessions" validate constraint "sitter_sessions_sitter_id_fkey";

grant delete on table "public"."care_logs" to "anon";

grant insert on table "public"."care_logs" to "anon";

grant references on table "public"."care_logs" to "anon";

grant select on table "public"."care_logs" to "anon";

grant trigger on table "public"."care_logs" to "anon";

grant truncate on table "public"."care_logs" to "anon";

grant update on table "public"."care_logs" to "anon";

grant delete on table "public"."care_logs" to "authenticated";

grant insert on table "public"."care_logs" to "authenticated";

grant references on table "public"."care_logs" to "authenticated";

grant select on table "public"."care_logs" to "authenticated";

grant trigger on table "public"."care_logs" to "authenticated";

grant truncate on table "public"."care_logs" to "authenticated";

grant update on table "public"."care_logs" to "authenticated";

grant delete on table "public"."care_logs" to "service_role";

grant insert on table "public"."care_logs" to "service_role";

grant references on table "public"."care_logs" to "service_role";

grant select on table "public"."care_logs" to "service_role";

grant trigger on table "public"."care_logs" to "service_role";

grant truncate on table "public"."care_logs" to "service_role";

grant update on table "public"."care_logs" to "service_role";

grant delete on table "public"."daily_logs" to "anon";

grant insert on table "public"."daily_logs" to "anon";

grant references on table "public"."daily_logs" to "anon";

grant select on table "public"."daily_logs" to "anon";

grant trigger on table "public"."daily_logs" to "anon";

grant truncate on table "public"."daily_logs" to "anon";

grant update on table "public"."daily_logs" to "anon";

grant delete on table "public"."daily_logs" to "authenticated";

grant insert on table "public"."daily_logs" to "authenticated";

grant references on table "public"."daily_logs" to "authenticated";

grant select on table "public"."daily_logs" to "authenticated";

grant trigger on table "public"."daily_logs" to "authenticated";

grant truncate on table "public"."daily_logs" to "authenticated";

grant update on table "public"."daily_logs" to "authenticated";

grant delete on table "public"."daily_logs" to "service_role";

grant insert on table "public"."daily_logs" to "service_role";

grant references on table "public"."daily_logs" to "service_role";

grant select on table "public"."daily_logs" to "service_role";

grant trigger on table "public"."daily_logs" to "service_role";

grant truncate on table "public"."daily_logs" to "service_role";

grant update on table "public"."daily_logs" to "service_role";

grant delete on table "public"."daily_tasks" to "anon";

grant insert on table "public"."daily_tasks" to "anon";

grant references on table "public"."daily_tasks" to "anon";

grant select on table "public"."daily_tasks" to "anon";

grant trigger on table "public"."daily_tasks" to "anon";

grant truncate on table "public"."daily_tasks" to "anon";

grant update on table "public"."daily_tasks" to "anon";

grant delete on table "public"."daily_tasks" to "authenticated";

grant insert on table "public"."daily_tasks" to "authenticated";

grant references on table "public"."daily_tasks" to "authenticated";

grant select on table "public"."daily_tasks" to "authenticated";

grant trigger on table "public"."daily_tasks" to "authenticated";

grant truncate on table "public"."daily_tasks" to "authenticated";

grant update on table "public"."daily_tasks" to "authenticated";

grant delete on table "public"."daily_tasks" to "service_role";

grant insert on table "public"."daily_tasks" to "service_role";

grant references on table "public"."daily_tasks" to "service_role";

grant select on table "public"."daily_tasks" to "service_role";

grant trigger on table "public"."daily_tasks" to "service_role";

grant truncate on table "public"."daily_tasks" to "service_role";

grant update on table "public"."daily_tasks" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."rewards" to "anon";

grant insert on table "public"."rewards" to "anon";

grant references on table "public"."rewards" to "anon";

grant select on table "public"."rewards" to "anon";

grant trigger on table "public"."rewards" to "anon";

grant truncate on table "public"."rewards" to "anon";

grant update on table "public"."rewards" to "anon";

grant delete on table "public"."rewards" to "authenticated";

grant insert on table "public"."rewards" to "authenticated";

grant references on table "public"."rewards" to "authenticated";

grant select on table "public"."rewards" to "authenticated";

grant trigger on table "public"."rewards" to "authenticated";

grant truncate on table "public"."rewards" to "authenticated";

grant update on table "public"."rewards" to "authenticated";

grant delete on table "public"."rewards" to "service_role";

grant insert on table "public"."rewards" to "service_role";

grant references on table "public"."rewards" to "service_role";

grant select on table "public"."rewards" to "service_role";

grant trigger on table "public"."rewards" to "service_role";

grant truncate on table "public"."rewards" to "service_role";

grant update on table "public"."rewards" to "service_role";

grant delete on table "public"."sitter_access" to "anon";

grant insert on table "public"."sitter_access" to "anon";

grant references on table "public"."sitter_access" to "anon";

grant select on table "public"."sitter_access" to "anon";

grant trigger on table "public"."sitter_access" to "anon";

grant truncate on table "public"."sitter_access" to "anon";

grant update on table "public"."sitter_access" to "anon";

grant delete on table "public"."sitter_access" to "authenticated";

grant insert on table "public"."sitter_access" to "authenticated";

grant references on table "public"."sitter_access" to "authenticated";

grant select on table "public"."sitter_access" to "authenticated";

grant trigger on table "public"."sitter_access" to "authenticated";

grant truncate on table "public"."sitter_access" to "authenticated";

grant update on table "public"."sitter_access" to "authenticated";

grant delete on table "public"."sitter_access" to "service_role";

grant insert on table "public"."sitter_access" to "service_role";

grant references on table "public"."sitter_access" to "service_role";

grant select on table "public"."sitter_access" to "service_role";

grant trigger on table "public"."sitter_access" to "service_role";

grant truncate on table "public"."sitter_access" to "service_role";

grant update on table "public"."sitter_access" to "service_role";

grant delete on table "public"."user_settings" to "anon";

grant insert on table "public"."user_settings" to "anon";

grant references on table "public"."user_settings" to "anon";

grant select on table "public"."user_settings" to "anon";

grant trigger on table "public"."user_settings" to "anon";

grant truncate on table "public"."user_settings" to "anon";

grant update on table "public"."user_settings" to "anon";

grant delete on table "public"."user_settings" to "authenticated";

grant insert on table "public"."user_settings" to "authenticated";

grant references on table "public"."user_settings" to "authenticated";

grant select on table "public"."user_settings" to "authenticated";

grant trigger on table "public"."user_settings" to "authenticated";

grant truncate on table "public"."user_settings" to "authenticated";

grant update on table "public"."user_settings" to "authenticated";

grant delete on table "public"."user_settings" to "service_role";

grant insert on table "public"."user_settings" to "service_role";

grant references on table "public"."user_settings" to "service_role";

grant select on table "public"."user_settings" to "service_role";

grant trigger on table "public"."user_settings" to "service_role";

grant truncate on table "public"."user_settings" to "service_role";

grant update on table "public"."user_settings" to "service_role";


  create policy "Sitters insert care logs via valid invite"
  on "public"."care_logs"
  as permissive
  for insert
  to public
with check (((sitter_access_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM public.sitter_access
  WHERE ((sitter_access.id = care_logs.sitter_access_id) AND (sitter_access.pet_id = care_logs.pet_id) AND (sitter_access.is_active = true) AND (sitter_access.invite_expires_at > now()))))));



  create policy "Sitters read care logs via active invite"
  on "public"."care_logs"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.sitter_access
  WHERE ((sitter_access.pet_id = care_logs.pet_id) AND (sitter_access.is_active = true) AND (sitter_access.invite_expires_at > now())))));



  create policy "daily_logs_owner"
  on "public"."daily_logs"
  as permissive
  for all
  to public
using ((auth.uid() IN ( SELECT pets.owner_id
   FROM public.pets
  WHERE (pets.id = daily_logs.pet_id))));



  create policy "daily_logs_sitter"
  on "public"."daily_logs"
  as permissive
  for select
  to public
using ((auth.uid() IN ( SELECT sitter_sessions.sitter_id
   FROM public.sitter_sessions
  WHERE ((sitter_sessions.pet_id = daily_logs.pet_id) AND (sitter_sessions.started_at <= now()) AND ((sitter_sessions.ended_at IS NULL) OR (sitter_sessions.ended_at >= now()))))));



  create policy "daily_tasks_owner"
  on "public"."daily_tasks"
  as permissive
  for all
  to public
using ((auth.uid() = owner_id));



  create policy "inventory_owner"
  on "public"."inventory"
  as permissive
  for all
  to public
using ((auth.uid() IN ( SELECT pets.owner_id
   FROM public.pets
  WHERE (pets.id = inventory.pet_id))));



  create policy "pets_owner_all"
  on "public"."pets"
  as permissive
  for all
  to public
using ((auth.uid() = owner_id));



  create policy "product_recommendations_owner"
  on "public"."product_recommendations"
  as permissive
  for select
  to public
using ((auth.uid() IN ( SELECT pets.owner_id
   FROM public.pets
  WHERE (pets.id = product_recommendations.pet_id))));



  create policy "profiles_self_read"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Owners manage own rewards"
  on "public"."rewards"
  as permissive
  for all
  to public
using ((auth.uid() = owner_id))
with check ((auth.uid() = owner_id));



  create policy "Owners manage own sitter access"
  on "public"."sitter_access"
  as permissive
  for all
  to public
using ((auth.uid() = owner_id))
with check ((auth.uid() = owner_id));



  create policy "Public reads valid sitter invites"
  on "public"."sitter_access"
  as permissive
  for select
  to public
using (((is_active = true) AND (invite_expires_at > now())));



  create policy "sitter_invites_owner"
  on "public"."sitter_invites"
  as permissive
  for all
  to public
using ((auth.uid() = owner_id));



  create policy "sitter_sessions_owner"
  on "public"."sitter_sessions"
  as permissive
  for all
  to public
using ((auth.uid() = owner_id));



  create policy "sitter_sessions_sitter"
  on "public"."sitter_sessions"
  as permissive
  for select
  to public
using ((auth.uid() = sitter_id));



  create policy "streaks_owner"
  on "public"."streaks"
  as permissive
  for select
  to public
using ((auth.uid() IN ( SELECT pets.owner_id
   FROM public.pets
  WHERE (pets.id = streaks.pet_id))));



