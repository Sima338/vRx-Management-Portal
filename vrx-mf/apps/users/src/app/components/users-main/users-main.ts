import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageContainerComponent, TableComponent, ButtonComponent } from '@vrx-mf/ui-kit';
import { UserService, User, CreateUserRequest } from '../../services/user.service';

interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'avatar' | 'badge' | 'date' | 'actions';
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'vrx-users-main',
  imports: [CommonModule, PageContainerComponent, TableComponent, ButtonComponent, FormsModule],
  template: `
    <vrx-page-container title="Users" subtitle="Manage user accounts and permissions">
      <div class="users-content">
        
        <!-- Actions Bar -->
        <div class="actions-bar">
          <vrx-button 
            variant="primary" 
            (clicked)="showAddUserForm()">
            Add User
          </vrx-button>
        </div>

        <!-- Add User Form -->
        <div class="add-user-form" *ngIf="showForm()">
          <h3>Add New User</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="userName">Name</label>
              <input 
                type="text" 
                id="userName"
                class="form-input"
                [value]="newUser().name || ''"
                (input)="updateNewUser('name', $event)"
                placeholder="Enter user name">
            </div>
            <div class="form-group">
              <label for="userEmail">Email</label>
              <input 
                type="email" 
                id="userEmail"
                class="form-input"
                [value]="newUser().email || ''"
                (input)="updateNewUser('email', $event)"
                placeholder="Enter email">
            </div>
            <div class="form-group">
              <label for="userRole">Role</label>
              <select 
                id="userRole"
                class="form-select"
                [value]="newUser().role || ''"
                (change)="updateNewUser('role', $event)">
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <!-- Error Messages -->
            <div *ngIf="errors().length > 0" class="error-messages">
              <div *ngFor="let error of errors()" class="error-message">
                {{ error }}
              </div>
            </div>
            
            <vrx-button variant="secondary" (clicked)="cancelAdd()">Cancel</vrx-button>
            <vrx-button 
              variant="primary" 
              [loading]="loading()"
              (clicked)="addUser()">
              Add User
            </vrx-button>
          </div>
        </div>

        <!-- Users Table -->
        <vrx-table 
          [columns]="tableColumns"
          [data]="users()"
          [actions]="tableActions"
          [showSearch]="true"
          searchPlaceholder="Search"
          [searchColumns]="['name', 'email', 'role']"
          (actionClicked)="handleTableAction($event)">
        </vrx-table>

        <!-- Users Stats -->
        <div class="users-stats">
          <div class="stat-card">
            <div class="stat-number">{{ stats().total }}</div>
            <div class="stat-label">Total Users</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats().active }}</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats().admins }}</div>
            <div class="stat-label">Administrators</div>
          </div>
        </div>

      </div>
    </vrx-page-container>
  `,
  styles: [`
    .users-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Actions Bar */
    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .btn-primary {
      background: #007aff;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s ease;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #e5e5e7;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    .btn-icon {
      font-size: 16px;
      font-weight: bold;
    }

    .search-box {
      flex: 1;
      max-width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e5e5e7;
      border-radius: 8px;
      font-size: 14px;
      background: white;
    }

    .search-input:focus {
      outline: none;
      border-color: #007aff;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    /* Add User Form */
    .add-user-form {
      background: white;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #e5e5e7;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .add-user-form h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .form-input, .form-select {
      padding: 12px;
      border: 1px solid #e5e5e7;
      border-radius: 8px;
      font-size: 14px;
      background: white;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #007aff;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    .form-select {
      padding-left: 16px;
      padding-right: 40px;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 12px center;
      background-repeat: no-repeat;
      background-size: 16px 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* Error Messages */
    .error-messages {
      flex: 1 100%;
      margin-bottom: 12px;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 8px;
      border: 1px solid #fecaca;
    }

    .error-message:last-child {
      margin-bottom: 0;
    }

    /* Users Table */
    .users-table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e5e7;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th {
      background: #f8f9fa;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #e5e5e7;
      font-size: 14px;
    }

    .users-table td {
      padding: 16px;
      border-bottom: 1px solid #f5f5f7;
      vertical-align: middle;
      font-size: 14px;
    }

    .user-row:hover {
      background: #f8f9fa;
    }

    .user-name {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .user-email {
      color: #666;
    }

    .role-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .role-admin {
      background: #ffe2e5;
      color: #c53030;
    }

    .role-editor {
      background: #fff3cd;
      color: #b45309;
    }

    .role-viewer {
      background: #d1ecf1;
      color: #0c5460;
    }

    .last-login {
      color: #666;
      font-size: 13px;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon-small {
      padding: 6px 8px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s ease;
    }

    .btn-icon-small.edit {
      background: #f0f9ff;
    }

    .btn-icon-small.edit:hover {
      background: #e0f2fe;
    }

    .btn-icon-small.delete {
      background: #fef2f2;
    }

    .btn-icon-small.delete:hover {
      background: #fee2e2;
    }

    .no-users {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 40px;
    }

    /* Users Stats */
    .users-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #e5e5e7;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #007aff;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .actions-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: none;
      }

      .users-table-container {
        overflow-x: auto;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class UsersMainComponent implements OnInit {
  // Signals for reactive state management
  users = signal<User[]>([]);
  showForm = signal(false);
  newUser = signal<Partial<CreateUserRequest>>({});
  loading = signal(false);
  errors = signal<string[]>([]);

  // Computed values derived from signals
  stats = computed(() => {
    const userList = this.users();
    return {
      total: userList.length,
      active: userList.filter(user => user.lastLogin !== 'Never').length,
      admins: userList.filter(user => user.role === 'Admin').length
    };
  });

  // Effect to log changes (for debugging, can be removed in production)
  userChangeEffect = effect(() => {
    console.log('Users updated:', this.users().length);
  });

  // Inject dependencies using the modern inject function
  private userService = inject(UserService);

  // Helper method to update form fields
  updateNewUser(field: keyof CreateUserRequest, event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    this.newUser.update(user => ({
      ...user,
      [field]: target.value
    }));
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.loading.set(false);
      }
    });
  }

  tableColumns: TableColumn[] = [
    { 
      key: 'avatar', 
      label: '', 
      type: 'avatar',
      width: '60px' 
    },
    { 
      key: 'name', 
      label: 'Name', 
      type: 'text',
      sortable: true 
    },
    { 
      key: 'email', 
      label: 'Email', 
      type: 'text',
      sortable: true 
    },
    { 
      key: 'role', 
      label: 'Role', 
      type: 'badge',
      sortable: true 
    },
    { 
      key: 'lastLogin', 
      label: 'Last Login', 
      type: 'date',
      sortable: true 
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      type: 'actions',
      width: '120px' 
    }
  ];

  tableActions = [
    { action: 'edit', label: 'Edit', icon: '✏️' },
    { action: 'delete', label: 'Delete', icon: '🗑️', class: 'danger' }
  ];

  showAddUserForm() {
    this.showForm.set(true);
    this.newUser.set({});
    this.errors.set([]);
  }

  cancelAdd() {
    this.showForm.set(false);
    this.newUser.set({});
    this.errors.set([]);
  }

  addUser() {
    this.errors.set([]);
    
    const userData = this.newUser();
    if (!userData.name || !userData.email || !userData.role) {
      this.errors.set(['Please fill in all required fields']);
      return;
    }

    const userRequest: CreateUserRequest = {
      name: userData.name,
      email: userData.email,
      role: userData.role
    };

    // Validate user data
    const validationErrors = this.userService.validateUser(userRequest);
    if (validationErrors.length > 0) {
      this.errors.set(validationErrors);
      return;
    }

    this.loading.set(true);
    this.userService.createUser(userRequest).subscribe({
      next: (user) => {
        this.users.update(users => [...users, user]);
        this.cancelAdd();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to create user:', error);
        this.errors.set(['Failed to create user. Please try again.']);
        this.loading.set(false);
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.loading.set(true);
      this.userService.deleteUser(userId).subscribe({
        next: (success) => {
          if (success) {
            this.users.update(users => users.filter(user => user.id !== userId));
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
          this.loading.set(false);
        }
      });
    }
  }

  editUser(user: User) {
    confirm(`You do not have editing permissions for user ${user.name}.`);
  }

  // Utility methods that delegate to the service
  formatLastLogin = (lastLogin: string): string => this.userService.formatLastLogin(lastLogin);
  getRoleClass = (role: string): string => this.userService.getRoleClass(role);

  // Stats getters that use the computed stats
  getActiveUsers(): number {
    return this.stats().active;
  }

  getAdminCount(): number {
    return this.stats().admins;
  }

  handleTableAction(event: { action: string; item: unknown; index: number }) {
    const { action, item } = event;
    const user = item as User; // Type assertion since we know this is a User
    
    if (action === 'edit') {
      this.editUser(user);
    } else if (action === 'delete') {
      this.deleteUser(user.id);
    }
  }
}
