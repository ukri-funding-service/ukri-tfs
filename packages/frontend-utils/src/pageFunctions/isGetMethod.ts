export function isGetMethod(request?: { method?: string }): boolean {
    return !!request && !!request.method && request.method.toLowerCase() === 'get';
}
