-- ============================================================
-- BookKaroo — Migration 006
-- Seed movies covering ALL filters on /movies page:
--   Languages : Hindi, English, Tamil, Telugu, Malayalam,
--               Kannada, Marathi, Bengali, Punjabi, Gujarati
--   Formats   : 2D, 3D, IMAX, 4DX, Dolby Cinema
--   Genres    : Action, Comedy, Drama, Romance, Thriller, Horror,
--               Sci-Fi, Animation, Documentary, Biography, Musical
--   Categories: NowShowing(0), ComingSoon(1), Exclusive(2), Premiere(3)
--
-- PosterUrl / BackdropUrl / TrailerUrl are intentionally NULL.
-- Update them via Admin → Movies → Edit, or use the TMDB import
-- feature with the TmdbId provided for each movie.
-- To get poster paths: https://www.themoviedb.org/movie/{TmdbId}
--
-- Status:   0=Draft | 1=Published | 2=Archived
-- Category: 0=NowShowing | 1=ComingSoon | 2=Exclusive | 3=Premiere
--
-- Run AFTER 002_seed_data.sql in Supabase SQL Editor.
-- ============================================================

-- ── Fix existing seed: "Dolby" → "Dolby Cinema" to match frontend filter ──
UPDATE "Movies"
SET "Formats" = array_replace("Formats", 'Dolby', 'Dolby Cinema')
WHERE 'Dolby' = ANY("Formats");

-- ============================================================
-- NOW SHOWING  (Status=1, Category=0)
-- ============================================================
INSERT INTO "Movies" (
  "Id","TmdbId","Title","Slug","Description",
  "DurationMin","Languages","Formats","Genres",
  "Certificate","ReleaseDate","PosterUrl","BackdropUrl","TrailerUrl",
  "ImdbRating","Status","Category","CreatedAt","UpdatedAt","DeletedAt"
) VALUES

-- English · IMAX · Dolby Cinema · Biography · Drama
(gen_random_uuid(), 872585,
 'Oppenheimer', 'oppenheimer',
 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II — a gripping portrait of genius, moral ambiguity, and catastrophic consequence.',
 180, ARRAY['English','Hindi'], ARRAY['2D','IMAX','Dolby Cinema'],
 ARRAY['Biography','Drama','History'],
 'UA', '2023-07-21',
 NULL, NULL, NULL,
 8.9, 1, 0, now(), now(), NULL),

-- English · 3D · Dolby Cinema · Sci-Fi · Action
(gen_random_uuid(), 693134,
 'Dune: Part Two', 'dune-part-two',
 'Paul Atreides unites with the Fremen of Arrakis to wage war against those who destroyed his family. He must choose between the love of his life and the fate of the known universe.',
 166, ARRAY['English','Hindi'], ARRAY['2D','IMAX','3D','Dolby Cinema'],
 ARRAY['Sci-Fi','Action','Adventure'],
 'UA', '2024-03-01',
 NULL, NULL, NULL,
 8.5, 1, 0, now(), now(), NULL),

-- Hindi · Telugu · Tamil · 4DX · 3D · Sci-Fi · Action
(gen_random_uuid(), 1064028,
 'Kalki 2898 AD', 'kalki-2898-ad',
 'Set in a futuristic dystopia, an immortal bounty hunter crosses paths with a rebel and a pregnant woman who may hold the key to humanity''s salvation. A mythological saga reimagined for the future.',
 181, ARRAY['Hindi','Telugu','Tamil','Malayalam'], ARRAY['2D','IMAX','3D','4DX'],
 ARRAY['Sci-Fi','Action','Mythology'],
 'UA', '2024-06-27',
 NULL, NULL, NULL,
 7.2, 1, 0, now(), now(), NULL),

-- Kannada · Action · Drama · Mystery
(gen_random_uuid(), 882634,
 'Kantara', 'kantara',
 'A forest officer locks horns with a local hero over land encroachment, leading to a clash of traditions and a supernatural reckoning rooted in coastal Karnataka folklore.',
 148, ARRAY['Kannada','Hindi','Tamil','Telugu'], ARRAY['2D'],
 ARRAY['Action','Drama','Thriller','Mystery'],
 'A', '2022-09-30',
 NULL, NULL, NULL,
 8.4, 1, 0, now(), now(), NULL),

-- Malayalam · Adventure · Drama · Thriller
(gen_random_uuid(), 1218077,
 'Manjummel Boys', 'manjummel-boys',
 'Based on a true story: a group of friends from Kerala go on a trip to Kodaikanal. When one falls into the notorious Guna Caves, the others launch a daring rescue with nothing but courage.',
 137, ARRAY['Malayalam'], ARRAY['2D'],
 ARRAY['Adventure','Drama','Thriller'],
 'UA', '2024-02-22',
 NULL, NULL, NULL,
 8.5, 1, 0, now(), now(), NULL),

