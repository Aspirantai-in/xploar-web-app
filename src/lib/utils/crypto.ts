/**
 * Crypto utility functions
 * Note: These are basic implementations. For production, use proper crypto libraries.
 */
export class CryptoUtils {
  /**
   * Generate a random string
   */
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Generate a random number between min and max
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a UUID v4
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Simple hash function (not cryptographically secure)
   */
  static simpleHash(str: string): string {
    let hash = 0;
    
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Base64 encode
   */
  static base64Encode(str: string): string {
    if (typeof window !== 'undefined' && window.btoa) {
      return window.btoa(str);
    }
    
    // Fallback for Node.js
    return Buffer.from(str).toString('base64');
  }

  /**
   * Base64 decode
   */
  static base64Decode(str: string): string {
    if (typeof window !== 'undefined' && window.atob) {
      return window.atob(str);
    }
    
    // Fallback for Node.js
    return Buffer.from(str, 'base64').toString();
  }

  /**
   * URL-safe base64 encode
   */
  static base64UrlEncode(str: string): string {
    return this.base64Encode(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * URL-safe base64 decode
   */
  static base64UrlDecode(str: string): string {
    // Add padding if needed
    while (str.length % 4) {
      str += '=';
    }
    
    return this.base64Decode(str
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    );
  }

  /**
   * Simple encryption (not cryptographically secure)
   */
  static encrypt(text: string, key: string): string {
    const encoded = this.base64Encode(text);
    let result = '';
    
    for (let i = 0; i < encoded.length; i++) {
      const charCode = encoded.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    
    return this.base64Encode(result);
  }

  /**
   * Simple decryption (not cryptographically secure)
   */
  static decrypt(encryptedText: string, key: string): string {
    try {
      const decoded = this.base64Decode(encryptedText);
      let result = '';
      
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode ^ keyChar);
      }
      
      return this.base64Decode(result);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  /**
   * Generate a secure password hash (basic implementation)
   */
  static hashPassword(password: string, salt?: string): string {
    const saltToUse = salt || this.generateRandomString(16);
    const combined = password + saltToUse;
    const hash = this.simpleHash(combined);
    
    return `${saltToUse}:${hash}`;
  }

  /**
   * Verify password hash
   */
  static verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const computedHash = this.hashPassword(password, salt);
    const [_, computedHashValue] = computedHash.split(':');
    
    return hash === computedHashValue;
  }

  /**
   * Generate a token
   */
  static generateToken(length: number = 64): string {
    return this.generateRandomString(length);
  }

  /**
   * Generate a numeric code
   */
  static generateNumericCode(length: number = 6): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  /**
   * Check if string is valid base64
   */
  static isValidBase64(str: string): boolean {
    try {
      this.base64Decode(str);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize input for security
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }
}
