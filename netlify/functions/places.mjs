import { getDatabase } from "@netlify/database";
import { NEARBY_MAX_MILES, REGIONAL_MAX_MILES, ZIP_PATTERN, rankByZip } from "../lib/zip-search.mjs";

const db = getDatabase();

export default async function handler(request) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json; charset=utf-8", allow: "GET" },
    });
  }

  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const neighborhood = url.searchParams.get("neighborhood");
    const query = url.searchParams.get("q")?.trim().toLowerCase();
    const zip = url.searchParams.get("zip")?.trim();

    // Single published place for the detail page, including its source and verification fields.
    const id = url.searchParams.get("id")?.trim();
    if (id !== undefined) {
      if (!id || id.length > 120) return Response.json({ error: "id is required." }, { status: 400 });
      const [place] = await db.sql`
        SELECT
          p.id, p.name, p.category, p.subcategory, p.description,
          p.address, p.city, p.state, p.postal_code, p.managing_authority,
          p.latitude, p.longitude, p.dog_access, p.off_leash,
          p.leash_required, p.access_confidence, p.experience_tags,
          p.current_status, p.status_reason, p.normal_hours, p.seasonal,
          p.source_name, p.source_url, p.source_notes, p.last_verified_at,
          n.name AS neighborhood
        FROM places p
        LEFT JOIN neighborhoods n ON n.id = p.neighborhood_id
        WHERE p.id = ${id} AND p.published = TRUE
      `;
      if (!place) return Response.json({ error: "Place not found." }, { status: 404 });
      return Response.json(
        { data: { ...place, verified: place.access_confidence === "VERIFIED" } },
        { headers: { "cache-control": "public, max-age=30, stale-while-revalidate=60" } },
      );
    }

    if (zip !== undefined && !ZIP_PATTERN.test(zip)) {
      return Response.json({ error: "zip must be a 5-digit ZIP code." }, { status: 400 });
    }

    let center = null;
    if (zip) {
      const [zipRow] = await db.sql`SELECT zip, latitude, longitude FROM zip_centroids WHERE zip = ${zip}`;
      if (!zipRow) {
        return Response.json({
          data: [],
          meta: { count: 0, zip, zip_found: false, message: "That ZIP code isn't in the Good Nearby service area yet." },
        });
      }
      center = { latitude: zipRow.latitude, longitude: zipRow.longitude };
    }

    // Keep the public API restricted to records explicitly reviewed for publication.
    const rows = await db.sql`
      SELECT
        p.id, p.name, p.category, p.subcategory, p.description,
        p.address, p.city, p.state, p.postal_code, p.managing_authority,
        p.latitude, p.longitude, p.dog_access, p.off_leash,
        p.leash_required, p.access_confidence, p.experience_tags,
        p.current_status, p.status_reason, p.normal_hours,
        p.seasonal, p.source_name, p.source_url, p.last_verified_at,
        n.name AS neighborhood
      FROM places p
      LEFT JOIN neighborhoods n ON n.id = p.neighborhood_id
      WHERE p.published = TRUE
      ORDER BY p.name
      LIMIT 250
    `;

    const filtered = rows.filter((place) => {
      if (category && place.category !== category) return false;
      if (neighborhood && place.neighborhood !== neighborhood) return false;
      if (query) {
        const haystack = [
          place.name,
          place.category,
          place.subcategory,
          place.description,
          place.address,
          place.neighborhood,
          ...(place.experience_tags || []),
        ].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    // Only records reviewed as VERIFIED may be presented as verified dog access.
    const withVerification = filtered.map((place) => ({ ...place, verified: place.access_confidence === "VERIFIED" }));
    const data = center ? rankByZip(withVerification, zip, center) : withVerification;

    return Response.json({
      data,
      meta: {
        count: data.length,
        limit: 250,
        ...(center && {
          zip,
          zip_found: true,
          center,
          tiers: { IN: "same ZIP code", NEARBY: `within ${NEARBY_MAX_MILES} mi`, REGIONAL: `${NEARBY_MAX_MILES}–${REGIONAL_MAX_MILES} mi` },
        }),
      },
    }, {
      headers: {
        "cache-control": "public, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Good Nearby places API error:", error);
    return Response.json({ error: "Unable to load places right now." }, { status: 500 });
  }
}

export const config = { path: "/api/places" };
