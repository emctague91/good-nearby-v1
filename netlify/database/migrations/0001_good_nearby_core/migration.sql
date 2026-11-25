-- Good Nearby core schema
-- First production foundation. Dog access is modeled per place AND per zone so
-- a park can contain an off-leash DFA beside a restricted Natural Area.

CREATE TABLE IF NOT EXISTS neighborhoods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  side TEXT,
  community_area TEXT,
  center_lat DOUBLE PRECISION,
  center_lon DOUBLE PRECISION,
  launch_status TEXT NOT NULL DEFAULT 'PLANNED'
    CHECK (launch_status IN ('READY','NEEDS_FILL','PLANNED','LIMITED_INFRASTRUCTURE')),
  dog_profile TEXT,
  boundary_geojson JSONB,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL
    CHECK (category IN ('PARK','DOG_AREA','WALK','TRAIL','RESTAURANT','CAFE','SHOP','VET','URGENT_CARE','EMERGENCY_CARE','GROOMING','TRAINING','BOARDING','DAYCARE','RESOURCE','EVENT_VENUE','OTHER')),
  subcategory TEXT,
  description TEXT,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Chicago',
  state TEXT NOT NULL DEFAULT 'IL',
  postal_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  neighborhood_id TEXT REFERENCES neighborhoods(id) ON DELETE SET NULL,
  managing_authority TEXT,
  dog_access TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (dog_access IN ('OFF_LEASH','LEASHED','DOGS_ALLOWED','RESTRICTED','NO_DOGS','SERVICE_ANIMALS_ONLY','UNKNOWN')),
  off_leash BOOLEAN NOT NULL DEFAULT FALSE,
  leash_required BOOLEAN,
  access_confidence TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (access_confidence IN ('VERIFIED','COMMUNITY_VERIFIED','UNKNOWN','RESTRICTED','NEEDS_REVIEW')),
  experience_tags TEXT[] NOT NULL DEFAULT '{}',
  current_status TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (current_status IN ('OPEN','CLOSED','TEMPORARILY_CLOSED','PARTIAL','SEASONAL','WEATHER_DEPENDENT','CONSTRUCTION','UNKNOWN')),
  status_reason TEXT,
  normal_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  seasonal BOOLEAN NOT NULL DEFAULT FALSE,
  fenced BOOLEAN,
  small_dog_area BOOLEAN,
  large_dog_area BOOLEAN,
  shade BOOLEAN,
  water_available BOOLEAN,
  dog_fountain BOOLEAN,
  waste_bags BOOLEAN,
  surface TEXT,
  size_acres NUMERIC(9,2),
  price_level TEXT,
  phone TEXT,
  website_url TEXT,
  source_name TEXT,
  source_url TEXT,
  source_notes TEXT,
  last_verified_at TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  CHECK (NOT off_leash OR dog_access = 'OFF_LEASH')
);

CREATE INDEX IF NOT EXISTS places_neighborhood_idx ON places(neighborhood_id);
CREATE INDEX IF NOT EXISTS places_category_idx ON places(category);
CREATE INDEX IF NOT EXISTS places_access_idx ON places(dog_access, access_confidence);
CREATE INDEX IF NOT EXISTS places_published_idx ON places(published) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS places_geo_idx ON places(latitude, longitude);

