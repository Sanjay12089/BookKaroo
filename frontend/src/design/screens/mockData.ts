export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  posterPath: string;
  backdropPath: string;
  rating: number;
  reviewCount: string;
  duration: string;
  certificate: string;
  languages: string[];
  formats: string[];
  genres: string[];
  director: string;
  cast: CastMember[];
  synopsis: string;
  releaseDate: string;
  status: 'now-showing' | 'coming-soon';
  fromPrice: number;
  heroSlide?: boolean;
}

export interface CastMember {
  name: string;
  role: string;
}

export interface ComingSoonMovie {
  id: string;
  slug: string;
  title: string;
  posterPath: string;
  releaseDate: string;
  genres: string[];
  languages: string[];
}

export interface Venue {
  id: string;
  name: string;
  area: string;
  distance: string;
  amenities: string[];
  showtimes: Showtime[];
  fromPrice: number;
}

export interface Showtime {
  id: string;
  time: string;
  format: string;
  language: string;
  availability: 'good' | 'fast' | 'low' | 'sold';
  seatsLeft: number;
  price: number;
}

export interface SeatRow {
  letter: string;
  category: 'recliner' | 'executive' | 'normal';
  seats: SeatCell[];
}

export type SeatState = 'available' | 'booked' | 'locked' | 'gap';

export interface SeatCell {
  id: string;
  number: number | null;
  state: SeatState;
}

// ─── Movies ──────────────────────────────────────────────────────────────────

