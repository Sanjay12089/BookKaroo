-- ============================================================
-- BookKaroo — Seed 05: Movies (20 titles)
-- TMDB IDs are real; poster/backdrop URLs use TMDB CDN.
-- Run after: 001_init.sql
-- ============================================================

INSERT INTO movies (
  id, tmdb_id, title, slug, description, duration_min,
  languages, formats, genres, "cast", crew,
  certificate, release_date, poster_url, backdrop_url, trailer_url,
  imdb_rating, status, category
) VALUES

-- 1. KGF Chapter 2
(
  'dddddddd-0001-0001-0001-000000000001',
  1118640,
  'KGF: Chapter 2',
  'kgf-chapter-2',
  'The blood-soaked land of Kolar Gold Fields (KGF), which struck fear in the heart of the entire nation, now sees a new threat in the form of Adheera, while Ramika Sen plans to take down Rocky.',
  168,
  ARRAY['Kannada','Hindi','Telugu','Tamil','Malayalam'],
  ARRAY['2D','3D','IMAX','4DX'],
  ARRAY['Action','Drama','Thriller'],
  '[
    {"name":"Yash","role":"Rocky Bhai","photo":"https://image.tmdb.org/t/p/w185/6ZxPIBb2RMnVSWOjfv0b1JkGDhm.jpg"},
    {"name":"Sanjay Dutt","role":"Adheera","photo":"https://image.tmdb.org/t/p/w185/6ZxPIBb2RMnVSWOjfv0b1JkGDhm.jpg"},
    {"name":"Raveena Tandon","role":"Ramika Sen","photo":""},
    {"name":"Srinidhi Shetty","role":"Reena","photo":""}
  ]'::jsonb,
  '[{"name":"Prashanth Neel","role":"Director"},{"name":"Hombale Films","role":"Producer"},{"name":"Ravi Basrur","role":"Music"}]'::jsonb,
  'A',
  '2022-04-14',
  'https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
  'https://image.tmdb.org/t/p/original/rAiYxVFo7QDk5Sc3UKuOmxUhRnS.jpg',
  'https://www.youtube.com/watch?v=zfbjgHqxOUs',
  8.4,
  'published',
  'now_showing'
),

-- 2. RRR
(
  'dddddddd-0001-0001-0001-000000000002',
  748783,
  'RRR',
  'rrr',
  'A fictitious story about two legendary revolutionaries and their journey away from home before they took on the British Empire.',
  182,
  ARRAY['Telugu','Hindi','Tamil','Malayalam','Kannada'],
  ARRAY['2D','3D','IMAX'],
  ARRAY['Action','Drama','History'],
  '[
    {"name":"N.T. Rama Rao Jr.","role":"Komaram Bheem","photo":""},
    {"name":"Ram Charan","role":"Alluri Sitarama Raju","photo":""},
    {"name":"Alia Bhatt","role":"Sita","photo":""},
    {"name":"Ajay Devgn","role":"Venkata Rama Raju","photo":""}
  ]'::jsonb,
  '[{"name":"S.S. Rajamouli","role":"Director"},{"name":"D.V.V. Danayya","role":"Producer"},{"name":"M.M. Keeravani","role":"Music"}]'::jsonb,
  'UA',
  '2022-03-25',
  'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
  'https://image.tmdb.org/t/p/original/5YMMWB2SqWEYSWh3LhQjWzeCHFu.jpg',
  'https://www.youtube.com/watch?v=f_vbAtFSEc0',
  7.9,
  'published',
  'now_showing'
),

-- 3. Pathaan
(
  'dddddddd-0001-0001-0001-000000000003',
  848326,
  'Pathaan',
  'pathaan',
  'An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.',
  146,
  ARRAY['Hindi','Tamil','Telugu'],
  ARRAY['2D','3D','IMAX','4DX'],
  ARRAY['Action','Thriller'],
  '[
    {"name":"Shah Rukh Khan","role":"Pathaan","photo":""},
    {"name":"Deepika Padukone","role":"Rubina","photo":""},
    {"name":"John Abraham","role":"Jim","photo":""}
  ]'::jsonb,
  '[{"name":"Siddharth Anand","role":"Director"},{"name":"Aditya Chopra","role":"Producer"},{"name":"Vishal-Shekhar","role":"Music"}]'::jsonb,
  'UA',
  '2023-01-25',
  'https://image.tmdb.org/t/p/w500/mXLOHHc1Zeuwsl4xYKjKh2280oL.jpg',
  'https://image.tmdb.org/t/p/original/67okkCuGAksTQ3xbTa3gTVPwnBQ.jpg',
  'https://www.youtube.com/watch?v=vqu4z34wENw',
  5.8,
  'published',
  'now_showing'
),

