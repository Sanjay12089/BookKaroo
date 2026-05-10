-- ============================================================
-- BookKaroo — Seed 01: Settings
-- Run after: 001_init.sql
-- ============================================================

INSERT INTO settings (key, value) VALUES
  ('company_name',              '"BookKaroo Pvt Ltd"'),
  ('company_legal_name',        '"BookKaroo Private Limited"'),
  ('company_gstin',             '"24XXXXX0000X1Z5"'),
  ('company_pan',               '"XXXXX0000X"'),
  ('company_state_code',        '"24"'),
  ('company_state_name',        '"Gujarat"'),
  ('company_address_line1',     '"701, Demo Tower, SG Highway"'),
  ('company_address_line2',     '"Bodakdev"'),
  ('company_city',              '"Ahmedabad"'),
  ('company_pincode',           '"380054"'),
  ('company_country',           '"India"'),
  ('company_phone',             '"+91 79 0000 0000"'),
  ('company_email',             '"support@bookkaroo.com"'),
  ('convenience_fee_per_ticket','59.00'),
  ('offer_processing_fee',      '15.00'),
  ('gst_rate',                  '0.18'),
  ('cgst_rate_intra',           '0.09'),
  ('sgst_rate_intra',           '0.09'),
  ('igst_rate_inter',           '0.18'),
  ('sac_code_convenience',      '"998554"'),
  ('sac_code_offer',            '"997159"'),
  ('sac_code_other',            '"999799"'),
  ('cancellation_window_hours', '2'),
  ('refund_processing_days',    '7'),
  ('payment_provider',          '"mock"'),
  ('support_email',             '"support@bookkaroo.com"'),
  ('support_url',               '"https://bookkaroo.com/help"'),
  ('max_seats_per_booking',     '10'),
  ('seat_lock_minutes',         '8'),
  ('lock_sweep_interval_sec',   '60')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