export const MOVIES: Movie[] = [
  {
    id: 'kgf2',
    slug: 'kgf-chapter-2',
    title: 'KGF: Chapter 2',
    posterPath: '/k3No9gKfMVUbv52fYL5gbSlsXbk.jpg',
    backdropPath: '/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg',
    rating: 8.4,
    reviewCount: '142K',
    duration: '2h 48m',
    certificate: 'A',
    languages: ['Kannada', 'Hindi', 'Tamil', 'Telugu'],
    formats: ['2D', 'IMAX', '4DX'],
    genres: ['Action', 'Drama'],
    director: 'Prashanth Neel',
    cast: [
      { name: 'Yash', role: 'Rocky Bhai' },
      { name: 'Sanjay Dutt', role: 'Adheera' },
      { name: 'Raveena Tandon', role: 'Ramika Sen' },
      { name: 'Srinidhi Shetty', role: 'Reena' },
    ],
    synopsis: 'Rocky\'s bloodsoaked rise to power continues. Now the most feared man in the gold mines of Kolar, he faces a new threat from within the political establishment — and from a ghost of his own past.',
    releaseDate: '14 Apr 2022',
    status: 'now-showing',
    fromPrice: 220,
    heroSlide: true,
  },
  {
    id: 'chhaava',
    slug: 'chhaava',
    title: 'Chhaava',
    posterPath: '/6Wps7AYJG6AKYxXfQ6R0kxYDNxk.jpg',
    backdropPath: '/8gHn0EpHqd27EIyBXsVRAFcAaAX.jpg',
    rating: 9.1,
    reviewCount: '88K',
    duration: '2h 42m',
    certificate: 'UA',
    languages: ['Hindi', 'Marathi'],
    formats: ['2D', 'IMAX', 'Dolby'],
    genres: ['Historical', 'Action', 'Drama'],
    director: 'Laxman Utekar',
    cast: [
      { name: 'Vicky Kaushal', role: 'Chhatrapati Sambhaji Maharaj' },
      { name: 'Rashmika Mandanna', role: 'Yesubai' },
      { name: 'Akshaye Khanna', role: 'Aurangzeb' },
    ],
    synopsis: 'The legend of Chhatrapati Sambhaji Maharaj — warrior, poet, king. A man who chose death over dishonour and left an empire changed forever.',
    releaseDate: '14 Feb 2025',
    status: 'now-showing',
    fromPrice: 180,
    heroSlide: true,
  },
  {
    id: 'pushpa2',
    slug: 'pushpa-2-the-rule',
    title: 'Pushpa 2: The Rule',
    posterPath: '/jVkpuAaTwHVQPl5CyEJoT9FdP9J.jpg',
    backdropPath: '/4mcO7oAWMiI2VrEy72wBRgfXLiL.jpg',
    rating: 8.6,
    reviewCount: '204K',
    duration: '3h 22m',
    certificate: 'UA',
    languages: ['Telugu', 'Hindi', 'Tamil'],
    formats: ['2D', 'IMAX', '4DX', 'Dolby'],
    genres: ['Action', 'Thriller'],
    director: 'Sukumar',
    cast: [
      { name: 'Allu Arjun', role: 'Pushpa Raj' },
      { name: 'Rashmika Mandanna', role: 'Srivalli' },
      { name: 'Fahadh Faasil', role: 'SP Shekhawat' },
    ],
    synopsis: 'Pushpa Raj has built a red sandalwood empire no one can touch. But Shekhawat is back — and this time, it\'s personal. The Rule begins.',
    releaseDate: '5 Dec 2024',
    status: 'now-showing',
    fromPrice: 200,
    heroSlide: true,
  },
  {
    id: 'rrr',
    slug: 'rrr',
    title: 'RRR',
    posterPath: '/nEufeZa15NfBmk3iXjHqWCeGM3B.jpg',
    backdropPath: '/8RPpDf3VCmTWI4KpiB2kBPCvMFN.jpg',
    rating: 8.8,
    reviewCount: '176K',
    duration: '3h 2m',
    certificate: 'UA',
    languages: ['Telugu', 'Hindi', 'Tamil'],
    formats: ['2D', '4K', 'IMAX'],
    genres: ['Action', 'Drama', 'Historical'],
    director: 'S. S. Rajamouli',
    cast: [
      { name: 'Jr. NTR', role: 'Komaram Bheem' },
      { name: 'Ram Charan', role: 'Alluri Sitarama Raju' },
      { name: 'Ajay Devgn', role: 'Venkata Rama Raju' },
      { name: 'Alia Bhatt', role: 'Sita' },
    ],
    synopsis: 'Two legendary Indian revolutionaries — Alluri Sitarama Raju and Komaram Bheem — fight back against the British Raj. Before they became legends, they met.',
    releaseDate: '25 Mar 2022',
    status: 'now-showing',
    fromPrice: 150,
  },
  {
    id: 'stree2',
    slug: 'stree-2',
    title: 'Stree 2',
    posterPath: '/p3GT8Cz5AKkFo0UrMPhBVgypQQ8.jpg',
    backdropPath: '/3n5UQ7X3JH7jEI0RFh9O7cqwMdi.jpg',
    rating: 8.3,
    reviewCount: '94K',
    duration: '2h 20m',
    certificate: 'UA',
    languages: ['Hindi'],
    formats: ['2D', 'Dolby'],
    genres: ['Horror', 'Comedy'],
    director: 'Amar Kaushik',
    cast: [
      { name: 'Shraddha Kapoor', role: 'Stree' },
      { name: 'Rajkummar Rao', role: 'Vicky' },
      { name: 'Pankaj Tripathi', role: 'Rudra' },
      { name: 'Aparshakti Khurana', role: 'Bittu' },
    ],
    synopsis: 'Chanderi is safe — or so they thought. Stree returns with a new threat, and the gang must face a force far more terrifying than before.',
    releaseDate: '15 Aug 2024',
    status: 'now-showing',
    fromPrice: 150,
  },
  {
    id: 'animal',
    slug: 'animal',
    title: 'Animal',
    posterPath: '/oaHPEeC0v5XWmRH0zOmqFVJYTXi.jpg',
    backdropPath: '/a4jbFnWJeXD2KhMCsRpX6V3PKQR.jpg',
    rating: 7.6,
    reviewCount: '118K',
    duration: '3h 21m',
    certificate: 'A',
    languages: ['Hindi'],
    formats: ['2D', 'IMAX'],
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Sandeep Reddy Vanga',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Ranvijay Singh' },
      { name: 'Anil Kapoor', role: 'Balbir Singh' },
      { name: 'Rashmika Mandanna', role: 'Geetanjali' },
      { name: 'Bobby Deol', role: 'Abrar' },
    ],
    synopsis: 'A son\'s obsessive love for his father drives him to become something the world fears. Raw, uncompromising, and brutal.',
    releaseDate: '1 Dec 2023',
    status: 'now-showing',
    fromPrice: 150,
  },
  {
    id: 'jawan',
    slug: 'jawan',
    title: 'Jawan',
    posterPath: '/cGXFosYUHYjjdKZMCXsebYMtJH8.jpg',
    backdropPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    rating: 7.8,
    reviewCount: '136K',
    duration: '2h 49m',
    certificate: 'UA',
    languages: ['Hindi', 'Tamil'],
    formats: ['2D', 'IMAX', '4DX'],
    genres: ['Action', 'Thriller'],
    director: 'Atlee',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Azad / Vikram Rathore' },
      { name: 'Nayanthara', role: 'Narmada Rao' },
      { name: 'Vijay Sethupathi', role: 'Kalee' },
    ],
    synopsis: 'A man driven by a personal vendetta rescues six women who have been wronged, who together take down a corrupt system threatening the country.',
    releaseDate: '7 Sep 2023',
    status: 'now-showing',
    fromPrice: 170,
  },
  {
    id: 'fighter',
    slug: 'fighter',
    title: 'Fighter',
    posterPath: '/fWFxlrKvPbR7x7F2pRFqYgdS0mD.jpg',
    backdropPath: '/p9ZUzCyy9pSBKSBKwEFqJpFkXHS.jpg',
    rating: 7.2,
    reviewCount: '62K',
    duration: '2h 46m',
    certificate: 'UA',
    languages: ['Hindi'],
    formats: ['2D', 'IMAX', 'Dolby'],
    genres: ['Action', 'Patriotic'],
    director: 'Siddharth Anand',
    cast: [
      { name: 'Hrithik Roshan', role: 'Shamsher Pathania' },
      { name: 'Deepika Padukone', role: 'Minal Rathore' },
      { name: 'Anil Kapoor', role: 'Rocky' },
    ],
    synopsis: 'India\'s first aerial action franchise. Shamsher \'Patty\' Pathania leads an elite squadron into battle, forging unbreakable bonds along the way.',
    releaseDate: '25 Jan 2024',
    status: 'now-showing',
    fromPrice: 180,
  },
];

