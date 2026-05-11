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
