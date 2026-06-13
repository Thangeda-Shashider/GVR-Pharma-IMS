// GVR Pharma IMS — Color Constants
// All colors follow the pharmaceutical brand identity

const COLORS = {
  // Brand Colors
  primary:     '#1565C0',  // Deep pharmaceutical blue — primary actions, headers
  secondary:   '#0D47A1',  // Darker blue — secondary elements
  accent:      '#42A5F5',  // Light blue highlight — links, chips

  // Status Colors
  success:     '#2E7D32',  // Green — sufficient stock (≥ 20 units)
  warning:     '#F57F17',  // Amber — low stock (1–19 units)
  danger:      '#C62828',  // Red — out of stock or expiring soon

  // Expiring Soon (slightly softer than danger)
  expiring:    '#E65100',  // Deep orange — expiring within 90 days

  // Backgrounds
  background:  '#F5F7FA',  // App background
  surface:     '#FFFFFF',  // Card / modal surfaces

  // Text
  textPrimary: '#1A1A2E',  // Primary text
  textMuted:   '#6B7280',  // Subtitles, placeholders

  // Stat Card backgrounds (semi-transparent tints)
  statBlue:    '#1565C0',
  statAmber:   '#F57F17',
  statOrange:  '#E65100',
  statRed:     '#C62828',

  // Utility
  white:       '#FFFFFF',
  black:       '#000000',
  border:      '#E2E8F0',
  overlay:     'rgba(0,0,0,0.5)',

  // Badge
  badge:       '#C62828',
};

export default COLORS;
