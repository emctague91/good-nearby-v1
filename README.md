# Good Nearby — V1 prototype

Mobile-first static prototype for **Good Nearby — The local guide for dog people**.

## V1 flows
- Find something near me
- Find something to do
- Build My Dog Day
- Search + category filters
- Save places
- Event discovery
- Verification/restriction badges
- Responsive mobile navigation

## Production foundation
The production schema is defined in `netlify/database/migrations/0001_good_nearby_core/migration.sql`.

Core modeling decisions:
- Dog access is stored separately from current operating status.
- A place can contain multiple `place_zones` with different access rules. A park can have an official off-leash DFA beside a Natural Area where pets are prohibited.
- Routes can be split into independently verified segments.
- Resource location is separate from its service area.
- Events have real start/end timestamps and publication/expiry controls.
- Every important public record carries source and last-verified fields.
- Saved items and Dog Days use anonymous visitor IDs for this first version; do not store sensitive personal information in these fields.

## Local development and database
1. Install dependencies with `npm install`.
2. Install the Netlify CLI (Node 20.12.2+ and Netlify CLI 26+).
3. Run `netlify database init` to install `@netlify/database` and configure the local database workflow.
4. Run `netlify dev` for local app + database development.
5. Review pending migrations with `netlify database status` before deploying.

Netlify applies committed migrations during deploy. Do not manually edit an already-applied migration; create a new corrective migration instead.

## Safety and verification rules
- Never infer off-leash access from a general dog-friendly listing.
- Never infer dog access from outdoor seating alone.
- A place's normal hours do not prove it is currently open.
- Natural Area, beach, construction, and temporary restrictions must be modeled explicitly.
- Unverified records should remain unpublished or visibly marked as needing verification.

## Current prototype limitations
The current front-end seed data is illustrative, not a verified production dataset. Event dates, access claims, and placeholder interactions must be replaced or connected to verified records before public launch.

## Deploy
Do not deploy the production database migration until the dependency is installed, the migration has been reviewed, and a preview build has passed.