-- 4. Animal
(
  'dddddddd-0001-0001-0001-000000000004',
  1014342,
  'Animal',
  'animal',
  'A son is distraught after learning that his father''s life is under threat. He returns home to protect him, but his aggression and blind love push him toward the edge.',
  204,
  ARRAY['Hindi'],
  ARRAY['2D','3D','IMAX'],
  ARRAY['Action','Crime','Drama'],
  '[
    {"name":"Ranbir Kapoor","role":"Ranvijay Balbir Singh","photo":""},
    {"name":"Rashmika Mandanna","role":"Geetanjali","photo":""},
    {"name":"Anil Kapoor","role":"Balbir Singh","photo":""},
    {"name":"Bobby Deol","role":"Abrar Haque","photo":""}
  ]'::jsonb,
  '[{"name":"Sandeep Reddy Vanga","role":"Director"},{"name":"Bhushan Kumar","role":"Producer"},{"name":"Harshavardhan Rameshwar","role":"Music"}]'::jsonb,
  'A',
  '2023-12-01',
  'https://image.tmdb.org/t/p/w500/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg',
  'https://image.tmdb.org/t/p/original/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg',
  'https://www.youtube.com/watch?v=MBXxPoeVu5Y',
  5.5,
  'published',
  'now_showing'
),

-- 5. Jawan
(
  'dddddddd-0001-0001-0001-000000000005',
  1068922,
  'Jawan',
  'jawan',
  'A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago. He comes up against a powerful villain and is aided by a team of women.',
  169,
  ARRAY['Hindi','Tamil','Telugu'],
  ARRAY['2D','3D','IMAX','Dolby Cinema'],
  ARRAY['Action','Drama','Thriller'],
  '[
    {"name":"Shah Rukh Khan","role":"Vikram Rathore / Azad","photo":""},
    {"name":"Nayanthara","role":"Narmada Rai","photo":""},
    {"name":"Vijay Sethupathi","role":"Kaalee","photo":""},
    {"name":"Deepika Padukone","role":"Aishwarya","photo":""}
  ]'::jsonb,
  '[{"name":"Atlee","role":"Director"},{"name":"Gauri Khan","role":"Producer"},{"name":"Anirudh Ravichander","role":"Music"}]'::jsonb,
  'UA',
  '2023-09-07',
  'https://image.tmdb.org/t/p/w500/jKECXJgLQJxcL7oKkMzNmFAq15e.jpg',
  'https://image.tmdb.org/t/p/original/2d6p7IF4jUVPb2aJlMl2A0bRFcC.jpg',
  'https://www.youtube.com/watch?v=yLrJMCExRf4',
  5.2,
  'published',
  'now_showing'
),

-- 6. Kalki 2898-AD
(
  'dddddddd-0001-0001-0001-000000000006',
  1064213,
  'Kalki 2898-AD',
  'kalki-2898-ad',
  'Set in a dystopian future, the film is a mythological sci-fi epic that intertwines the story of Kalki, the 10th avatar of Lord Vishnu, with a futuristic narrative.',
  181,
  ARRAY['Telugu','Hindi','Tamil','Malayalam','Kannada'],
  ARRAY['2D','3D','IMAX','4DX','Dolby Cinema'],
  ARRAY['Action','Sci-Fi','Drama'],
  '[
    {"name":"Prabhas","role":"Bhairava","photo":""},
    {"name":"Deepika Padukone","role":"Sumathi / SUM-80","photo":""},
    {"name":"Amitabh Bachchan","role":"Ashwatthama","photo":""},
    {"name":"Kamal Haasan","role":"Supreme Yaskin","photo":""}
  ]'::jsonb,
  '[{"name":"Nag Ashwin","role":"Director"},{"name":"Ashwini Dutt","role":"Producer"},{"name":"Santhosh Narayanan","role":"Music"}]'::jsonb,
  'UA',
  '2024-06-27',
  'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
  'https://image.tmdb.org/t/p/original/jKrDM7l79VnFoQKhT4RO0cjfJOZ.jpg',
  'https://www.youtube.com/watch?v=6oOPNGWnFbk',
  6.6,
  'published',
  'now_showing'
),