-- Hindi · Punjabi · Biography · Action · Romance
(gen_random_uuid(), 866015,
 'Shershaah', 'shershaah',
 'The true story of Captain Vikram Batra, PVC — the fearless Indian Army officer who recaptured peaks from Pakistani forces during the Kargil War of 1999. A soldier, a lover, a legend.',
 135, ARRAY['Hindi','Punjabi'], ARRAY['2D'],
 ARRAY['Biography','Action','Romance','War'],
 'UA', '2021-08-12',
 NULL, NULL, NULL,
 7.6, 1, 0, now(), now(), NULL),

-- Hindi · Biography · Drama · Musical
(gen_random_uuid(), 812378,
 'Gangubai Kathiawadi', 'gangubai-kathiawadi',
 'A young girl sold into prostitution rises to become one of the most powerful and beloved women in Mumbai''s Kamathipura district — through wit, courage, and an iron will.',
 152, ARRAY['Hindi'], ARRAY['2D'],
 ARRAY['Biography','Drama','Crime','Musical'],
 'UA', '2022-02-25',
 NULL, NULL, NULL,
 7.1, 1, 0, now(), now(), NULL),

-- Tamil · English · Documentary
(gen_random_uuid(), 935885,
 'The Elephant Whisperers', 'the-elephant-whisperers',
 'An indigenous couple from Tamil Nadu devote their lives to raising Raghu, an orphaned baby elephant. An Oscar-winning documentary about the profound bond between humans and nature.',
 39, ARRAY['Tamil','English'], ARRAY['2D'],
 ARRAY['Documentary'],
 'U', '2022-12-02',
 NULL, NULL, NULL,
 7.8, 1, 0, now(), now(), NULL),

-- Hindi · Thriller · Mystery · Comedy
(gen_random_uuid(), 592350,
 'Andhadhun', 'andhadhun',
 'A seemingly blind pianist accidentally witnesses a murder. Now both the perpetrators and the police are after him — and nothing, absolutely nothing, is what it seems.',
 139, ARRAY['Hindi'], ARRAY['2D'],
 ARRAY['Thriller','Mystery','Crime','Comedy'],
 'UA', '2018-10-05',
 NULL, NULL, NULL,
 8.3, 1, 0, now(), now(), NULL),

-- English · Hindi · Animation · Comedy · Adventure
(gen_random_uuid(), 315162,
 'Puss in Boots: The Last Wish', 'puss-in-boots-the-last-wish',
 'Puss in Boots discovers he has burned through eight of his nine lives. He must find the mythical Last Wish and restore his nine lives — before his enemies find him first.',
 100, ARRAY['English','Hindi'], ARRAY['2D','3D'],
 ARRAY['Animation','Comedy','Adventure','Family'],
 'U', '2022-12-21',
 NULL, NULL, NULL,
 7.9, 1, 0, now(), now(), NULL),

-- Gujarati · Hindi · Drama · Comedy · Family
(gen_random_uuid(), 876220,
 'Chhello Show', 'chhello-show',
 'Set in 1990s rural Gujarat, a nine-year-old boy becomes obsessed with the magic of cinema and befriends a projector operator. India''s official Oscar entry — a love letter to cinema and childhood.',
 112, ARRAY['Gujarati','Hindi'], ARRAY['2D'],
 ARRAY['Drama','Comedy','Family'],
 'U', '2021-10-14',
 NULL, NULL, NULL,
 7.9, 1, 0, now(), now(), NULL),

-- Hindi · Romance · Comedy · Drama
(gen_random_uuid(), 946472,
 'Rocky Aur Rani Kii Prem Kahaani', 'rocky-aur-rani-kii-prem-kahaani',
 'Rocky, a gregarious Punjabi boy, and Rani, an intellectual Bengali journalist, fall in love. They agree to live in each other''s families before marriage — sparking a colourful clash of cultures.',
 168, ARRAY['Hindi'], ARRAY['2D'],
 ARRAY['Romance','Comedy','Drama'],
 'UA', '2023-07-28',
 NULL, NULL, NULL,
 6.8, 1, 0, now(), now(), NULL),

-- Bengali · Hindi · Biography · Drama
(gen_random_uuid(), NULL,
 'Aparajito', 'aparajito-2022',
 'A biographical drama tracing the creative journey of legendary filmmaker Satyajit Ray — from a struggling artist to an internationally acclaimed genius who put Indian cinema on the world map.',
 141, ARRAY['Bengali','Hindi'], ARRAY['2D'],
 ARRAY['Biography','Drama'],
 'UA', '2022-05-20',
 NULL, NULL, NULL,
 8.1, 1, 0, now(), now(), NULL),

