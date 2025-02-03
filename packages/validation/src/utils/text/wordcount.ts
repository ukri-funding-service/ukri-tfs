import { unsafeRemoveMarkup } from './removeMarkup';

export function wordCount(text: string): number {
    const trimmedText = text.trim().replace(/[—\s]+/g, ' ');
    return trimmedText === '' ? 0 : 1 + trimmedText.replace(/\S/g, '').length;
}

export function wordCountHtml(html: string): number {
    const text = unsafeRemoveMarkup(html);
    const trimmedText = text.replace(/[—\s]+/g, ' ').trim();
    return trimmedText === '' ? 0 : 1 + trimmedText.replace(/\S/g, '').length;
}

export function wordLimitExceeded(wordLimit: number, text: string): boolean {
    return wordCount(text) > wordLimit;
}

export function wordLimitExceededHtml(wordLimit: number, html: string): boolean {
    return wordCountHtml(html) > wordLimit;
}
