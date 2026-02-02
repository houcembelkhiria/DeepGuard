#!/bin/bash
set -e

echo "Creating Supabase roles..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create schemas
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE SCHEMA IF NOT EXISTS storage;
    CREATE SCHEMA IF NOT EXISTS realtime;

    -- Create roles
    CREATE ROLE anon nologin noinheritance;
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;

    -- Create users with password
    CREATE USER supabase_auth_admin WITH PASSWORD '$POSTGRES_PASSWORD' CREATEROLE CREATEDB REPLICATION;
    CREATE USER supabase_storage_admin WITH PASSWORD '$POSTGRES_PASSWORD' CREATEROLE CREATEDB REPLICATION;
    CREATE USER supabase_admin WITH PASSWORD '$POSTGRES_PASSWORD' SUPERUSER CREATEROLE CREATEDB REPLICATION;
    CREATE USER authenticator WITH PASSWORD '$POSTGRES_PASSWORD' NOINHERIT;

    -- Grant roles to authenticator
    GRANT anon TO authenticator;
    GRANT authenticated TO authenticator;
    GRANT service_role TO authenticator;

    -- Grant database permissions
    GRANT ALL PRIVILEGES ON DATABASE postgres TO supabase_auth_admin;
    GRANT ALL PRIVILEGES ON DATABASE postgres TO supabase_storage_admin;
    GRANT ALL PRIVILEGES ON DATABASE postgres TO supabase_admin;

    -- Grant schema permissions (Required for Postgres 15+)
    GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
    GRANT ALL PRIVILEGES ON SCHEMA public TO anon;
    GRANT ALL PRIVILEGES ON SCHEMA public TO authenticated;
    GRANT ALL PRIVILEGES ON SCHEMA public TO service_role;
    GRANT ALL PRIVILEGES ON SCHEMA public TO supabase_auth_admin;
    GRANT ALL PRIVILEGES ON SCHEMA public TO supabase_storage_admin;
    GRANT ALL PRIVILEGES ON SCHEMA public TO supabase_admin;
    
    -- Set search path for authenticator
    ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, storage, graphql_public';
EOSQL

echo "Supabase roles created."
