/** @deprecated this assumes an ID structure which is the responsibility of the
 *  Opportunity domain and may be subject to change.  Use the real opportunity
 *  id to refer to domain entities, the displayID is for human convenience only.
 */
export function parseOpp(str: string): number {
    return Number(str.replace('OPP', ''));
}
