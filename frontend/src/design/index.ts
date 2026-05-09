export { DESIGN_TOKENS } from './tokens';
export type { DesignTokens } from './tokens';

export { Logo, LogoIcon, TAGLINE } from './Logo';
export type { LogoProps } from './Logo';

export {
  GOOGLE_FONTS_URL,
  globalCSS,
  Button,
  Card,
  GlassCard,
  Badge,
  Chip,
  Skeleton,
  Input,
  Modal,
  BottomSheet,
  StarRating,
  CountdownRing,
  SectionHeader,
  Toast,
  ToastContainer,
} from './DesignSystem';

export type {
  ButtonProps,
  CardProps,
  BadgeProps,
  ChipProps,
  SkeletonProps,
  InputProps,
  ModalProps,
  BottomSheetProps,
  StarRatingProps,
  CountdownRingProps,
  SectionHeaderProps,
  ToastProps,
  ToastContainerProps,
  ToastItem,
} from './DesignSystem';

// ─── Screens ──────────────────────────────────────────────────────────────────

export { default as Home } from './screens/Home';
export { default as MoviesList } from './screens/MoviesList';
export { default as MovieDetail } from './screens/MovieDetail';
export { default as Showtimes } from './screens/Showtimes';
export { default as SeatSelection } from './screens/SeatSelection';

export * from './screens/mockData';