-- 7. Stree 2
(
  'dddddddd-0001-0001-0001-000000000007',
  1184918,
  'Stree 2',
  'stree-2',
  'The town of Chanderi is under a new threat. The men must once again rise up to protect themselves from a terrifying force, but this time with unexpected allies.',
  165,
  ARRAY['Hindi'],
  ARRAY['2D','3D'],
  ARRAY['Horror','Comedy','Drama'],
  '[
    {"name":"Rajkummar Rao","role":"Vicky","photo":""},
    {"name":"Shraddha Kapoor","role":"Stree","photo":""},
    {"name":"Aparshakti Khurana","role":"Bittu","photo":""},
    {"name":"Pankaj Tripathi","role":"Rudra","photo":""}
  ]'::jsonb,
  '[{"name":"Amar Kaushik","role":"Director"},{"name":"Dinesh Vijan","role":"Producer"},{"name":"Sachin-Jigar","role":"Music"}]'::jsonb,
  'UA',
  '2024-08-15',
  'https://image.tmdb.org/t/p/w500/oRRGLsqfKIxCl0kdP5hT44bPMnp.jpg',
  'https://image.tmdb.org/t/p/original/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
  'https://www.youtube.com/watch?v=PsIoQp8T1RM',
  7.0,
  'published',
  'now_showing'
),

-- 8. Fighter
(
  'dddddddd-0001-0001-0001-000000000008',
  1043905,
  'Fighter',
  'fighter',
  'India''s first aerial action franchise, Fighter follows Squadron Leader Shamsher Pathania and his elite team of Air Force officers who will stop at nothing to protect the country.',
  166,
  ARRAY['Hindi'],
  ARRAY['2D','3D','IMAX'],
  ARRAY['Action','Drama'],
  '[
    {"name":"Hrithik Roshan","role":"Shamsher Pathania","photo":""},
    {"name":"Deepika Padukone","role":"Minal Rathore","photo":""},
    {"name":"Anil Kapoor","role":"Group Capt Rakesh Jai Singh","photo":""}
  ]'::jsonb,
  '[{"name":"Siddharth Anand","role":"Director"},{"name":"Vikas Bahl","role":"Producer"},{"name":"Vishal-Shekhar","role":"Music"}]'::jsonb,
  'UA',
  '2024-01-25',
  'https://image.tmdb.org/t/p/w500/yPhBKYbRRkQJvSWjJ4SoqS9YMsS.jpg',
  'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
  'https://www.youtube.com/watch?v=4RwJSsNBwqk',
  5.7,
  'published',
  'now_showing'
),

-- 9. Pushpa 2: The Rule
(
  'dddddddd-0001-0001-0001-000000000009',
  1213765,
  'Pushpa 2: The Rule',
  'pushpa-2-the-rule',
  'Pushpa Raj confronts the police and the red sanders smuggling syndicate while dealing with domestic struggles and new enemies.',
  220,
  ARRAY['Telugu','Hindi','Tamil','Malayalam','Kannada'],
  ARRAY['2D','3D','IMAX','Dolby Cinema'],
  ARRAY['Action','Crime','Drama'],
  '[
    {"name":"Allu Arjun","role":"Pushpa Raj","photo":""},
    {"name":"Rashmika Mandanna","role":"Srivalli","photo":""},
    {"name":"Fahadh Faasil","role":"Bhanwar Singh Shekawat","photo":""}
  ]'::jsonb,
  '[{"name":"Sukumar","role":"Director"},{"name":"Naveen Yerneni","role":"Producer"},{"name":"Devi Sri Prasad","role":"Music"}]'::jsonb,
  'A',
  '2024-12-05',
  'https://image.tmdb.org/t/p/w500/3JnZcEg36POwDJrNMIeKSQ3m6YR.jpg',
  'https://image.tmdb.org/t/p/original/jKECXJgLQJxcL7oKkMzNmFAq15e.jpg',
  'https://www.youtube.com/watch?v=Q4h5bCT7-g0',
  7.2,
  'published',
  'now_showing'
),

