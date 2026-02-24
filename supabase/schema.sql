-- ============================================================
-- THE MOST POPULAR™ — COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE public.authority_level AS ENUM ('visitor','registered','verified','certified','legendary');
CREATE TYPE public.verification_status AS ENUM ('unverified','pending','verified','failed','expired');

-- Countries
CREATE TABLE public.countries (
  id BIGSERIAL PRIMARY KEY,
  iso2 CHAR(2) UNIQUE NOT NULL,
  iso3 CHAR(3) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  un_status TEXT DEFAULT 'member',
  continent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.countries (iso2, iso3, name, continent) VALUES 
('US', 'USA', 'United States', 'North America'),
('CA', 'CAN', 'Canada', 'North America'),
('GB', 'GBR', 'United Kingdom', 'Europe'),
('FR', 'FRA', 'France', 'Europe'),
('DE', 'DEU', 'Germany', 'Europe'),
('JP', 'JPN', 'Japan', 'Asia'),
('AU', 'AUS', 'Australia', 'Oceania');

-- US States
CREATE TABLE public.us_states (
  id BIGSERIAL PRIMARY KEY,
  country_id BIGINT REFERENCES public.countries(id),
  state_code CHAR(2) UNIQUE NOT NULL,
  state_name TEXT NOT NULL,
  state_type TEXT DEFAULT 'state',
  region TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
DECLARE us_id BIGINT;
BEGIN
  SELECT id INTO us_id FROM public.countries WHERE iso2 = 'US';
  
  INSERT INTO public.us_states (country_id, state_code, state_name, region) VALUES
    (us_id, 'NY', 'New York', 'Northeast'),
    (us_id, 'CA', 'California', 'West'),
    (us_id, 'MI', 'Michigan', 'Midwest'),
    (us_id, 'GA', 'Georgia', 'South'),
    (us_id, 'IL', 'Illinois', 'Midwest'),
    (us_id, 'TX', 'Texas', 'South'),
    (us_id, 'PA', 'Pennsylvania', 'Northeast'),
    (us_id, 'AZ', 'Arizona', 'West'),
    (us_id, 'FL', 'Florida', 'South'),
    (us_id, 'DC', 'District of Columbia', 'South');
END $$;

-- Roles
CREATE TABLE public.roles (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  weight NUMERIC DEFAULT 1.0
);

INSERT INTO public.roles (key, label, weight) VALUES
  ('supporter', 'Supporter', 1.0),
  ('artist', 'Artist', 1.2),
  ('dj', 'DJ', 1.1),
  ('producer', 'Producer', 1.1),
  ('pr', 'PR', 1.0),
  ('manager', 'Manager', 1.0),
  ('videographer', 'Videographer', 0.9),
  ('photographer', 'Photographer', 0.9),
  ('promoter', 'Promoter', 1.0),
  ('venue', 'Venue', 1.0),
  ('stylist', 'Stylist', 0.9),
  ('influencer', 'Influencer', 0.95),
  ('cultural_organizer', 'Cultural Organizer', 1.25);

-- Cities
CREATE TABLE public.cities (
  id BIGSERIAL PRIMARY KEY,
  state_id BIGINT REFERENCES public.us_states(id),
  country_id BIGINT REFERENCES public.countries(id),
  city_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city_type TEXT DEFAULT 'city',
  population_estimate BIGINT,
  supporter_count BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state_id, city_name)
);

-- City Districts
CREATE TABLE public.city_districts (
  id BIGSERIAL PRIMARY KEY,
  city_id BIGINT REFERENCES public.cities(id),
  district_name TEXT NOT NULL,
  slug TEXT,
  district_type TEXT CHECK (district_type IN ('borough', 'neighborhood', 'district', 'ward', 'parish')),
  population_estimate BIGINT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_id, district_name)
);

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  authority authority_level DEFAULT 'registered',
  primary_role_id BIGINT REFERENCES public.roles(id),
  is_public BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE,
  civic_city_id BIGINT REFERENCES public.cities(id),
  civic_district_id BIGINT REFERENCES public.city_districts(id),
  supporter_count BIGINT DEFAULT 0,
  email_status verification_status DEFAULT 'unverified',
  phone_status verification_status DEFAULT 'unverified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_username TEXT;
BEGIN
  default_username := 'user_' || substr(md5(random()::text), 1, 8);
  INSERT INTO public.profiles (id, username, created_at, updated_at)
  VALUES (NEW.id, default_username, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Alignments (endorsements)
CREATE TABLE public.alignments (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  supporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  supporter_civic_city_id BIGINT REFERENCES public.cities(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(supporter_id, target_id),
  CHECK (supporter_id <> target_id)
);

-- Insert NYC boroughs
DO $$
DECLARE nyc_id BIGINT;
BEGIN
  SELECT id INTO nyc_id FROM public.cities WHERE slug = 'new-york-city';
  IF nyc_id IS NOT NULL THEN
    INSERT INTO public.city_districts (city_id, district_name, slug, district_type, population_estimate) VALUES
      (nyc_id, 'Brooklyn', 'brooklyn', 'borough', 2600000),
      (nyc_id, 'Queens', 'queens', 'borough', 2250000),
      (nyc_id, 'Manhattan', 'manhattan', 'borough', 1600000),
      (nyc_id, 'Bronx', 'bronx', 'borough', 1400000),
      (nyc_id, 'Staten Island', 'staten-island', 'borough', 475000)
    ON CONFLICT (city_id, district_name) DO NOTHING;
  END IF;
END $$;

-- Indexes
CREATE INDEX idx_profiles_city ON public.profiles(civic_city_id);
CREATE INDEX idx_profiles_district ON public.profiles(civic_district_id);
CREATE INDEX idx_alignments_target ON public.alignments(target_id);
CREATE INDEX idx_cities_population ON public.cities(population_estimate DESC);
CREATE INDEX idx_cities_supporters ON public.cities(supporter_count DESC);
