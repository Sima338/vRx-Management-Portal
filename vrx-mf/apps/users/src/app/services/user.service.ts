import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface User {
  id: string;
  name: string;
  role: string;
  lastLogin: string;
  email?: string;
  status?: string;
  avatar?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 'u1',
      name: 'Alice Johnson',
      email: 'alice@vrx.com',
      role: 'Admin',
      lastLogin: '2025-10-27T10:00:00Z',
      status: 'active',
      avatar: 'AJ'
    },
    {
      id: 'u2',
      name: 'Bob Smith',
      email: 'bob@vrx.com',
      role: 'Editor',
      lastLogin: '2025-10-26T15:30:00Z',
      status: 'active',
      avatar: 'BS'
    },
    {
      id: 'u3',
      name: 'Carol Davis',
      email: 'carol@vrx.com',
      role: 'Viewer',
      lastLogin: '2025-10-25T09:15:00Z',
      status: 'active',
      avatar: 'CD'
    },
    {
      id: 'u4',
      name: 'David Wilson',
      email: 'david@vrx.com',
      role: 'Editor',
      lastLogin: '2025-10-28T11:45:00Z',
      status: 'inactive',
      avatar: 'DW'
    }
  ];

  /**
   * Get all users
   * In a real application, this would make an HTTP call to the API
   */
  getUsers(): Observable<User[]> {
    // Simulate API call with delay
    return of([...this.users]).pipe(delay(300));
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User | null> {
    const user = this.users.find(u => u.id === id);
    return of(user || null).pipe(delay(100));
  }

  /**
   * Create a new user
   */
  createUser(userData: CreateUserRequest): Observable<User> {
    const newUser: User = {
      id: 'u' + (this.users.length + 1),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      lastLogin: 'Never',
      status: 'active',
      avatar: this.generateAvatar(userData.name)
    };
    
    this.users.push(newUser);
    
    // Simulate API call with delay
    return of(newUser).pipe(delay(500));
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, userData: Partial<User>): Observable<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return of(null).pipe(delay(100));
    }
    
    this.users[index] = { ...this.users[index], ...userData };
    
    // Simulate API call with delay
    return of(this.users[index]).pipe(delay(500));
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): Observable<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return of(false).pipe(delay(100));
    }
    
    this.users.splice(index, 1);
    
    // Simulate API call with delay
    return of(true).pipe(delay(300));
  }

  /**
   * Get user statistics
   */
  getUserStats(): Observable<{ total: number; active: number; admins: number }> {
    const stats = {
      total: this.users.length,
      active: this.users.filter(user => user.lastLogin !== 'Never').length,
      admins: this.users.filter(user => user.role === 'Admin').length
    };
    
    return of(stats).pipe(delay(100));
  }

  /**
   * Format last login date
   */
  formatLastLogin(lastLogin: string): string {
    if (lastLogin === 'Never') return 'Never';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Get role-based CSS class
   */
  getRoleClass(role: string): string {
    return 'role-' + role.toLowerCase();
  }

  /**
   * Generate avatar initials from name
   */
  private generateAvatar(name: string): string {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  /**
   * Validate user data
   */
  validateUser(userData: CreateUserRequest): string[] {
    const errors: string[] = [];
    
    if (!userData.name?.trim()) {
      errors.push('Name is required');
    }
    
    if (!userData.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('Email format is invalid');
    } else if (this.isEmailTaken(userData.email)) {
      errors.push('Email is already taken');
    }
    
    if (!userData.role?.trim()) {
      errors.push('Role is required');
    } else if (!['Admin', 'Editor', 'Viewer'].includes(userData.role)) {
      errors.push('Invalid role selected');
    }
    
    return errors;
  }

  /**
   * Check if email format is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if email is already taken
   */
  private isEmailTaken(email: string): boolean {
    return this.users.some(user => user.email?.toLowerCase() === email.toLowerCase());
  }
}