-- Hindi · Marathi · Horror · Fantasy · Drama
(gen_random_uuid(), 573435,
 'Tumbbad', 'tumbbad',
 'Spanning generations, a mythological story about a man who discovers hidden treasure guarded by a forgotten deity. A haunting tale of greed, myth, and the monstrous cost of obsession.',
 104, ARRAY['Hindi','Marathi'], ARRAY['2D'],
 ARRAY['Horror','Fantasy','Drama','Thriller'],
 'UA', '2018-10-12',
 NULL, NULL, NULL,
 8.3, 1, 0, now(), now(), NULL),

-- Hindi · Biography · Drama (12th Fail)
(gen_random_uuid(), 1138291,
 '12th Fail', '12th-fail',
 'A young man from a small village repeatedly fails his board exams but refuses to quit. Against impossible odds, he finds a path to becoming an IPS officer.',
 147, ARRAY['Hindi'], ARRAY['2D'],
 ARRAY['Biography','Drama'],
 'UA', '2023-10-27',
 NULL, NULL, NULL,
 9.0, 1, 0, now(), now(), NULL),

-- Hindi · Thriller · Political Drama
(gen_random_uuid(), NULL,
 'Article 370', 'article-370',
 'A political thriller depicting the abrogation of Article 370 in Jammu & Kashmir. A female intelligence officer races against time to execute one of India''s most consequential decisions.',
 155, ARRAY['Hindi'], ARRAY['2D','IMAX'],
 ARRAY['Thriller','Drama'],
 'UA', '2024-02-23',
 NULL, NULL, NULL,
 8.3, 1, 0, now(), now(), NULL),

-- Telugu · Hindi · Tamil · Action · Thriller
(gen_random_uuid(), NULL,
 'Devara: Part 1', 'devara-part-1',
 'A fearsome sea-lord''s legacy of dominance is threatened decades later when his timid son is forced to confront the same violent world — and must find the monster within to survive it.',
 166, ARRAY['Telugu','Hindi','Tamil'], ARRAY['2D','IMAX','3D'],
 ARRAY['Action','Thriller','Drama'],
 'UA', '2024-09-27',
 NULL, NULL, NULL,
 6.5, 1, 0, now(), now(), NULL)

ON CONFLICT DO NOTHING;

-- ============================================================
-- COMING SOON  (Status=1, Category=1)
-- ============================================================
INSERT INTO "Movies" (
  "Id","TmdbId","Title","Slug","Description",
  "DurationMin","Languages","Formats","Genres",
  "Certificate","ReleaseDate","PosterUrl","BackdropUrl","TrailerUrl",
  "ImdbRating","Status","Category","CreatedAt","UpdatedAt","DeletedAt"
) VALUES

-- Tamil · Hindi · Action
(gen_random_uuid(), NULL,
 'Coolie', 'coolie-2025',
 'Rajinikanth stars as a railway coolie with a secret past. A high-octane action saga about identity, justice, and the fury of a man pushed beyond his limit.',
 NULL, ARRAY['Tamil','Hindi','Telugu'], ARRAY['2D','IMAX'],
 ARRAY['Action','Thriller'],
 'UA', '2025-08-14',
 NULL, NULL, NULL,
 NULL, 1, 1, now(), now(), NULL),

-- Hindi · Punjabi · Biography · Action · Historical
(gen_random_uuid(), NULL,
 'Kesari Chapter 2: The Untold Story of Jallianwala Bagh', 'kesari-chapter-2',
 'The sequel revisits one of India''s most harrowing historical events — uncovering the political forces behind the Jallianwala Bagh massacre and the fight for justice that followed.',
 NULL, ARRAY['Hindi','Punjabi'], ARRAY['2D','IMAX'],
 ARRAY['Biography','Action','Drama'],
 'UA', '2025-04-18',
 NULL, NULL, NULL,
 NULL, 1, 1, now(), now(), NULL),

-- Malayalam · Action · Thriller
(gen_random_uuid(), NULL,
 'L2: Empuraan', 'l2-empuraan',
 'The highly anticipated sequel to Lucifer — Stephen Nedumpally''s past catches up with him as he is drawn back into a global conflict that threatens everything he has built.',
 NULL, ARRAY['Malayalam','Hindi','Tamil'], ARRAY['2D','IMAX'],
 ARRAY['Action','Thriller','Crime'],
 'UA', '2025-03-27',
 NULL, NULL, NULL,
 NULL, 1, 1, now(), now(), NULL)

ON CONFLICT DO NOTHING;

