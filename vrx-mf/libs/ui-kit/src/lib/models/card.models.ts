export interface RiskStat {
  type: 'high' | 'med' | 'low';
  label: string;
  count: number;
}
