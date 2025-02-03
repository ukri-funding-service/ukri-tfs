const { expect } = require('chai');
require('mocha');
const { format, insert } = require('../../../../../src/API/support/lib/common');

describe('packages/test-framework - API/support/lib/common', () => {
    describe('format', () => {
        it('should substitute graphql query vars', () => {
            const queryTemplate =
                'query applicationComponentQuestionset($applicationComponentId:ID!,$questionsetCode:String!) { applicationComponentQuestionset(applicationComponentId:$applicationComponentId,code:$questionsetCode) { {0} {1} }}';
            const result = format(queryTemplate, 'xxx', 'yyy');

            expect(result).to.equal(
                'query applicationComponentQuestionset($applicationComponentId:ID!,$questionsetCode:String!) { applicationComponentQuestionset(applicationComponentId:$applicationComponentId,code:$questionsetCode) { xxx yyy }}',
            );
        });

        it('should substitute graphql query vars when executed multiple times', () => {
            const queryTemplate =
                'query applicationComponentQuestionset($applicationComponentId:ID!,$questionsetCode:String!) { applicationComponentQuestionset(applicationComponentId:$applicationComponentId,code:$questionsetCode) { {0} {1} }}';
            let result = format(queryTemplate, 'aaa', 'bbb');
            result = format(queryTemplate, 'ccc', 'ddd');
            result = format(queryTemplate, 'xxx', 'yyy');

            expect(result).to.equal(
                'query applicationComponentQuestionset($applicationComponentId:ID!,$questionsetCode:String!) { applicationComponentQuestionset(applicationComponentId:$applicationComponentId,code:$questionsetCode) { xxx yyy }}',
            );
        });
    });

    describe('insert', () => {
        // These tests are written to assert the existing, rather odd, behavior of this
        // function, which is very counter-intuitive (if it inserts space,
        // why only a space in front of the inserted text?)
        it('should insert character at given location', () => {
            expect(insert('ac', 1, 'b')).to.equal('a bc');
        });

        it('should insert multicharacter text at given location', () => {
            expect(insert('ae', 1, 'bcd')).to.equal('a bcde');
        });

        it('should insert empty text at given location', () => {
            expect(insert('ab', 1, '')).to.equal('a b');
        });
    });
});