-- ============================================================
-- EXCLUSIVE  (Status=1, Category=2)
-- ============================================================
INSERT INTO "Movies" (
  "Id","TmdbId","Title","Slug","Description",
  "DurationMin","Languages","Formats","Genres",
  "Certificate","ReleaseDate","PosterUrl","BackdropUrl","TrailerUrl",
  "ImdbRating","Status","Category","CreatedAt","UpdatedAt","DeletedAt"
) VALUES

-- Tamil · Hindi · Dolby Cinema · Biography · Drama (exclusive re-screening)
(gen_random_uuid(), 854181,
 'Soorarai Pottru', 'soorarai-pottru',
 'Based on the life of Air Deccan founder G. R. Gopinath — a soldier-turned-entrepreneur who dared to dream of affordable air travel for every Indian. BookKaroo exclusive re-screening.',
 153, ARRAY['Tamil','Hindi'], ARRAY['2D','Dolby Cinema'],
 ARRAY['Biography','Drama'],
 'UA', '2020-11-12',
 NULL, NULL, NULL,
 8.7, 1, 2, now(), now(), NULL),

-- English · Hindi · IMAX · Dolby Cinema · Sci-Fi · Drama (anniversary remaster)
(gen_random_uuid(), 157336,
 'Interstellar', 'interstellar',
 'A team of explorers travel through a wormhole in space to ensure humanity''s survival. BookKaroo exclusive 10th-anniversary IMAX remaster — Christopher Nolan''s masterpiece on the biggest screen.',
 169, ARRAY['English','Hindi'], ARRAY['IMAX','2D','Dolby Cinema'],
 ARRAY['Sci-Fi','Drama','Adventure'],
 'UA', '2014-11-07',
 NULL, NULL, NULL,
 8.7, 1, 2, now(), now(), NULL)

ON CONFLICT DO NOTHING;

-- ============================================================
-- PREMIERES  (Status=1, Category=3)
-- ============================================================
INSERT INTO "Movies" (
  "Id","TmdbId","Title","Slug","Description",
  "DurationMin","Languages","Formats","Genres",
  "Certificate","ReleaseDate","PosterUrl","BackdropUrl","TrailerUrl",
  "ImdbRating","Status","Category","CreatedAt","UpdatedAt","DeletedAt"
) VALUES

-- Hindi · Gujarati · Romance · Musical · Comedy
(gen_random_uuid(), NULL,
 'Loveyapa', 'loveyapa',
 'BookKaroo Premiere: A modern love story set across Mumbai and Gujarat — two families, two worldviews, one couple caught in the middle. A heartwarming musical celebration of love across cultures.',
 NULL, ARRAY['Hindi','Gujarati'], ARRAY['2D','Dolby Cinema'],
 ARRAY['Romance','Musical','Comedy'],
 'UA', '2025-02-07',
 NULL, NULL, NULL,
 NULL, 1, 3, now(), now(), NULL),

-- Bengali · Adventure · Drama · Mystery
(gen_random_uuid(), NULL,
 'Durgeshgorer Guptodhan', 'durgeshgorer-guptodhan',
 'BookKaroo Premiere: A Bengali adventure film following a professor and students who uncover a century-old mystery hidden in a crumbling zamindar mansion — and the treasure that comes with it.',
 128, ARRAY['Bengali'], ARRAY['2D'],
 ARRAY['Adventure','Drama','Mystery'],
 'UA', '2019-05-31',
 NULL, NULL, NULL,
 7.8, 1, 3, now(), now(), NULL)

ON CONFLICT DO NOTHING;

-- ============================================================
-- Verify coverage — paste each SELECT individually to check
-- ============================================================
/*
-- Languages
SELECT unnest("Languages") AS lang, COUNT(*) AS movies
FROM "Movies" WHERE "DeletedAt" IS NULL AND "Status" = 1
GROUP BY lang ORDER BY lang;

-- Formats
SELECT unnest("Formats") AS fmt, COUNT(*) AS movies
FROM "Movies" WHERE "DeletedAt" IS NULL AND "Status" = 1
GROUP BY fmt ORDER BY fmt;

-- Genres
SELECT unnest("Genres") AS genre, COUNT(*) AS movies
FROM "Movies" WHERE "DeletedAt" IS NULL AND "Status" = 1
GROUP BY genre ORDER BY genre;

-- Categories
SELECT
  CASE "Category" WHEN 0 THEN 'NowShowing' WHEN 1 THEN 'ComingSoon'
                  WHEN 2 THEN 'Exclusive'   WHEN 3 THEN 'Premiere' END AS category,
  COUNT(*) AS movies
FROM "Movies" WHERE "DeletedAt" IS NULL AND "Status" = 1
GROUP BY "Category" ORDER BY "Category";
*/
