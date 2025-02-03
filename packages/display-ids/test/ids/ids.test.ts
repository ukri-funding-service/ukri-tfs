import {
    applicationIdFromDisplayId,
    mapIdToDisplayId,
    opportunityIdFromDisplayId,
    reviewIdFromDisplayId,
} from '../../src/ids/index';

describe('application ids tests', () => {
    it('should throw error for display id with wrong prefix', () => {
        expect(() => applicationIdFromDisplayId('OPP123')).toThrow('Invalid resource ID OPP123');
    });

    ['APP', 'APP0', 'APP00', 'APP000'].forEach(displayId =>
        it('should throw error if the number of ${displayId} is less than 1', () => {
            expect(() => applicationIdFromDisplayId(displayId)).toThrow(`Invalid resource ID ${displayId}`);
        }),
    );

    ['APP9', 'APP09', 'APP009'].forEach(displayId =>
        it('should return the integer id for a valid display id with 1 digit', () => {
            expect(applicationIdFromDisplayId(displayId)).toEqual(9);
        }),
    );

    ['APP25', 'APP025'].forEach(displayId =>
        it('should return the integer id for a valid display id with 2 digits', () => {
            expect(applicationIdFromDisplayId(displayId)).toEqual(25);
        }),
    );

    it('should return the integer id for a valid display id with 3 digits', () => {
        expect(applicationIdFromDisplayId('APP123')).toEqual(123);
    });

    it('should return the integer id for a valid display id with more than 3 digits', () => {
        expect(applicationIdFromDisplayId('APP13371337')).toEqual(13371337);
    });
});

describe('opportunity ids tests', () => {
    it('should throw error for display id with wrong prefix', () => {
        expect(() => opportunityIdFromDisplayId('APP123')).toThrow('Invalid resource ID APP123');
    });

    ['OPP9', 'OPP09', 'OPP009'].forEach(displayId =>
        it('should return the integer id for a valid display id with 1 digit', () => {
            expect(opportunityIdFromDisplayId(displayId)).toEqual(9);
        }),
    );

    ['OPP25', 'OPP025'].forEach(displayId =>
        it('should return the integer id for a valid display id with 2 digits', () => {
            expect(opportunityIdFromDisplayId(displayId)).toEqual(25);
        }),
    );

    it('should return the integer id for a valid display id with 3 digits', () => {
        expect(opportunityIdFromDisplayId('OPP123')).toEqual(123);
    });

    it('should return the integer id for a valid display id with more than 3 digits', () => {
        expect(opportunityIdFromDisplayId('OPP13371337')).toEqual(13371337);
    });
});

describe('review ids tests', () => {
    it('should throw error for display id with wrong prefix', () => {
        expect(() => reviewIdFromDisplayId('APP123')).toThrow('Invalid resource ID APP123');
    });

    ['REV9', 'REV09', 'REV009'].forEach(displayId =>
        it('should return the integer id for a valid display id with 1 digit', () => {
            expect(reviewIdFromDisplayId(displayId)).toEqual(9);
        }),
    );

    ['REV25', 'REV025'].forEach(displayId =>
        it('should return the integer id for a valid display id with 2 digits', () => {
            expect(reviewIdFromDisplayId(displayId)).toEqual(25);
        }),
    );

    it('should return the integer id for a valid display id with 3 digits', () => {
        expect(reviewIdFromDisplayId('REV123')).toEqual(123);
    });

    it('should return the integer id for a valid display id with more than 3 digits', () => {
        expect(reviewIdFromDisplayId('REV13371337')).toEqual(13371337);
    });
});

describe('mapIdToDisplayId tests', () => {
    it('should add APP prefix to an id', () => {
        expect(mapIdToDisplayId('APP', 2)).toEqual('APP002');
    });
    it('should add APP prefix to an id of 12 and have a string length of 6', () => {
        expect(mapIdToDisplayId('APP', 12)).toEqual('APP012');
    });
    it('should add APP prefix to an id of 123', () => {
        expect(mapIdToDisplayId('APP', 123)).toEqual('APP123');
    });
    it('should add APP prefix to an id of 1234', () => {
        expect(mapIdToDisplayId('APP', 1234)).toEqual('APP1234');
    });
    it('should add OPP prefix to an id', () => {
        expect(mapIdToDisplayId('OPP', 2)).toEqual('OPP002');
    });
    it('should add REV prefix to an id', () => {
        expect(mapIdToDisplayId('REV', 2)).toEqual('REV002');
    });
    it('should add UKRI prefix to an id', () => {
        expect(mapIdToDisplayId('UKRI', 2)).toEqual('UKRI002');
    });
});
