import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TaskStorage {
    private readonly STORAGE_KEY = 'reminder-app-data';

    load<T>(key: string, defaultValue: T): T {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return defaultValue;
            return JSON.parse(stored, this.dateReviver) as T;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return defaultValue;
        }
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    save<T>(key: string, data: T): void {
        try {
            const serialized = JSON.stringify(data, this.dateReplacer);
            localStorage.setItem(key, serialized);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    private dateReplacer(key: string, value: unknown): unknown {
        if (value instanceof Date) {
            return { __type: 'Date', value: value.toISOString() };
        }
        return value;
    }

    private dateReviver(key: string, value: unknown): unknown {
        // Handle wrapped Date objects
        if (value && typeof value === 'object' && '__type' in value) {
            const obj = value as { __type: string; value: string };
            if (obj.__type === 'Date') {
                return new Date(obj.value);
            }
        }
        // Handle plain ISO date strings (legacy format)
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        return value;
    }
}
