import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  remotes: ['dashboard', 'assets', 'findings', 'users', 'settings'],
  shared: (libraryName: string, defaultConfig: { singleton?: boolean; strictVersion?: boolean; requiredVersion?: string | false }) => {
    // Core Angular packages - should be singleton and strict version
    if (libraryName === '@angular/core' || 
        libraryName === '@angular/common' || 
        libraryName === '@angular/router' || 
        libraryName === '@angular/platform-browser' ||
        libraryName === '@angular/platform-browser-dynamic' ||
        libraryName === '@angular/forms' ||
        libraryName === 'rxjs') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      };
    }
    
    // Our ui-kit library - should be shared but more flexible versioning
    if (libraryName === '@vrx-mf/ui-kit') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: false,
        requiredVersion: false
      };
    }
    
    // Zone.js - Angular dependency
    if (libraryName === 'zone.js') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      };
    }
    
    return defaultConfig;
  }
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
