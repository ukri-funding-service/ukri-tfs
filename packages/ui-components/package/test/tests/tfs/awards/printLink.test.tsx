import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import { PrintLink, valueOrElseEmptyString } from '../../../../src';
describe('tfs/awards - printLink', () => {
    describe('valueOrElseEmptyString util function', () => {
        it('should return an empty string for undefined', () => {
            expect(valueOrElseEmptyString(undefined)).to.equal('');
        });

        it('should return value when defined', () => {
            expect(valueOrElseEmptyString('something')).to.equal('something');
        });
    });

    describe('component', () => {
        it('Should render PrintLink with text', () => {
            const component = render(<PrintLink preLinkText="You can " printText="print or save this page as PDF" />);
            const jsOnlyLink = component.container.querySelector('.js-only');
            expect(jsOnlyLink!.textContent).to.eql('You can print or save this page as PDF');
        });
    });
});
