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

// ── Admin Bookings ─────────────────────────────────────────────────────────────

export interface AdminBooking {
  id:                 string;
  bookingRef:         string;
  status:             'Pending' | 'Confirmed' | 'Cancelled' | 'Refunded';
  amountPaid:         number;
  discount:           number;
  ticketQty:          number;
  convenienceFee:     number;
  cgst:               number;
  sgst:               number;
  igst:               number;
  offerProcessingFee: number;
  createdAt:          string;
  cancelledAt:        string | null;
  invoiceUrl:         string | null;
  qrUrl:              string | null;
  invoiceNumber:      string | null;
  userId:             string;
  userName:           string;
  userEmail:          string;
  userMobile:         string;
  movieTitle:         string | null;
  eventTitle:         string | null;
  posterUrl:          string | null;
  showDate:           string;
  showDateLabel:      string;
  showTimeLabel:      string;
  format:             string | null;
  language:           string | null;
  venueName:          string;
  screenName:         string;
  cityName:           string;
  seatsSummary:       string;
  paymentMethod:      string | null;
  providerPaymentId:  string | null;
  paymentStatus:      string;
  refundAmount:       number | null;
  refundId:           string | null;
}

export interface AdminBookingPage {
  items:      AdminBooking[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface AdminBookingFilters {
  search?:   string;
  status?:   string;
  movieId?:  string;
  cityId?:   string;
  fromDate?: string;
  toDate?:   string;
}

// ── Admin Users ────────────────────────────────────────────────────────────────

export interface AdminUser {
  id:            string;
  name:          string;
  email:         string;
  mobile:        string;
  gender:        string | null;
  dob:           string | null;
  cityName:      string | null;
  stateCode:     string | null;
  role:          'User' | 'Admin';
  isBlocked:     boolean;
  emailVerified: boolean;
  totalBookings: number;
  totalSpent:    number;
  createdAt:     string;
  profilePicUrl: string | null;
  preferences:   string | null;
}

export interface AdminUserBookingSummary {
  bookingRef: string;
  status:     string;
  amountPaid: number;
  createdAt:  string;
  ticketQty:  number;
  movieTitle: string | null;
  eventTitle: string | null;
  showDate:   string;
  showTime:   string;
  venueName:  string;
}

export interface AdminUserDetail extends AdminUser {
  recentBookings: AdminUserBookingSummary[];
}

export interface AdminUserPage {
  items:      AdminUser[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface AdminUserFilters {
  search?:    string;
  role?:      string;
  isBlocked?: boolean;
  cityId?:    string;
}
