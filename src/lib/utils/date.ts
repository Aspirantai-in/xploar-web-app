/**
 * Date utility functions
 */
export class DateUtils {
    /**
     * Format date to readable string
     */
    static formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (format === 'relative') {
            return this.getRelativeTime(dateObj);
        }

        if (format === 'long') {
            return dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }

        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    /**
     * Get relative time (e.g., "2 hours ago")
     */
    static getRelativeTime(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) {
            return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        }

        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    }

    /**
     * Check if date is today
     */
    static isToday(date: Date | string): boolean {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();

        return (
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear()
        );
    }

    /**
     * Check if date is tomorrow
     */
    static isTomorrow(date: Date | string): boolean {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        return (
            dateObj.getDate() === tomorrow.getDate() &&
            dateObj.getMonth() === tomorrow.getMonth() &&
            dateObj.getFullYear() === tomorrow.getFullYear()
        );
    }

    /**
     * Get start of week
     */
    static getStartOfWeek(date: Date = new Date()): Date {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    }

    /**
     * Get end of week
     */
    static getEndOfWeek(date: Date = new Date()): Date {
        const end = new Date(date);
        const day = end.getDay();
        const diff = end.getDate() - day + (day === 0 ? 0 : 7);
        end.setDate(diff);
        end.setHours(23, 59, 59, 999);
        return end;
    }

    /**
     * Add days to date
     */
    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * Subtract days from date
     */
    static subtractDays(date: Date, days: number): Date {
        return this.addDays(date, -days);
    }

    /**
     * Get days between two dates
     */
    static getDaysBetween(startDate: Date, endDate: Date): number {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    /**
     * Format time duration in minutes to readable string
     */
    static formatDuration(minutes: number): string {
        if (minutes < 60) {
            return `${minutes}m`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${remainingMinutes}m`;
    }
}
