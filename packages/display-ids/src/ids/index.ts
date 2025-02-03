import { resourceNotFoundException } from '@ukri-tfs/exceptions';

const APP_DISPLAY_ID_REGEX = /^APP\d{1,}$/i;
const OPP_DISPLAY_ID_REGEX = /^OPP\d{1,}$/i;
const REV_DISPLAY_ID_REGEX = /^REV\d{1,}$/i;

const idFromDisplayId = (prefix: string, regex: RegExp, displayId?: string): number => {
    if (!displayId || !displayId.match(regex)) {
        return resourceNotFoundException(`Invalid resource ID ${displayId}`);
    }

    const id = Number(displayId.toUpperCase().split(prefix)[1]);

    if (id > 0) {
        return id;
    }
    return resourceNotFoundException(`Invalid resource ID ${displayId}`);
};

export const applicationIdFromDisplayId = (displayId?: string): number => {
    return idFromDisplayId('APP', APP_DISPLAY_ID_REGEX, displayId);
};

export const opportunityIdFromDisplayId = (displayId?: string): number => {
    return idFromDisplayId('OPP', OPP_DISPLAY_ID_REGEX, displayId);
};

export const reviewIdFromDisplayId = (displayId?: string): number => {
    return idFromDisplayId('REV', REV_DISPLAY_ID_REGEX, displayId);
};

export function mapIdToDisplayId(prefix: 'APP' | 'OPP' | 'REV' | 'PAN' | 'UKRI', id: number): string {
    return prefix + `${id}`.padStart(3, '0');
}