export const COMING_SOON: ComingSoonMovie[] = [
  {
    id: 'war2',
    slug: 'war-2',
    title: 'War 2',
    posterPath: '/war2_poster_placeholder.jpg',
    releaseDate: '14 Aug 2026',
    genres: ['Action', 'Spy'],
    languages: ['Hindi'],
  },
  {
    id: 'sikandar',
    slug: 'sikandar',
    title: 'Sikandar',
    posterPath: '/sikandar_poster_placeholder.jpg',
    releaseDate: '30 Mar 2026',
    genres: ['Action', 'Drama'],
    languages: ['Hindi'],
  },
  {
    id: 'kantara2',
    slug: 'kantara-chapter-1',
    title: 'Kantara: Chapter 1',
    posterPath: '/kantara2_poster_placeholder.jpg',
    releaseDate: '2 Oct 2026',
    genres: ['Folklore', 'Action'],
    languages: ['Kannada', 'Hindi'],
  },
];

// ─── Venues (Ahmedabad) ────────────────────────────────────────────────────────

export const VENUES: Venue[] = [
  {
    id: 'pvr-acropolis',
    name: 'PVR Cinemas · Acropolis Mall',
    area: 'Vastrapur',
    distance: '2.4 km',
    amenities: ['Parking', 'Food Court', 'M-Ticket', 'Recliner', 'Dolby'],
    fromPrice: 240,
    showtimes: [
      { id: 's1', time: '10:00 AM', format: '2D', language: 'Hindi', availability: 'good', seatsLeft: 142, price: 240 },
      { id: 's2', time: '1:15 PM', format: 'IMAX', language: 'Hindi', availability: 'fast', seatsLeft: 28, price: 520 },
      { id: 's3', time: '4:30 PM', format: 'Dolby', language: 'Telugu', availability: 'good', seatsLeft: 96, price: 380 },
      { id: 's4', time: '7:45 PM', format: 'IMAX', language: 'Hindi', availability: 'low', seatsLeft: 12, price: 520 },
      { id: 's5', time: '10:45 PM', format: '2D', language: 'Hindi', availability: 'good', seatsLeft: 188, price: 220 },
    ],
  },
  {
    id: 'inox-iscon',
    name: 'INOX · Iscon Mega Mall',
    area: 'Satellite',
    distance: '4.1 km',
    amenities: ['Parking', 'M-Ticket', 'Recliner', 'Accessible'],
    fromPrice: 200,
    showtimes: [
      { id: 's6', time: '9:30 AM', format: '2D', language: 'Kannada', availability: 'good', seatsLeft: 210, price: 200 },
      { id: 's7', time: '12:45 PM', format: '4DX', language: 'Hindi', availability: 'fast', seatsLeft: 34, price: 680 },
      { id: 's8', time: '4:00 PM', format: '2D', language: 'Hindi', availability: 'sold', seatsLeft: 0, price: 200 },
      { id: 's9', time: '7:15 PM', format: 'Dolby', language: 'Hindi', availability: 'good', seatsLeft: 118, price: 360 },
      { id: 's10', time: '10:30 PM', format: '2D', language: 'Telugu', availability: 'good', seatsLeft: 160, price: 180 },
    ],
  },
  {
    id: 'cinepolis-pavilion',
    name: 'Cinépolis · The Pavilion',
    area: 'SG Highway',
    distance: '6.8 km',
    amenities: ['Parking', 'Food Court', 'M-Ticket', 'Accessible'],
    fromPrice: 180,
    showtimes: [
      { id: 's11', time: '11:00 AM', format: '2D', language: 'Hindi', availability: 'good', seatsLeft: 184, price: 180 },
      { id: 's12', time: '2:15 PM', format: '3D', language: 'Hindi', availability: 'fast', seatsLeft: 42, price: 320 },
      { id: 's13', time: '5:45 PM', format: '2D', language: 'Tamil', availability: 'low', seatsLeft: 9, price: 200 },
      { id: 's14', time: '9:00 PM', format: 'Dolby', language: 'Hindi', availability: 'good', seatsLeft: 126, price: 340 },
    ],
  },
];

