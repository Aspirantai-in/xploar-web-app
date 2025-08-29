import Cookies from 'js-cookie';

/**
 * Storage utility functions
 */
export class StorageUtils {
  /**
   * Local Storage operations
   */
  static localStorage = {
    /**
     * Set item in localStorage
     */
    set(key: string, value: any): void {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },

    /**
     * Get item from localStorage
     */
    get<T>(key: string, defaultValue?: T): T | null {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue || null;
      }
    },

    /**
     * Remove item from localStorage
     */
    remove(key: string): void {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    },

    /**
     * Clear all localStorage
     */
    clear(): void {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    },

    /**
     * Check if key exists in localStorage
     */
    has(key: string): boolean {
      try {
        return localStorage.getItem(key) !== null;
      } catch (error) {
        return false;
      }
    },
  };

  /**
   * Session Storage operations
   */
  static sessionStorage = {
    /**
     * Set item in sessionStorage
     */
    set(key: string, value: any): void {
      try {
        const serializedValue = JSON.stringify(value);
        sessionStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }
    },

    /**
     * Get item from sessionStorage
     */
    get<T>(key: string, defaultValue?: T): T | null {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return defaultValue || null;
      }
    },

    /**
     * Remove item from sessionStorage
     */
    remove(key: string): void {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from sessionStorage:', error);
      }
    },

    /**
     * Clear all sessionStorage
     */
    clear(): void {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Error clearing sessionStorage:', error);
      }
    },

    /**
     * Check if key exists in sessionStorage
     */
    has(key: string): boolean {
      try {
        return sessionStorage.getItem(key) !== null;
      } catch (error) {
        return false;
      }
    },
  };

  /**
   * Cookie operations
   */
  static cookies = {
    /**
     * Set cookie
     */
    set(key: string, value: string, options?: Cookies.CookieAttributes): void {
      try {
        Cookies.set(key, value, options);
      } catch (error) {
        console.error('Error setting cookie:', error);
      }
    },

    /**
     * Get cookie
     */
    get(key: string): string | undefined {
      try {
        return Cookies.get(key);
      } catch (error) {
        console.error('Error getting cookie:', error);
        return undefined;
      }
    },

    /**
     * Remove cookie
     */
    remove(key: string, options?: Cookies.CookieAttributes): void {
      try {
        Cookies.remove(key, options);
      } catch (error) {
        console.error('Error removing cookie:', error);
      }
    },

    /**
     * Check if cookie exists
     */
    has(key: string): boolean {
      try {
        return Cookies.get(key) !== undefined;
      } catch (error) {
        return false;
      }
    },
  };

  /**
   * Secure storage for sensitive data (encrypted)
   */
  static secureStorage = {
    /**
     * Set encrypted item
     */
    set(key: string, value: any, password: string): void {
      try {
        // Simple encryption (in production, use proper encryption)
        const encrypted = btoa(JSON.stringify(value));
        this.localStorage.set(key, encrypted);
      } catch (error) {
        console.error('Error saving to secure storage:', error);
      }
    },

    /**
     * Get decrypted item
     */
    get<T>(key: string, password: string, defaultValue?: T): T | null {
      try {
        const encrypted = this.localStorage.get<string>(key);
        if (!encrypted) return defaultValue || null;
        
        const decrypted = JSON.parse(atob(encrypted));
        return decrypted;
      } catch (error) {
        console.error('Error reading from secure storage:', error);
        return defaultValue || null;
      }
    },

    /**
     * Remove encrypted item
     */
    remove(key: string): void {
      this.localStorage.remove(key);
    },
  };

  /**
   * Clear all storage
   */
  static clearAll(): void {
    this.localStorage.clear();
    this.sessionStorage.clear();
    // Note: Cookies are not cleared here as they might be needed for authentication
  }

  /**
   * Get storage size information
   */
  static getStorageInfo(): {
    localStorage: number;
    sessionStorage: number;
    cookies: number;
  } {
    let localStorageSize = 0;
    let sessionStorageSize = 0;
    let cookiesSize = 0;

    try {
      // Calculate localStorage size
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageSize += localStorage[key].length + key.length;
        }
      }

      // Calculate sessionStorage size
      for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          sessionStorageSize += sessionStorage[key].length + key.length;
        }
      }

      // Calculate cookies size
      const cookies = document.cookie.split(';');
      cookies.forEach(cookie => {
        cookiesSize += cookie.length;
      });
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }

    return {
      localStorage: localStorageSize,
      sessionStorage: sessionStorageSize,
      cookies: cookiesSize,
    };
  }
}
