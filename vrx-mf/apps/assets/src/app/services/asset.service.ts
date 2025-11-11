import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  assets = signal<Asset[]>([]);

  // Mock data
  private mockAssets: Asset[] = [
    {
      id: '1',
      name: 'Production Web Server',
      type: 'server',
      status: 'active',
      owner: 'DevOps Team',
      environment: 'production',
      lastScanned: '2025-11-10T08:30:00Z',
      vulnerabilityCount: 3,
      riskScore: 7.5,
      location: 'AWS us-east-1',
      ipAddress: '10.0.1.100',
      operatingSystem: 'Ubuntu 22.04',
      tags: ['web', 'nginx', 'production']
    },
    {
      id: '2',
      name: 'User Database',
      type: 'database',
      status: 'active',
      owner: 'Database Team',
      environment: 'production',
      lastScanned: '2025-11-09T14:20:00Z',
      vulnerabilityCount: 1,
      riskScore: 4.2,
      location: 'AWS us-west-2',
      ipAddress: '10.0.2.50',
      operatingSystem: 'MySQL 8.0',
      tags: ['database', 'mysql', 'users']
    },
    {
      id: '3',
      name: 'Payment Gateway',
      type: 'application',
      status: 'active',
      owner: 'Security Team',
      environment: 'production',
      lastScanned: '2025-11-10T10:15:00Z',
      vulnerabilityCount: 5,
      riskScore: 9.1,
      location: 'AWS eu-west-1',
      ipAddress: '10.0.3.25',
      operatingSystem: 'Node.js 18',
      tags: ['payment', 'stripe', 'critical']
    },
    {
      id: '4',
      name: 'Development API',
      type: 'application',
      status: 'active',
      owner: 'Development Team',
      environment: 'development',
      lastScanned: '2025-11-08T16:45:00Z',
      vulnerabilityCount: 8,
      riskScore: 5.3,
      location: 'Local Docker',
      ipAddress: '192.168.1.10',
      operatingSystem: 'Python 3.11',
      tags: ['api', 'development', 'flask']
    },
    {
      id: '5',
      name: 'Load Balancer',
      type: 'network',
      status: 'maintenance',
      owner: 'Infrastructure Team',
      environment: 'production',
      lastScanned: '2025-11-07T09:00:00Z',
      vulnerabilityCount: 0,
      riskScore: 2.1,
      location: 'AWS ALB',
      ipAddress: '52.1.2.3',
      operatingSystem: 'AWS ALB',
      tags: ['load-balancer', 'nginx', 'aws']
    },
    {
      id: '6',
      name: 'Analytics Database',
      type: 'database',
      status: 'inactive',
      owner: 'Analytics Team',
      environment: 'staging',
      lastScanned: '2025-11-05T12:30:00Z',
      vulnerabilityCount: 2,
      riskScore: 3.7,
      location: 'AWS us-central-1',
      ipAddress: '10.0.4.75',
      operatingSystem: 'PostgreSQL 14',
      tags: ['analytics', 'postgresql', 'staging']
    }
  ];

  private mockAssetDetails: { [key: string]: AssetDetails } = {
    '1': {
      ...this.mockAssets[0],
      vulnerabilities: [
        {
          id: 'v1',
          severity: 'high',
          description: 'Outdated OpenSSL package with known vulnerabilities',
          cve: 'CVE-2023-1234',
          discoveredAt: '2025-11-10T08:30:00Z',
          status: 'open'
        },
        {
          id: 'v2',
          severity: 'medium',
          description: 'Nginx configuration allows directory listing',
          discoveredAt: '2025-11-10T08:30:00Z',
          status: 'investigating'
        },
        {
          id: 'v3',
          severity: 'low',
          description: 'Missing security headers',
          discoveredAt: '2025-11-10T08:30:00Z',
          status: 'open'
        }
      ],
      metadata: {
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-11-10T08:30:00Z',
        version: '1.0.5',
        description: 'Primary web server handling user requests'
      }
    },
    '2': {
      ...this.mockAssets[1],
      vulnerabilities: [
        {
          id: 'v4',
          severity: 'medium',
          description: 'Database user with excessive privileges',
          discoveredAt: '2025-11-09T14:20:00Z',
          status: 'open'
        }
      ],
      metadata: {
        createdAt: '2025-02-01T09:00:00Z',
        updatedAt: '2025-11-09T14:20:00Z',
        version: '8.0.35',
        description: 'Primary user data storage'
      }
    },
    '3': {
      ...this.mockAssets[2],
      vulnerabilities: [
        {
          id: 'v5',
          severity: 'critical',
          description: 'SQL injection vulnerability in payment processing',
          cve: 'CVE-2023-5678',
          discoveredAt: '2025-11-10T10:15:00Z',
          status: 'investigating'
        },
        {
          id: 'v6',
          severity: 'high',
          description: 'Insufficient input validation on payment endpoints',
          discoveredAt: '2025-11-10T10:15:00Z',
          status: 'open'
        },
        {
          id: 'v7',
          severity: 'high',
          description: 'Weak encryption for stored payment data',
          discoveredAt: '2025-11-10T10:15:00Z',
          status: 'open'
        },
        {
          id: 'v8',
          severity: 'medium',
          description: 'Missing rate limiting on API endpoints',
          discoveredAt: '2025-11-10T10:15:00Z',
          status: 'open'
        },
        {
          id: 'v9',
          severity: 'low',
          description: 'Verbose error messages expose system information',
          discoveredAt: '2025-11-10T10:15:00Z',
          status: 'resolved'
        }
      ],
      metadata: {
        createdAt: '2025-03-10T14:00:00Z',
        updatedAt: '2025-11-10T10:15:00Z',
        version: '2.1.8',
        description: 'Critical payment processing system'
      }
    }
  };

  loadAssets(): Observable<Asset[]> {
    // Simulate API call with delay
    return of(this.mockAssets).pipe(delay(800));
  }

  getAssetById(id: string): Observable<AssetDetails> {
    const assetDetail = this.mockAssetDetails[id];
    if (!assetDetail) {
      return throwError(() => new Error(`Asset with id ${id} not found`));
    }
    // Simulate API call with delay
    return of(assetDetail).pipe(delay(600));
  }

  getStatistics(): AssetStatistics {
    const assets = this.assets();
    return {
      total: assets.length,
      active: assets.filter(a => a.status === 'active').length,
      inactive: assets.filter(a => a.status === 'inactive').length,
      maintenance: assets.filter(a => a.status === 'maintenance').length,
      highRisk: assets.filter(a => (a.riskScore || 0) > 7).length,
      criticalVulnerabilities: assets.reduce((count, asset) => {
        const details = this.mockAssetDetails[asset.id];
        if (details?.vulnerabilities) {
          return count + details.vulnerabilities.filter(v => v.severity === 'critical').length;
        }
        return count;
      }, 0)
    };
  }

  searchAssets(term: string): Asset[] {
    if (!term.trim()) {
      return this.assets();
    }

    const searchTerm = term.toLowerCase();
    return this.assets().filter(asset =>
      asset.name.toLowerCase().includes(searchTerm) ||
      asset.owner.toLowerCase().includes(searchTerm) ||
      asset.type.toLowerCase().includes(searchTerm) ||
      asset.environment.toLowerCase().includes(searchTerm) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  filterAssets(filters: {
    type?: string;
    status?: string;
    environment?: string;
    riskLevel?: string;
  }): Asset[] {
    let filtered = this.assets();

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(a => a.type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === filters.status);
    }

    if (filters.environment && filters.environment !== 'all') {
      filtered = filtered.filter(a => a.environment === filters.environment);
    }

    if (filters.riskLevel && filters.riskLevel !== 'all') {
      filtered = filtered.filter(a => {
        const riskScore = a.riskScore || 0;
        switch (filters.riskLevel) {
          case 'critical': return riskScore >= 9;
          case 'high': return riskScore >= 7 && riskScore < 9;
          case 'medium': return riskScore >= 4 && riskScore < 7;
          case 'low': return riskScore < 4;
          default: return true;
        }
      });
    }

    return filtered;
  }
}
