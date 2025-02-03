import { wordCountHtml } from '@ukri-tfs/validation';

export function getWordCount(
    html: string,
    wordCountAllowed: number | undefined,
): { wordCount: number; wordCountRemaining: number; isOverAllowedWordCount: boolean } {
    const wordCount = wordCountHtml(html);

    const wordCountRemaining = (wordCountAllowed ?? 999999) - wordCount;
    const isOverAllowedWordCount = wordCountRemaining < 0;

    return {
        wordCount,
        wordCountRemaining,
        isOverAllowedWordCount,
    };
}
