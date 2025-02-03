import { fireEvent, render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Accordion, AccordionProps } from '../../../src/';

describe('<Accordion /> component tests', () => {
    let component: RenderResult;
    let props: AccordionProps;

    beforeEach(function () {
        props = {
            sections: [
                {
                    testId: 'component-1',
                    children: <div>This is some content 1</div>,
                    heading: 'Heading',
                    sectionKey: 'sectionKey',
                },
                {
                    testId: 'component-2',
                    children: <div>This is some content 2</div>,
                    heading: 'Heading 2',
                    sectionKey: 'sectionKey',
                },
            ],
        };
    });

    afterEach(() => {
        component.unmount();
    });

    it('should render text in component', () => {
        component = render(<Accordion {...props} />);
        expect(() => component.getByTestId('accordion-section-component-1')).not.to.throw();
        expect(() => component.getByTestId('accordion-section-component-2')).not.to.throw();
        const section1 = component.getByTestId('accordion-section-component-1');
        const section2 = component.getByTestId('accordion-section-component-2');
        expect(section1.querySelector('.govuk-accordion__section-heading button')!.textContent).to.include('Heading');
        expect(section2.querySelector('.govuk-accordion__section-heading button')!.textContent).to.include('Heading 2');
        expect(() => component.getByTestId('accordion-content-component-1')).not.to.throw();
        expect(() => component.getByTestId('accordion-content-component-2')).not.to.throw();
        const content1 = component.getByTestId('accordion-content-component-1');
        const content2 = component.getByTestId('accordion-content-component-2');
        expect(content1.textContent).to.equal('This is some content 1');
        expect(content2.textContent).to.equal('This is some content 2');
        expect(content1.querySelectorAll('.govuk-details').length).to.equal(0);
        expect(content2.querySelectorAll('.govuk-details').length).to.equal(0);
    });

    it('should render text in component without main child', () => {
        props.children = <div></div>;
        component = render(<Accordion {...props} />);
        const content1 = component.getByTestId('accordion-content-component-1');
        const content2 = component.getByTestId('accordion-content-component-2');
        expect(content1.textContent).to.equal('This is some content 1');
        expect(content2.textContent).to.equal('This is some content 2');
    });

    it('should have defaultExpanded sections when required', () => {
        props.sections[0].defaultExpanded = true;
        props.jsEnabled = true;
        component = render(<Accordion {...props} />);
        expect(component.getByTestId('accordion-section-component-1').className).to.contain(
            'govuk-accordion__section--expanded',
        );
        expect(component.getByTestId('accordion-section-component-2').className).to.not.contain(
            'govuk-accordion__section--expanded',
        );
    });

    it('should render text in component when only one section exists', () => {
        props.sections.pop();
        component = render(<Accordion {...props} />);
        expect(() => component.getByTestId('accordion-section-component-1')).not.to.throw();
        expect(() => component.getByTestId('accordion-section-component-2')).to.throw();
        const section1 = component.getByTestId('accordion-section-component-1');
        expect(section1.querySelector('.govuk-accordion__section-heading button')!.textContent).to.include('Heading');
        expect(() => component.getByTestId('accordion-content-component-1')).not.to.throw();
        const content1 = component.getByTestId('accordion-content-component-1');
        expect(content1.textContent).to.equal('This is some content 1');
        expect(content1.querySelectorAll('.govuk-details').length).to.equal(0);
    });

    describe('toggling accordions', function () {
        let innerProps: AccordionProps;
        let sectionOneButton: Element;

        beforeEach(function () {
            innerProps = {
                sections: [
                    {
                        testId: 'component-1',
                        children: <div>This is some content 1</div>,
                        heading: 'Heading',
                        headingLevel: 'h3',
                        sectionKey: 'sectionKey',
                    },
                ],
                jsEnabled: true,
            };
            component = render(<Accordion {...innerProps} />);
            expect(() => component.getByTestId(`accordion-section-component-1`)).not.to.throw();

            sectionOneButton = component
                .getByTestId(`accordion-section-component-1`)!
                .querySelector('.govuk-accordion__section-header')!;
        });

        it('should open and close individual sections', function () {
            fireEvent.click(sectionOneButton);
            expect(sectionOneButton!.textContent).to.includes('Hide');
            expect(component.getByTestId('accordion-section-component-1').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            // expect(component.getByTestId('accordion-section-component-1').style.contentVisibility).to.be.undefined;

            fireEvent.click(sectionOneButton);
            expect(sectionOneButton!.textContent).to.includes('Show');
            expect(component.getByTestId('accordion-section-component-1').className).not.to.contain(
                'govuk-accordion__section--expanded',
            );
            // expect(component.getByTestId('accordion-section-component-1').style.contentVisibility).to.equal('hidden');
        });
    });

    describe('optional styling', () => {
        it('should adjust header level as specified', () => {
            const headingLevel = 'h3';

            const componentProps: AccordionProps = {
                sections: [
                    {
                        testId: 'component-1',
                        children: <div>This is some content 1</div>,
                        heading: 'Heading',
                        headingLevel,
                        sectionKey: 'sectionKey',
                    },
                ],
            };

            const accordion = render(<Accordion {...componentProps} />);

            const headingText = accordion.getByRole('heading', {
                level: 3,
                name: /Heading*/,
            });

            expect(headingText).not.to.be.undefined;
        });

        it('should adjust header size as specified', () => {
            const headingSize = 'l';

            const componentProps: AccordionProps = {
                sections: [
                    {
                        testId: 'component-1',
                        children: <div>This is some content 1</div>,
                        heading: 'Heading',
                        headingSize,
                        sectionKey: 'sectionKey',
                    },
                ],
            };

            const accordion = render(<Accordion {...componentProps} />);

            const headingText = accordion.getByRole('heading', {
                level: 3,
                name: /Heading*/,
            });

            expect(headingText.className).to.contain(`govuk-heading-${headingSize}`);
        });
    });

    describe('Javascript enabled behaviour', () => {
        it('should use defaultExpanded if Javascript is enabled', () => {
            const jsEnabled = true;
            const defaultExpanded = false;

            const componentProps: AccordionProps = {
                sections: [
                    {
                        testId: 'component-1',
                        children: <div>This is some content 1</div>,
                        heading: 'Heading',
                        sectionKey: 'sectionKey',
                        defaultExpanded,
                    },
                ],
                jsEnabled,
            };

            const accordion = render(<Accordion {...componentProps} />);

            const accordionSection = accordion.getByTestId('accordion-section-component-1');

            expect(accordionSection.className).not.to.contain('govuk-accordion__section--expanded');
        });

        it('should ignore defaultExpanded if Javascript is not enabled, and expand component', () => {
            const jsEnabled = false;
            const defaultExpanded = false;

            const componentProps: AccordionProps = {
                sections: [
                    {
                        testId: 'component-1',
                        children: <div>This is some content 1</div>,
                        heading: 'Heading',
                        sectionKey: 'sectionKey',
                        defaultExpanded,
                    },
                ],
                jsEnabled,
            };

            const accordion = render(<Accordion {...componentProps} />);

            const accordionSection = accordion.getByTestId('accordion-section-component-1');

            expect(accordionSection.className).to.contain('govuk-accordion__section--expanded');
        });

        it('should show controls if Javascript is enabled', () => {
            const jsEnabled = true;

            const componentProps: AccordionProps = {
                sections: [
                    {
                        testId: 'component-1',
                        children: <div>This is some content 1</div>,
                        heading: 'Heading',
                        sectionKey: 'sectionKey',
                    },
                ],
                jsEnabled,
            };

            const accordion = render(<Accordion {...componentProps} />);

            const accordionComponent = accordion.getByTestId('accordion');
            expect(accordionComponent.className).to.contain('js-enabled');
        });

        it('should hide controls if Javascript is not enabled', () => {
            const jsEnabled = false;

            const componentProps: AccordionProps = {
                sections: [
                    {
                        testId: 'component-1',
                        children: <div>This is some content 1</div>,
                        heading: 'Heading',
                        sectionKey: 'sectionKey',
                    },
                ],
                jsEnabled,
            };

            const accordion = render(<Accordion {...componentProps} />);

            const accordionComponent = accordion.getByTestId('accordion');
            expect(accordionComponent.className).not.to.contain('js-enabled');
        });
    });
});
