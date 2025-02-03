import { expect } from 'chai';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { Colour, Tag } from '../../../src';

describe('<Tag /> component tests', () => {
    let component: RenderResult;
    afterEach(() => {
        component.unmount();
    });

    it('should have test id', () => {
        component = render(<Tag testId="test">Text</Tag>);
        expect(() => component.getByTestId('test'), 'Test Id colour failed').to.not.throw();
    });

    it('should render text in component', () => {
        component = render(<Tag testId="test">Text</Tag>);
        expect(component.getByTestId('test').textContent).to.contain('Text');
    });

    it('should default to solid tag', () => {
        component = render(<Tag>Text</Tag>);
        expect(component.container.querySelector('.govuk-tag')).to.not.be.null;
    });

    describe('Colour Tints', function () {
        const checks: { colour: Colour; expected: string }[] = [
            { colour: 'SOLID', expected: 'govuk-tag' },
            { colour: 'GREY', expected: 'govuk-tag govuk-tag--grey' },
            { colour: 'GREEN', expected: 'govuk-tag govuk-tag--green' },
            { colour: 'TURQUOISE', expected: 'govuk-tag govuk-tag--turquoise' },
            { colour: 'BLUE', expected: 'govuk-tag govuk-tag--blue' },
            { colour: 'LIGHT-BLUE', expected: 'govuk-tag govuk-tag--light-blue' },
            { colour: 'PURPLE', expected: 'govuk-tag govuk-tag--purple' },
            { colour: 'PINK', expected: 'govuk-tag govuk-tag--pink' },
            { colour: 'RED', expected: 'govuk-tag govuk-tag--red' },
            { colour: 'ORANGE', expected: 'govuk-tag govuk-tag--orange' },
            { colour: 'YELLOW', expected: 'govuk-tag govuk-tag--yellow' },
        ];

        checks.forEach(({ colour, expected }) => {
            it(`should correctly show ${colour} tint`, () => {
                component = render(
                    <Tag testId="test" tint={colour}>
                        Text
                    </Tag>,
                );
                expect(component.getByTestId('test').className).to.be.equal(expected);
            });
        });
    });

    describe('Background Colour', function () {
        const checks: { colour: Colour; baseClass: string; solidClass: string }[] = [
            {
                colour: 'GREEN',
                baseClass: 'govuk-tag govuk-tag--green',
                solidClass: 'govuk-tag govuk-tag--solid-green',
            },
            {
                colour: 'TURQUOISE',
                baseClass: 'govuk-tag govuk-tag--turquoise',
                solidClass: 'govuk-tag govuk-tag--solid-turquoise',
            },
            {
                colour: 'BLUE',
                baseClass: 'govuk-tag govuk-tag--blue',
                solidClass: 'govuk-tag govuk-tag--solid-blue',
            },
            {
                colour: 'PURPLE',
                baseClass: 'govuk-tag govuk-tag--purple',
                solidClass: 'govuk-tag govuk-tag--solid-purple',
            },
            {
                colour: 'PINK',
                baseClass: 'govuk-tag govuk-tag--pink',
                solidClass: 'govuk-tag govuk-tag--solid-pink',
            },
            {
                colour: 'RED',
                baseClass: 'govuk-tag govuk-tag--red',
                solidClass: 'govuk-tag govuk-tag--solid-red',
            },
            {
                colour: 'ORANGE',
                baseClass: 'govuk-tag govuk-tag--orange',
                solidClass: 'govuk-tag govuk-tag--solid-orange',
            },
            {
                colour: 'YELLOW',
                baseClass: 'govuk-tag govuk-tag--yellow',
                solidClass: 'govuk-tag govuk-tag--solid-yellow',
            },
        ];

        checks.forEach(({ colour, solidClass }) => {
            it(`should correctly show solid ${colour} background`, () => {
                component = render(
                    <Tag testId="test" backgroundColor={colour}>
                        Text
                    </Tag>,
                );
                expect(component.getByTestId('test').className).to.be.equal(solidClass);
            });
        });

        checks.forEach(({ colour, baseClass }) => {
            it(`should correctly show base ${colour} background`, () => {
                component = render(
                    <Tag testId="test" backgroundColor={colour} useSolidBackgroundColor={false}>
                        Text
                    </Tag>,
                );
                expect(component.getByTestId('test').className).to.be.equal(baseClass);
            });
        });
    });
});