-- 10. Singham Again
(
  'dddddddd-0001-0001-0001-000000000010',
  1211444,
  'Singham Again',
  'singham-again',
  'Singham must fight against a formidable antagonist to rescue his wife, in this mythological action spectacle.',
  154,
  ARRAY['Hindi','Tamil','Telugu'],
  ARRAY['2D','3D'],
  ARRAY['Action','Drama'],
  '[
    {"name":"Ajay Devgn","role":"Bajirao Singham","photo":""},
    {"name":"Kareena Kapoor Khan","role":"Avni Singham","photo":""},
    {"name":"Ranveer Singh","role":"Simmba","photo":""},
    {"name":"Tiger Shroff","role":"Satya","photo":""}
  ]'::jsonb,
  '[{"name":"Rohit Shetty","role":"Director"},{"name":"Jio Studios","role":"Producer"},{"name":"A.R. Rahman","role":"Music"}]'::jsonb,
  'UA',
  '2024-11-01',
  'https://image.tmdb.org/t/p/w500/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg',
  'https://image.tmdb.org/t/p/original/rAiYxVFo7QDk5Sc3UKuOmxUhRnS.jpg',
  'https://www.youtube.com/watch?v=_G7XBNtkGCQ',
  5.3,
  'published',
  'now_showing'
),

-- 11. Sky Force (Coming Soon)
(
  'dddddddd-0001-0001-0001-000000000011',
  1380452,
  'Sky Force',
  'sky-force',
  'India''s first airstrikes. The story of India''s deadliest airstrike and the valiant officers behind it.',
  145,
  ARRAY['Hindi'],
  ARRAY['2D','3D','IMAX'],
  ARRAY['Action','Drama','History'],
  '[
    {"name":"Akshay Kumar","role":"Squadron Leader KO Ahuja","photo":""},
    {"name":"Veer Pahariya","role":"T.","photo":""},
    {"name":"Sara Ali Khan","role":"Mia","photo":""},
    {"name":"Nimrat Kaur","role":"Meghna Ahuja","photo":""}
  ]'::jsonb,
  '[{"name":"Abhishek Anil Kapur","role":"Director"},{"name":"Dinesh Vijan","role":"Producer"},{"name":"Sanchet-Parth","role":"Music"}]'::jsonb,
  'UA',
  '2025-01-24',
  'https://image.tmdb.org/t/p/w500/mXLOHHc1Zeuwsl4xYKjKh2280oL.jpg',
  'https://image.tmdb.org/t/p/original/67okkCuGAksTQ3xbTa3gTVPwnBQ.jpg',
  'https://www.youtube.com/watch?v=ZvUMBFCfmfQ',
  6.1,
  'published',
  'coming_soon'
),

-- 12. War 2 (Coming Soon)
(
  'dddddddd-0001-0001-0001-000000000012',
  945961,
  'War 2',
  'war-2',
  'Kabir returns for another high-octane mission against a new lethal enemy threatening national security.',
  0,
  ARRAY['Hindi'],
  ARRAY['2D','3D','IMAX','4DX'],
  ARRAY['Action','Thriller'],
  '[
    {"name":"Hrithik Roshan","role":"Kabir","photo":""},
    {"name":"Jr. NTR","role":"","photo":""},
    {"name":"Kiara Advani","role":"","photo":""}
  ]'::jsonb,
  '[{"name":"Ayan Mukerji","role":"Director"},{"name":"Yash Raj Films","role":"Producer"}]'::jsonb,
  'UA',
  '2025-08-14',
  'https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
  'https://image.tmdb.org/t/p/original/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
  NULL,
  NULL,
  'published',
  'coming_soon'
),

-- 13. Raid 2
(
  'dddddddd-0001-0001-0001-000000000013',
  1396438,
  'Raid 2',
  'raid-2',
  'Income Tax officer Amay Patnaik returns, now taking on a powerful political network of corruption.',
  148,
  ARRAY['Hindi'],
  ARRAY['2D','3D'],
  ARRAY['Action','Crime','Drama'],
  '[
    {"name":"Ajay Devgn","role":"Amay Patnaik","photo":""},
    {"name":"Riteish Deshmukh","role":"","photo":""},
    {"name":"Vaani Kapoor","role":"","photo":""}
  ]'::jsonb,
  '[{"name":"Raj Kumar Gupta","role":"Director"},{"name":"T-Series Films","role":"Producer"}]'::jsonb,
  'UA',
  '2025-03-14',
  'https://image.tmdb.org/t/p/w500/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg',
  'https://image.tmdb.org/t/p/original/5YMMWB2SqWEYSWh3LhQjWzeCHFu.jpg',
  'https://www.youtube.com/watch?v=HlG3fqETHrw',
  6.4,
  'published',
  'now_showing'
),

