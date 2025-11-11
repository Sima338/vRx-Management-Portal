export interface Finding {
  id: string;
  assetId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  status: 'open' | 'resolved' | 'investigating' | 'false_positive';
  description?: string;
  createdAt?: string;
  resolvedAt?: string;
}

export interface FindingsStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  open: number;
  resolved: number;
}
