# vRx Management Portal

A micro-frontend security management platform built with Angular 20, Nx, and Module Federation.

## Project Structure

```
vrx-mf/
├── apps/
│   ├── shell/          # Host application (main entry point)
│   ├── dashboard/      # Dashboard micro-frontend
│   ├── assets/         # Asset management micro-frontend
│   ├── findings/       # Security findings micro-frontend
│   ├── users/          # User management micro-frontend
│   └── settings/       # Application settings micro-frontend
└── libs/
    └── ui-kit/         # Shared component library
```

## Development

1. Navigate to project folder:
   ```bash
   cd vrx-mf
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start development server:
   ```bash
   nx serve shell --devRemotes=dashboard,assets,findings,users,settings
   ```

4. Open browser to `http://localhost:4200`

## Development Commands

### Serve Applications

```bash
# Serve shell app with all remotes in development mode
nx serve shell --devRemotes=dashboard,assets,findings,users,settings

# Serve specific remote app standalone
nx serve dashboard
nx serve assets
nx serve findings
nx serve users
nx serve settings
```

#### Project Analysis

```bash
# View project dependency graph
nx graph

# View affected projects (useful for CI/CD)
nx graph --affected
```

## Code Generation

### Generate Angular Library

```bash
nx g @nx/angular:lib libs/{libName} --prefix=vrx
```

Example:
```bash
nx g @nx/angular:lib libs/shared-utils --prefix=vrx
```

#### Generate Remote Application

```bash
nx g @nx/angular:remote apps/{appname} --prefix=vrx --host=shell
```

Example:
```bash
nx g @nx/angular:remote apps/reports --prefix=vrx --host=shell
```