-- À exécuter une seule fois dans l'éditeur SQL du projet Supabase.
create extension if not exists pgcrypto;

create table if not exists public.draconia_accounts (
    id uuid primary key default gen_random_uuid(),
    username text not null,
    username_normalized text not null unique,
    secret_hash text not null,
    save_data jsonb not null default '{}'::jsonb,
    save_revision bigint not null default 1,
    failed_attempts integer not null default 0,
    locked_until timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint draconia_username_format check (username ~ '^[A-Za-z0-9_-]{3,20}$')
);

create table if not exists public.draconia_sessions (
    token_hash bytea primary key,
    account_id uuid not null references public.draconia_accounts(id) on delete cascade,
    expires_at timestamptz not null default (now() + interval '365 days'),
    created_at timestamptz not null default now()
);

alter table public.draconia_accounts enable row level security;
alter table public.draconia_sessions enable row level security;
-- Aucune policy : les tables ne sont jamais lisibles directement depuis le navigateur.

create or replace function public.create_draconia_account(p_username text, p_secret_key text, p_save jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    clean_name text := trim(p_username);
    account_id uuid;
    token text := encode(gen_random_bytes(32), 'hex');
begin
    if clean_name !~ '^[A-Za-z0-9_-]{3,20}$' then
        raise exception 'Le pseudo doit contenir 3 à 20 lettres, chiffres, tirets ou underscores.';
    end if;
    if length(p_secret_key) < 25 then raise exception 'Clé invalide.'; end if;

    insert into public.draconia_accounts(username, username_normalized, secret_hash, save_data)
    values(clean_name, lower(clean_name), crypt(p_secret_key, gen_salt('bf', 12)), coalesce(p_save, '{}'::jsonb))
    returning id into account_id;

    insert into public.draconia_sessions(token_hash, account_id)
    values(digest(token, 'sha256'), account_id);

    return jsonb_build_object('username', clean_name, 'session_token', token, 'save_revision', 1);
exception
    when unique_violation then raise exception 'Ce pseudo est déjà utilisé.';
end;
$$;

create or replace function public.login_draconia_account(p_username text, p_secret_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    account_row public.draconia_accounts%rowtype;
    token text := encode(gen_random_bytes(32), 'hex');
begin
    select * into account_row from public.draconia_accounts
    where username_normalized = lower(trim(p_username));
    if account_row.id is null then return jsonb_build_object('error', 'INVALID_CREDENTIALS'); end if;
    if account_row.locked_until is not null and account_row.locked_until > now() then
        return jsonb_build_object('error', 'RATE_LIMITED');
    end if;
    if account_row.secret_hash <> crypt(p_secret_key, account_row.secret_hash) then
        update public.draconia_accounts
        set failed_attempts = failed_attempts + 1,
            locked_until = case when failed_attempts + 1 >= 5 then now() + interval '15 minutes' else null end
        where id = account_row.id;
        return jsonb_build_object('error', 'INVALID_CREDENTIALS');
    end if;
    update public.draconia_accounts set failed_attempts = 0, locked_until = null where id = account_row.id;

    insert into public.draconia_sessions(token_hash, account_id)
    values(digest(token, 'sha256'), account_row.id);

    return jsonb_build_object(
        'username', account_row.username,
        'session_token', token,
        'save_data', account_row.save_data,
        'save_revision', account_row.save_revision
    );
end;
$$;

create or replace function public.get_draconia_save(p_session_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare account_row public.draconia_accounts%rowtype;
begin
    select a.* into account_row
    from public.draconia_accounts a
    join public.draconia_sessions s on s.account_id = a.id
    where s.token_hash = digest(p_session_token, 'sha256') and s.expires_at > now();

    if account_row.id is null then raise exception 'Session expirée.'; end if;
    return jsonb_build_object('username', account_row.username, 'save_data', account_row.save_data, 'save_revision', account_row.save_revision);
end;
$$;

create or replace function public.save_draconia_progress(p_session_token text, p_save jsonb, p_expected_revision bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    target_id uuid;
    new_revision bigint;
begin
    select account_id into target_id from public.draconia_sessions
    where token_hash = digest(p_session_token, 'sha256') and expires_at > now();
    if target_id is null then raise exception 'Session expirée.'; end if;

    update public.draconia_accounts
    set save_data = coalesce(p_save, '{}'::jsonb), save_revision = save_revision + 1, updated_at = now()
    where id = target_id and save_revision = p_expected_revision
    returning save_revision into new_revision;

    if new_revision is null then raise exception 'Conflit de sauvegarde.'; end if;
    return jsonb_build_object('save_revision', new_revision);
end;
$$;

create or replace function public.rotate_draconia_key(p_session_token text, p_new_secret_key text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare target_id uuid;
begin
    if length(p_new_secret_key) < 25 then raise exception 'Clé invalide.'; end if;
    select account_id into target_id from public.draconia_sessions
    where token_hash = digest(p_session_token, 'sha256') and expires_at > now();
    if target_id is null then raise exception 'Session expirée.'; end if;
    update public.draconia_accounts set secret_hash = crypt(p_new_secret_key, gen_salt('bf', 12)), updated_at = now() where id = target_id;
    return true;
end;
$$;

revoke all on public.draconia_accounts from anon, authenticated;
revoke all on public.draconia_sessions from anon, authenticated;
revoke all on function public.create_draconia_account(text,text,jsonb) from public;
revoke all on function public.login_draconia_account(text,text) from public;
revoke all on function public.get_draconia_save(text) from public;
revoke all on function public.save_draconia_progress(text,jsonb,bigint) from public;
revoke all on function public.rotate_draconia_key(text,text) from public;
grant execute on function public.create_draconia_account(text,text,jsonb) to anon;
grant execute on function public.login_draconia_account(text,text) to anon;
grant execute on function public.get_draconia_save(text) to anon;
grant execute on function public.save_draconia_progress(text,jsonb,bigint) to anon;
grant execute on function public.rotate_draconia_key(text,text) to anon;
