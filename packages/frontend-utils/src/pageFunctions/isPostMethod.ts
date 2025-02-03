export function isPostMethod(request?: { method?: string }): boolean {
    return !!request && !!request.method && request.method.toLowerCase() === 'post';
}