-- 14. Chhaava
(
  'dddddddd-0001-0001-0001-000000000014',
  1196074,
  'Chhaava',
  'chhaava',
  'The story of Sambhaji, warrior king and son of Chhatrapati Shivaji Maharaj, as he battles against the Mughal Emperor Aurangzeb.',
  157,
  ARRAY['Hindi','Marathi'],
  ARRAY['2D','3D','IMAX','Dolby Cinema'],
  ARRAY['Action','Drama','History','Biography'],
  '[
    {"name":"Vicky Kaushal","role":"Sambhaji Maharaj","photo":""},
    {"name":"Rashmika Mandanna","role":"Yesubai","photo":""},
    {"name":"Akshaye Khanna","role":"Aurangzeb","photo":""}
  ]'::jsonb,
  '[{"name":"Laxman Utekar","role":"Director"},{"name":"Dinesh Vijan","role":"Producer"},{"name":"A.R. Rahman","role":"Music"}]'::jsonb,
  'UA',
  '2025-02-14',
  'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
  'https://image.tmdb.org/t/p/original/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
  'https://www.youtube.com/watch?v=JTf3-h6sAO0',
  8.1,
  'published',
  'now_showing'
),

-- 15. Deva
(
  'dddddddd-0001-0001-0001-000000000015',
  1381267,
  'Deva',
  'deva',
  'A fearless and rebellious cop embarks on a thrilling investigation that leads him to confront his own murky past.',
  145,
  ARRAY['Hindi'],
  ARRAY['2D','3D'],
  ARRAY['Action','Crime','Mystery'],
  '[
    {"name":"Shahid Kapoor","role":"Deva","photo":""},
    {"name":"Pooja Hegde","role":"","photo":""}
  ]'::jsonb,
  '[{"name":"Rosshan Andrrews","role":"Director"},{"name":"Zee Studios","role":"Producer"},{"name":"Vishal-Shekhar","role":"Music"}]'::jsonb,
  'UA',
  '2025-01-31',
  'https://image.tmdb.org/t/p/w500/yPhBKYbRRkQJvSWjJ4SoqS9YMsS.jpg',
  'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
  'https://www.youtube.com/watch?v=w9A-f4F8qrA',
  5.9,
  'published',
  'now_showing'
),

-- 16. L2: Empuraan (Coming Soon)
(
  'dddddddd-0001-0001-0001-000000000016',
  1014343,
  'L2: Empuraan',
  'l2-empuraan',
  'The second installment of the Lucifer franchise, continuing the story of Stephen Nedumpally as he reveals his true identity.',
  0,
  ARRAY['Malayalam','Hindi','Telugu','Tamil','Kannada'],
  ARRAY['2D','3D','IMAX'],
  ARRAY['Action','Drama','Crime'],
  '[
    {"name":"Mohanlal","role":"Stephen Nedumpally / Khureshi Ab''raam","photo":""},
    {"name":"Prithviraj Sukumaran","role":"Zayed Masood","photo":""}
  ]'::jsonb,
  '[{"name":"Prithviraj Sukumaran","role":"Director"},{"name":"Antony Perumbavoor","role":"Producer"},{"name":"Deepak Dev","role":"Music"}]'::jsonb,
  'UA',
  '2025-03-27',
  'https://image.tmdb.org/t/p/w500/3JnZcEg36POwDJrNMIeKSQ3m6YR.jpg',
  'https://image.tmdb.org/t/p/original/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg',
  NULL,
  NULL,
  'published',
  'coming_soon'
),

