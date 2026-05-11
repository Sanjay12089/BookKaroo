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

// ── Admin Venues CRUD ─────────────────────────────────────────────────────────

export interface AdminVenue {
  id:           string;
  name:         string;
  slug:         string;
  chain:        string | null;
  address:      string;
  cityId:       string;
  cityName:     string;
  cityState:    string;
  stateCode:    string | null;
  latitude:     number;
  longitude:    number;
  amenities:    string[];
  isActive:     boolean;
  contactPhone: string | null;
  contactEmail: string | null;
  screenCount:  number;
  createdAt:    string;
}

export interface LayoutCategory {
  name:  string;
  rows:  string[];
  price: number;
  color: string;
}

export interface ScreenLayout {
  rows:          number;
  cols:          number;
  categories:    LayoutCategory[];
  blockedSeats:  string[];
  aisleAfterCols: number[];
}

export interface ScreenDetail {
  id:         string;
  name:       string;
  totalSeats: number;
  isActive:   boolean;
  layout:     ScreenLayout | null;
}

export interface AdminVenueDetail extends AdminVenue {
  screens: ScreenDetail[];
}

export interface AdminVenuePage {
  items:      AdminVenue[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface AdminVenueFilters {
  search?: string;
  cityId?: string;
  chain?:  string;
}

export interface CreateVenuePayload {
  name:         string;
  chain?:       string;
  address:      string;
  cityId:       string;
  latitude?:    number;
  longitude?:   number;
  contactPhone?: string;
  contactEmail?: string;
  amenities:    string[];
  isActive:     boolean;
}

export type UpdateVenuePayload = Partial<CreateVenuePayload>;

export interface CreateScreenPayload {
  name:       string;
  layoutJson: string;
  isActive?:  boolean;
}

export type UpdateScreenPayload = Partial<CreateScreenPayload>;

// ── Admin Shows CRUD ──────────────────────────────────────────────────────────

export interface AdminShow {
  showId:           string;
  movieTitle:       string | null;
  moviePosterUrl:   string | null;
  eventTitle:       string | null;
  venueId:          string;
  venueName:        string;
  screenName:       string;
  cityName:         string;
  showDate:         string;
  showDateLabel:    string;
  showTimeLabel:    string;
  showDatetime:     string;
  format:           string | null;
  language:         string | null;
  status:           'Scheduled' | 'Cancelled' | 'Completed';
  totalSeats:       number;
  bookedSeats:      number;
  availableSeats:   number;
  occupancyPercent: number;
  revenueGenerated: number;
}

export interface AdminShowPage {
  items:      AdminShow[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface AdminShowFilters {
  movieId?:  string;
  venueId?:  string;
  screenId?: string;
  fromDate?: string;
  toDate?:   string;
  status?:   string;
}

export interface CreateShowPayload {
  screenId:       string;
  movieId?:       string;
  eventId?:       string;
  showDate:       string;
  showTime:       string;
  format:         string;
  language:       string;
  priceOverrides?: string;
}

export interface CancelShowResponse {
  showId:            string;
  cancelledBookings: number;
  message:           string;
}
