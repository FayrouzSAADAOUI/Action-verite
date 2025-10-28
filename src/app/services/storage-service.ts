import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Store a value in Capacitor Preferences
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   */
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await Preferences.set({ key, value: jsonValue });
    } catch (error) {
      console.error(`Error storing data for key "${key}":`, error);
      throw new Error(`Failed to store data: ${error}`);
    }
  }

  /**
   * Retrieve a value from Capacitor Preferences
   * @param key - Storage key
   * @returns Parsed value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error retrieving data for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove a specific key from storage
   * @param key - Storage key to remove
   */
  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`Error removing key "${key}":`, error);
      throw new Error(`Failed to remove data: ${error}`);
    }
  }

  /**
   * Clear all stored data
   */
  async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error(`Failed to clear storage: ${error}`);
    }
  }

  /**
   * Get all keys stored in Preferences
   * @returns Array of all storage keys
   */
  async keys(): Promise<string[]> {
    try {
      const { keys } = await Preferences.keys();
      return keys;
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }
}
