// ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

import { Directive } from './directive';

// The mode the generators should work in. In PRODUCTION mode, unsafe directives are
// removed
export type SecurityMode = 'DEVELOPMENT' | 'PRODUCTION';

export function getContentSecurityPolicyHeader(directives: Directive[]): string {
    return directives.map(directive => directive.serialize()).join('; ');
}