// ─── Seat layout helpers ───────────────────────────────────────────────────────

const BOOKED_SEATS: Record<string, number[]> = {
  A: [2, 8],
  B: [4, 11, 14],
  C: [1, 7, 13, 17],
  D: [3, 9, 16],
  E: [5, 12],
  F: [2, 6, 10, 15],
  G: [4, 8, 11],
  H: [1, 14, 18],
  I: [3, 7, 13],
  J: [6, 9, 12, 16],
  K: [2, 5, 11, 17],
  L: [4, 8, 15],
};

const LOCKED_SEATS: Record<string, number[]> = {
  C: [4],
  E: [9],
  G: [7],
  I: [10],
};

export type SeatCategory = 'recliner' | 'executive' | 'normal';

const ROW_CATEGORIES: Record<string, SeatCategory> = {
  A: 'recliner', B: 'recliner',
  C: 'executive', D: 'executive', E: 'executive', F: 'executive',
  G: 'normal', H: 'normal', I: 'normal', J: 'normal', K: 'normal', L: 'normal',
};

export const SEAT_PRICES: Record<SeatCategory, number> = {
  recliner: 650,
  executive: 420,
  normal: 260,
};

export function buildSeatLayout(): SeatRow[] {
  const rows: SeatRow[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  for (const letter of rowLetters) {
    const booked = BOOKED_SEATS[letter] ?? [];
    const locked = LOCKED_SEATS[letter] ?? [];
    const cells: SeatCell[] = [];
    let seatNum = 0;

    for (let col = 1; col <= 18; col++) {
      if (col === 7 || col === 13) {
        cells.push({ id: `${letter}-gap-${col}`, number: null, state: 'gap' });
      }
      seatNum++;
      const state: SeatState = booked.includes(seatNum)
        ? 'booked'
        : locked.includes(seatNum)
        ? 'locked'
        : 'available';
      cells.push({ id: `${letter}${seatNum}`, number: seatNum, state });
    }

    rows.push({
      letter,
      category: ROW_CATEGORIES[letter] ?? 'normal',
      seats: cells,
    });
  }

  return rows;
}

// ─── Events mock data ──────────────────────────────────────────────────────────

export interface EventCard {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  emoji: string;
  gradient: string;
  price: string;
  date: string;
}

export const EVENTS: EventCard[] = [
  {
    id: 'e1',
    title: 'Amit Trivedi Live',
    subtitle: 'Sabarmati Riverfront, Ahmedabad',
    type: 'Concert',
    emoji: '🎵',
    gradient: 'linear-gradient(135deg, #1a0a2e, #4c1d95)',
    price: '₹999 onwards',
    date: 'Sat, 17 May',
  },
  {
    id: 'e2',
    title: 'Zakir Khan: Sunata Hai Kya',
    subtitle: 'Tagore Hall, Ahmedabad',
    type: 'Comedy',
    emoji: '🎤',
    gradient: 'linear-gradient(135deg, #0a2a1a, #064e3b)',
    price: '₹699 onwards',
    date: 'Sun, 18 May',
  },
  {
    id: 'e3',
    title: 'Broadway Nights: Chicago',
    subtitle: 'Natarani Amphitheatre',
    type: 'Theatre',
    emoji: '🎭',
    gradient: 'linear-gradient(135deg, #3a0a2a, #831843)',
    price: '₹1,200 onwards',
    date: 'Fri, 23 May',
  },
];

export interface IPLMatch {
  team1: string;
  team2: string;
  abbr1: string;
  abbr2: string;
  color1: string;
  color2: string;
  date: string;
  time: string;
  venue: string;
}

export const IPL_MATCHES: IPLMatch[] = [
  { team1: 'Gujarat Titans', team2: 'Mumbai Indians', abbr1: 'GT', abbr2: 'MI', color1: '#1B64A7', color2: '#004BA0', date: '16 May', time: '7:30 PM', venue: 'Narendra Modi Stadium' },
  { team1: 'Royal Challengers', team2: 'Kolkata Knight Riders', abbr1: 'RCB', abbr2: 'KKR', color1: '#C41C1C', color2: '#3B215C', date: '18 May', time: '3:30 PM', venue: 'M Chinnaswamy Stadium' },
  { team1: 'Rajasthan Royals', team2: 'Chennai Super Kings', abbr1: 'RR', abbr2: 'CSK', color1: '#254AA5', color2: '#F9CD1B', date: '20 May', time: '7:30 PM', venue: 'Sawai Mansingh Stadium' },
];
