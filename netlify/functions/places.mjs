import { getDatabase } from "@netlify/database";

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

    // Keep the public API restricted to records explicitly reviewed for publication.
    const rows = await db.sql`
      SELECT
        p.id, p.name, p.category, p.subcategory, p.description,
        p.address, p.city, p.state, p.postal_code,
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

    return Response.json({
      data: filtered,
      meta: { count: filtered.length, limit: 250 },
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
