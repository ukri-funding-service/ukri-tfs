export function stripHtmlTags(html: string): string {
    const regex = /(<([^>]+)>)/gi;
    return html.replace(regex, ' ').replace(/\s+/g, ' ').trim();
}
