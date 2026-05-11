export interface TopMovieDto {
  id:           string;
  title:        string;
  slug:         string;
  posterUrl:    string | null;
  bookingCount: number;
}

export interface DayCount {
  date:  string;
  count: number;
}

export interface CityRevenue {
  cityName: string;
  revenue:  number;
}

export interface RecentBookingDto {
  bookingRef:  string;
  status:      string;
  amountPaid:  number;
  createdAt:   string;
  userName:    string;
  userEmail:   string;
  movieTitle:  string | null;
  posterUrl:   string | null;
  showDate:    string | null;
  showTime:    string | null;
  venueName:   string;
}

export interface ActivityDto {
  action:     string;
  entityType: string;
  entityId:   string | null;
  createdAt:  string;
  ip:         string | null;
}

export interface DashboardData {
  todayBookings:  number;
  todayRevenue:   number;
  weekRevenue:    number;
  monthRevenue:   number;
  totalUsers:     number;
  newUsersToday:  number;
  topMovie:       TopMovieDto | null;
  bookingsPerDay: DayCount[];
  revenuePerCity: CityRevenue[];
  recentBookings: RecentBookingDto[];
  recentActivity: ActivityDto[];
}

export interface AuditLogItem {
  id:         string;
  userId:     string | null;
  action:     string;
  entityType: string;
  entityId:   string | null;
  before:     string | null;
  after:      string | null;
  ip:         string | null;
  createdAt:  string;
}

export interface AuditLogPage {
  items:      AuditLogItem[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

// ── Movies ────────────────────────────────────────────────────────────────────

export interface AdminMovieResponse {
  id:          string;
  tmdbId:      number | null;
  title:       string;
  slug:        string;
  certificate: string | null;
  durationMin: number;
  languages:   string[];
  formats:     string[];
  genres:      string[];
  releaseDate: string | null;
  posterUrl:   string | null;
  backdropUrl: string | null;
  trailerUrl:  string | null;
  imdbRating:  number | null;
  status:      string;
  category:    string;
  createdAt:   string;
  updatedAt:   string;
}

export interface AdminMovieDetailResponse extends AdminMovieResponse {
  description: string | null;
  cast:        string | null;
  crew:        string | null;
}

export interface AdminMovieFilters {
  search?:   string;
  status?:   string;
  category?: string;
}

export interface AdminMoviePage {
  items:      AdminMovieResponse[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface CreateMoviePayload {
  title:       string;
  description?: string;
  durationMin: number;
  certificate?: string;
  languages?:  string[];
  formats?:    string[];
  genres?:     string[];
  releaseDate?: string;
  posterUrl?:  string;
  backdropUrl?: string;
  trailerUrl?:  string;
  imdbRating?:  number;
  status?:     string;
  category?:   string;
  cast?:       string;
  crew?:       string;
  tmdbId?:     number;
}

export type UpdateMoviePayload = Partial<CreateMoviePayload>;

// ── Events ────────────────────────────────────────────────────────────────────

export interface AdminEventResponse {
  id:             string;
  title:          string;
  slug:           string;
  type:           string;
  eventDate:      string | null;
  eventDateLabel: string;
  language:       string | null;
  ageRestriction: number;
  venueName:      string;
  status:         string;
  lowestPrice:    number;
  createdAt:      string;
}

export interface AdminEventDetailResponse extends AdminEventResponse {
  description: string | null;
  venueId:     string | null;
  durationMin: number;
  organizer:   string | null;
  artists:     string | null;
  priceTiers:  string | null;
  posterUrl:   string | null;
  backdropUrl: string | null;
  updatedAt:   string;
}

export interface AdminEventFilters {
  search?:  string;
  type?:    string;
  status?:  string;
}

export interface AdminEventPage {
  items:      AdminEventResponse[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface CreateEventPayload {
  title:           string;
  type:            string;
  description?:    string;
  venueId?:        string;
  eventDate?:      string;
  durationMin:     number;
  language?:       string;
  ageRestriction:  number;
  organizer?:      string;
  artists?:        string;
  posterUrl?:      string;
  backdropUrl?:    string;
  priceTiers?:     string;
  status?:         string;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

// ── Venues ────────────────────────────────────────────────────────────────────

export interface AdminVenueItem {
  id:       string;
  name:     string;
  cityName: string;
}
