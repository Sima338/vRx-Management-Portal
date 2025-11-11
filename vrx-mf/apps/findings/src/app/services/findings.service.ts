import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class FindingsService {
  // Signals for reactive state management
  findings = signal<Finding[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private mockFindings: Finding[] = [
    {
      id: 'f1',
      assetId: '1',
      severity: 'critical',
      title: 'Apache RCE Vulnerability',
      status: 'open',
      description: 'Remote code execution vulnerability in Apache HTTP Server',
      createdAt: '2024-11-10T10:30:00Z'
    },
    {
      id: 'f2',
      assetId: '2',
      severity: 'high',
      title: 'SQL Injection in Login Form',
      status: 'investigating',
      description: 'Potential SQL injection vulnerability in user authentication',
      createdAt: '2024-11-09T14:15:00Z'
    },
    {
      id: 'f3',
      assetId: '1',
      severity: 'medium',
      title: 'Outdated SSL Certificate',
      status: 'resolved',
      description: 'SSL certificate is approaching expiration date',
      createdAt: '2024-11-08T09:20:00Z',
      resolvedAt: '2024-11-09T16:45:00Z'
    },
    {
      id: 'f4',
      assetId: '3',
      severity: 'low',
      title: 'Missing Security Headers',
      status: 'open',
      description: 'HTTP security headers are not properly configured',
      createdAt: '2024-11-07T11:00:00Z'
    },
    {
      id: 'f5',
      assetId: '2',
      severity: 'critical',
      title: 'Unpatched OS Vulnerability',
      status: 'open',
      description: 'Critical security patch missing from operating system',
      createdAt: '2024-11-06T13:30:00Z'
    },
    {
      id: 'f6',
      assetId: '4',
      severity: 'high',
      title: 'Weak Password Policy',
      status: 'resolved',
      description: 'Password policy does not meet security requirements',
      createdAt: '2024-11-05T15:45:00Z',
      resolvedAt: '2024-11-08T10:20:00Z'
    }
  ];

  loadFindings(): Observable<Finding[]> {
    this.loading.set(true);
    this.error.set(null);

    // Simulate API call with delay
    return of(this.mockFindings).pipe(
      delay(800)
    );
  }

  updateFindingStatus(findingId: string, status: Finding['status']): Observable<Finding> {
    this.loading.set(true);
    this.error.set(null);

    // Simulate PATCH /findings/:id API call
    const findingIndex = this.mockFindings.findIndex(f => f.id === findingId);
    
    if (findingIndex === -1) {
      throw new Error(`Finding with id ${findingId} not found`);
    }

    const updatedFinding = {
      ...this.mockFindings[findingIndex],
      status,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined
    };

    this.mockFindings[findingIndex] = updatedFinding;

    // Update the signal
    const currentFindings = this.findings();
    const updatedFindings = currentFindings.map(f => 
      f.id === findingId ? updatedFinding : f
    );
    this.findings.set(updatedFindings);

    return of(updatedFinding).pipe(delay(500));
  }

  getStatistics(): FindingsStats {
    const findings = this.findings();
    
    return {
      total: findings.length,
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length,
      open: findings.filter(f => f.status === 'open').length,
      resolved: findings.filter(f => f.status === 'resolved').length
    };
  }

  filterBySeverity(severity: Finding['severity'] | 'all'): Finding[] {
    const findings = this.findings();
    return severity === 'all' 
      ? findings 
      : findings.filter(f => f.severity === severity);
  }

  filterByStatus(status: Finding['status'] | 'all'): Finding[] {
    const findings = this.findings();
    return status === 'all' 
      ? findings 
      : findings.filter(f => f.status === status);
  }
}
