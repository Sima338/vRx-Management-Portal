import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PageContainerComponent, TableComponent, ButtonComponent, TableColumn, TableActionEvent } from '@vrx-mf/ui-kit';
import { UserService } from '../../services/user.service';
import { User, CreateUserRequest } from '../../models/user.models';

@Component({
  selector: 'vrx-users-main',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageContainerComponent,
    ButtonComponent,
    TableComponent
  ],
  templateUrl: './users-main.html',
  styleUrl: './users-main.scss'
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

  handleTableAction(event: TableActionEvent) {
    const { action, item } = event;
    const user = item as User; // Type assertion since we know this is a User
    
    if (action === 'edit') {
      this.editUser(user);
    } else if (action === 'delete') {
      this.deleteUser(user.id);
    }
  }
}
