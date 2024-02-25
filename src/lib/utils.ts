import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalize(str: string): string {
    const lowerCaseStr = str.toLowerCase();
    const capitalizedStr =
        lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1);

    return capitalizedStr;
}

export function formatDuration(date: Date): string {
    const now = new Date();
    const diff = +now - +date;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if (diff < minute) {
        return "just now";
    } else if (diff < hour) {
        return `${Math.floor(diff / 1000 / 60)}m ago`;
    } else if (diff < day) {
        return `${Math.floor(diff / 1000 / 60 / 60)}h ago`;
    } else if (diff < week) {
        return `${Math.floor(diff / day)}d ago`;
    } else if (diff < month) {
        return `${Math.floor(diff / week)}w ago`;
    } else if (diff < year) {
        return `${Math.floor(diff / month)}mo ago`;
    } else {
        return `${Math.floor(diff / year)}y ago`;
    }
}
