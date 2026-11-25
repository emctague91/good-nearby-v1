-- Initial official DFA seed. Records stay unpublished until coordinates,
-- detailed zone restrictions, and each listing's public-facing copy are reviewed.
INSERT INTO places (
  id, name, category, address, dog_access, off_leash,
  access_confidence, source_name, source_url, last_verified_at, published
)
VALUES
('dfa-anderson','Anderson DFA','DOG_AREA','1611 S Wabash Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-bartelme','Bartelme DFA','DOG_AREA','115 S Sangamon St, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-belmont-harbor','Belmont Harbor DFA','DOG_AREA','Belmont Ave & Lake Shore Dr, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-bryn-mawr','Bryn Mawr DFA (Temporary)','DOG_AREA','Bryn Mawr Ave & Lake Shore Dr, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-calumet','Calumet DFA','DOG_AREA','9801 S Avenue G, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-challenger','Challenger DFA','DOG_AREA','1100 W Irving Park Rd, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-churchill','Churchill DFA','DOG_AREA','1825 N Damen Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-clarendon','Clarendon DFA','DOG_AREA','4501 N Marine Dr, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-coliseum','Coliseum DFA','DOG_AREA','1466 S Wabash Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-grant','Grant DFA','DOG_AREA','951 S Columbus Dr, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-hamlin','Hamlin DFA','DOG_AREA','3035 N Hoyne Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-horner','Horner DFA','DOG_AREA','2741 W Montrose Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-kosciuszko','Kosciuszko DFA','DOG_AREA','2732 N Avers Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-lake-shore-east','Lake Shore East DFA','DOG_AREA','450 E Benton Pl, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-mckinley','McKinley DFA','DOG_AREA','2230 W Pershing Rd, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-montrose-beach','Montrose Beach DFA','DOG_AREA','601 W Montrose Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-noethling','Noethling DFA','DOG_AREA','2645 N Sheffield Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-norwood','Norwood DFA','DOG_AREA','5899 N Avondale Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-551','Park No. 551 DFA','DOG_AREA','353 N Des Plaines St, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-556','Park No. 556 DFA','DOG_AREA','2529 W Logan Blvd, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-569','Park No. 569 DFA','DOG_AREA','1358 W Monroe St, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-590','Park No. 590 DFA','DOG_AREA','3938-40 S Indiana Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-591','Park No. 591 DFA','DOG_AREA','3900 S Lake Park Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-592','Park No. 592 DFA','DOG_AREA','4149-53 S Vincennes Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-598','Park No. 598 DFA','DOG_AREA','1500 N Larrabee St, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-portage','Portage DFA','DOG_AREA','4100 N Long Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-pottawattomie','Pottawattomie DFA','DOG_AREA','7340 N Rogers Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-puptown','Puptown DFA','DOG_AREA','4900 N Marine Dr, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-river','River DFA','DOG_AREA','5100 N Francisco Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-walsh','Walsh DFA','DOG_AREA','1722 N Ashland Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-ward','Ward DFA','DOG_AREA','630 N Kingsbury St, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-wentworth','Wentworth DFA','DOG_AREA','5625 S Mobile Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-west-lawn','West Lawn DFA','DOG_AREA','4233 W 65th St, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE),
('dfa-wicker','Wicker DFA','DOG_AREA','1425 N Damen Ave, Chicago, IL','OFF_LEASH',TRUE,'VERIFIED','Chicago Park District 2026 Dog Friendly Areas directory',NULL,'2026-11-24T00:00:00Z',FALSE)
ON CONFLICT (id) DO NOTHING;

-- Keep important exceptions visible to internal data workflows.
UPDATE places
SET current_status = 'SEASONAL',
    seasonal = TRUE,
    status_reason = 'Temporary DFA designation; confirm current Park District status before publishing.'
WHERE id = 'dfa-bryn-mawr';

UPDATE places
SET source_notes = 'Small-dog-only DFA. Confirm current posted size restrictions before public launch.'
WHERE id = 'dfa-pottawattomie';
