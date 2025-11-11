export interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  cve?: string;
  discoveredAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
}

export interface Asset {
  id: string;
  name: string;
  type: 'server' | 'application' | 'database' | 'network' | 'cloud';
  status: 'active' | 'inactive' | 'maintenance';
  owner: string;
  environment: 'production' | 'staging' | 'development';
  lastScanned?: string;
  vulnerabilityCount?: number;
  riskScore?: number;
  location?: string;
  ipAddress?: string;
  operatingSystem?: string;
  tags?: string[];
}

export interface AssetDetails extends Asset {
  vulnerabilities: Vulnerability[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
    version?: string;
    description?: string;
  };
}

export interface AssetStatistics {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  highRisk: number;
  criticalVulnerabilities: number;
}