-- 17. Bhool Bhulaiyaa 3
(
  'dddddddd-0001-0001-0001-000000000017',
  1034541,
  'Bhool Bhulaiyaa 3',
  'bhool-bhulaiyaa-3',
  'Rooh Baba is back, and so is Manjulika. The comedy-horror sequel brings a new haunting twist to Chandramukhi''s story.',
  156,
  ARRAY['Hindi'],
  ARRAY['2D','3D'],
  ARRAY['Horror','Comedy'],
  '[
    {"name":"Kartik Aaryan","role":"Rooh Baba","photo":""},
    {"name":"Vidya Balan","role":"Manjulika","photo":""},
    {"name":"Madhuri Dixit","role":"","photo":""},
    {"name":"Triptii Dimri","role":"","photo":""}
  ]'::jsonb,
  '[{"name":"Anees Bazmee","role":"Director"},{"name":"Bhushan Kumar","role":"Producer"},{"name":"Pritam","role":"Music"}]'::jsonb,
  'UA',
  '2024-11-01',
  'https://image.tmdb.org/t/p/w500/oRRGLsqfKIxCl0kdP5hT44bPMnp.jpg',
  'https://image.tmdb.org/t/p/original/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg',
  'https://www.youtube.com/watch?v=5j3vNsQFlKI',
  6.2,
  'published',
  'now_showing'
),

-- 18. Game Changer
(
  'dddddddd-0001-0001-0001-000000000018',
  1219148,
  'Game Changer',
  'game-changer',
  'An IAS officer fights against corruption and injustice in a high-stakes political thriller.',
  160,
  ARRAY['Telugu','Hindi','Tamil','Malayalam','Kannada'],
  ARRAY['2D','3D','IMAX'],
  ARRAY['Action','Drama','Political'],
  '[
    {"name":"Ram Charan","role":"Ram Nandan / Appanna","photo":""},
    {"name":"Kiara Advani","role":"Deepika / Dhootika","photo":""},
    {"name":"S.J. Suryah","role":"Mohan Babu","photo":""}
  ]'::jsonb,
  '[{"name":"Shankar","role":"Director"},{"name":"Dil Raju","role":"Producer"},{"name":"Thaman S","role":"Music"}]'::jsonb,
  'UA',
  '2025-01-10',
  'https://image.tmdb.org/t/p/w500/2d6p7IF4jUVPb2aJlMl2A0bRFcC.jpg',
  'https://image.tmdb.org/t/p/original/2d6p7IF4jUVPb2aJlMl2A0bRFcC.jpg',
  'https://www.youtube.com/watch?v=RCqb9xrK4Yk',
  4.8,
  'published',
  'now_showing'
),

-- 19. Sikandar (Premiere/Coming Soon)
(
  'dddddddd-0001-0001-0001-000000000019',
  1380451,
  'Sikandar',
  'sikandar',
  'Salman Khan returns in a high-octane action thriller. Limited preview screenings starting soon.',
  0,
  ARRAY['Hindi'],
  ARRAY['2D','3D','IMAX'],
  ARRAY['Action','Drama'],
  '[
    {"name":"Salman Khan","role":"Sikandar","photo":""},
    {"name":"Rashmika Mandanna","role":"","photo":""}
  ]'::jsonb,
  '[{"name":"A.R. Murugadoss","role":"Director"},{"name":"Sajid Nadiadwala","role":"Producer"},{"name":"Pritam","role":"Music"}]'::jsonb,
  'UA',
  '2025-03-30',
  'https://image.tmdb.org/t/p/w500/jKECXJgLQJxcL7oKkMzNmFAq15e.jpg',
  'https://image.tmdb.org/t/p/original/jKECXJgLQJxcL7oKkMzNmFAq15e.jpg',
  NULL,
  NULL,
  'published',
  'premiere'
),

-- 20. Kantara Chapter 1 (Coming Soon)
(
  'dddddddd-0001-0001-0001-000000000020',
  1134512,
  'Kantara: Chapter 1',
  'kantara-chapter-1',
  'The prequel to the critically acclaimed Kantara, exploring the origins of the deity and the ancient traditions of the tribal community.',
  0,
  ARRAY['Kannada','Hindi','Telugu','Tamil'],
  ARRAY['2D','3D','IMAX'],
  ARRAY['Action','Drama','Mystery'],
  '[
    {"name":"Rishab Shetty","role":"","photo":""}
  ]'::jsonb,
  '[{"name":"Rishab Shetty","role":"Director"},{"name":"Vijay Kiragandur","role":"Producer"},{"name":"B. Ajaneesh Loknath","role":"Music"}]'::jsonb,
  'UA',
  '2026-01-01',
  'https://image.tmdb.org/t/p/w500/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg',
  'https://image.tmdb.org/t/p/original/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg',
  NULL,
  NULL,
  'published',
  'coming_soon'
)

ON CONFLICT (id) DO NOTHING;