CREATE TABLE IF NOT EXISTS place_zones (
  id TEXT PRIMARY KEY,
  place_id TEXT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL DEFAULT 'GENERAL',
  dog_access TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (dog_access IN ('OFF_LEASH','LEASHED','DOGS_ALLOWED','RESTRICTED','NO_DOGS','SERVICE_ANIMALS_ONLY','UNKNOWN')),
  leash_required BOOLEAN,
  restriction TEXT,
  current_status TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (current_status IN ('OPEN','CLOSED','TEMPORARILY_CLOSED','PARTIAL','SEASONAL','WEATHER_DEPENDENT','CONSTRUCTION','UNKNOWN')),
  status_reason TEXT,
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS place_zones_place_idx ON place_zones(place_id);
CREATE INDEX IF NOT EXISTS place_zones_access_idx ON place_zones(dog_access);

CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  neighborhood_id TEXT REFERENCES neighborhoods(id) ON DELETE SET NULL,
  start_place_id TEXT REFERENCES places(id) ON DELETE SET NULL,
  end_place_id TEXT REFERENCES places(id) ON DELETE SET NULL,
  distance_miles NUMERIC(7,2),
  estimated_minutes INTEGER,
  surface TEXT,
  difficulty TEXT,
  dog_access TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (dog_access IN ('LEASHED','DOGS_ALLOWED','RESTRICTED','NO_DOGS','UNKNOWN')),
  leash_required BOOLEAN,
  shade BOOLEAN,
  water_available BOOLEAN,
  traffic_level TEXT,
  scenic BOOLEAN NOT NULL DEFAULT FALSE,
  current_status TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (current_status IN ('OPEN','CLOSED','PARTIAL','CONSTRUCTION','SEASONAL','UNKNOWN')),
  warnings TEXT[] NOT NULL DEFAULT '{}',
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS routes_neighborhood_idx ON routes(neighborhood_id);
CREATE INDEX IF NOT EXISTS routes_published_idx ON routes(published) WHERE published = TRUE;

CREATE TABLE IF NOT EXISTS route_segments (
  id TEXT PRIMARY KEY,
  route_id TEXT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  name TEXT,
  start_description TEXT,
  end_description TEXT,
  distance_miles NUMERIC(7,2),
  dog_access TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (dog_access IN ('LEASHED','DOGS_ALLOWED','RESTRICTED','NO_DOGS','UNKNOWN')),
  leash_required BOOLEAN,
  current_status TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (current_status IN ('OPEN','CLOSED','PARTIAL','CONSTRUCTION','SEASONAL','UNKNOWN')),
  warning TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  UNIQUE(route_id, sequence_number)
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  resource_type TEXT NOT NULL
    CHECK (resource_type IN ('PET_FOOD','AFFORDABLE_CARE','VACCINES','SPAY_NEUTER','MICROCHIP','TRAINING','SHELTER','KEEP_MY_PET','LOST_FOUND','OTHER')),
  description TEXT,
  place_id TEXT REFERENCES places(id) ON DELETE SET NULL,
  located_in_neighborhood_id TEXT REFERENCES neighborhoods(id) ON DELETE SET NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  eligibility TEXT,
  geographic_requirement TEXT,
  income_requirement TEXT,
  schedule JSONB NOT NULL DEFAULT '{}'::jsonb,
  appointment_required BOOLEAN,
  walk_in_available BOOLEAN,
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  languages TEXT[] NOT NULL DEFAULT '{}',
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  current_status TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (current_status IN ('OPEN','CLOSED','TEMPORARILY_CLOSED','SEASONAL','UNKNOWN')),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS resources_type_idx ON resources(resource_type);
CREATE INDEX IF NOT EXISTS resources_neighborhood_idx ON resources(located_in_neighborhood_id);

CREATE TABLE IF NOT EXISTS resource_service_areas (
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  neighborhood_id TEXT NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  PRIMARY KEY(resource_id, neighborhood_id)
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'OTHER',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  recurring_rule TEXT,
  place_id TEXT REFERENCES places(id) ON DELETE SET NULL,
  neighborhood_id TEXT REFERENCES neighborhoods(id) ON DELETE SET NULL,
  dog_access TEXT NOT NULL DEFAULT 'UNKNOWN'
    CHECK (dog_access IN ('LEASHED','DOGS_ALLOWED','RESTRICTED','NO_DOGS','UNKNOWN')),
  leash_required BOOLEAN,
  indoor_outdoor TEXT,
  dog_activities TEXT[] NOT NULL DEFAULT '{}',
  current_status TEXT NOT NULL DEFAULT 'UPCOMING'
    CHECK (current_status IN ('UPCOMING','TODAY','LIVE','COMPLETED','CANCELLED','POSTPONED','UNKNOWN')),
  weather_dependent BOOLEAN NOT NULL DEFAULT FALSE,
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);
CREATE INDEX IF NOT EXISTS events_start_idx ON events(starts_at);
CREATE INDEX IF NOT EXISTS events_upcoming_idx ON events(starts_at) WHERE published = TRUE AND current_status IN ('UPCOMING','TODAY','LIVE');

CREATE TABLE IF NOT EXISTS place_relationships (
  id BIGSERIAL PRIMARY KEY,
  from_place_id TEXT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  to_place_id TEXT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL
    CHECK (relationship_type IN ('IN','NEARBY','WALKABLE','CONNECTED_ROUTE','GOOD_AFTER','GOOD_BEFORE','ALTERNATIVE')),
  distance_miles NUMERIC(7,2),
  walk_minutes INTEGER,
  notes TEXT,
  UNIQUE(from_place_id, to_place_id, relationship_type),
  CHECK (from_place_id <> to_place_id)
);
CREATE INDEX IF NOT EXISTS place_relationships_from_idx ON place_relationships(from_place_id);
CREATE INDEX IF NOT EXISTS place_relationships_to_idx ON place_relationships(to_place_id);

CREATE TABLE IF NOT EXISTS restrictions (
  id TEXT PRIMARY KEY,
  place_id TEXT REFERENCES places(id) ON DELETE CASCADE,
  zone_id TEXT REFERENCES place_zones(id) ON DELETE CASCADE,
  restriction_type TEXT NOT NULL
    CHECK (restriction_type IN ('NO_PETS','LEASH_REQUIRED','OFF_LEASH_ONLY_IN_DFA','BEACH_RESTRICTION','NATURAL_AREA','TEMPORARY_CLOSURE','CONSTRUCTION','WEATHER_DEPENDENT','SEASONAL','OTHER')),
  description TEXT NOT NULL,
  applies_to TEXT,
  effective_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  current_status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (current_status IN ('ACTIVE','SCHEDULED','EXPIRED','UNKNOWN')),
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  CHECK (place_id IS NOT NULL OR zone_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS restrictions_place_idx ON restrictions(place_id);
CREATE INDEX IF NOT EXISTS restrictions_zone_idx ON restrictions(zone_id);
CREATE INDEX IF NOT EXISTS restrictions_active_idx ON restrictions(current_status, expires_at);

CREATE TABLE IF NOT EXISTS saved_items (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('PLACE','ROUTE','EVENT','DOG_DAY')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(visitor_id, item_type, item_id)
);
CREATE INDEX IF NOT EXISTS saved_items_visitor_idx ON saved_items(visitor_id);

CREATE TABLE IF NOT EXISTS dog_days (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  name TEXT NOT NULL,
  vibe TEXT,
  distance_miles NUMERIC(7,2),
  stops JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS dog_days_visitor_idx ON dog_days(visitor_id);

CREATE TABLE IF NOT EXISTS user_reports (
  id BIGSERIAL PRIMARY KEY,
  place_id TEXT REFERENCES places(id) ON DELETE SET NULL,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL
    CHECK (report_type IN ('DOGS_NO_LONGER_ALLOWED','TEMPORARILY_CLOSED','HOURS_CHANGED','DOG_ACCESS_CHANGED','EVENT_CANCELLED','INFORMATION_INCORRECT','OTHER')),
  details TEXT,
  contact_email TEXT,
  review_status TEXT NOT NULL DEFAULT 'NEEDS_REVIEW'
    CHECK (review_status IN ('NEEDS_REVIEW','IN_REVIEW','RESOLVED','DISMISSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (place_id IS NOT NULL OR event_id IS NOT NULL)
);

CREATE OR REPLACE FUNCTION good_nearby_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['neighborhoods','places','place_zones','routes','resources','events','dog_days']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', table_name);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION good_nearby_set_updated_at()', table_name);
  END LOOP;
END $$;
