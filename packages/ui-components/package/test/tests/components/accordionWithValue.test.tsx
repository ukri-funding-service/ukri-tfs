import { fireEvent, render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { AccordionWithValue, AccordionWithValueProps } from '../../../src/';

describe('<AccordionWithValue /> component tests', () => {
    let component: RenderResult;
    let props: AccordionWithValueProps;

    beforeEach(function () {
        props = {
            sections: [
                {
                    testId: 'component-1',
                    children: <div>This is some content 1</div>,
                    heading: 'Heading',
                    sectionKey: 'sectionKey',
                    summaryLabel: 'summaryLabel1',
                    summaryValue: 'summaryValue',
                },
                {
                    testId: 'component-2',
                    children: <div>This is some content 2</div>,
                    heading: 'Heading 2',
                    sectionKey: 'sectionKey',
                    summaryLabel: 'summaryLabel2',
                    summaryValue: 'summaryValue',
                },
            ],
        };
    });

    afterEach(() => {
        component.unmount();
    });

    it('should render text in component without guidance', () => {
        component = render(<AccordionWithValue {...props} />);
        expect(() => component.getByTestId('accordion-with-value-section-component-1')).not.to.throw();
        expect(() => component.getByTestId('accordion-with-value-section-component-2')).not.to.throw();
        const section1 = component.getByTestId('accordion-with-value-section-component-1');
        const section2 = component.getByTestId('accordion-with-value-section-component-2');
        expect(section1.querySelector('.govuk-accordion__section-heading button')!.textContent).to.equal('Heading');
        expect(section2.querySelector('.govuk-accordion__section-heading button')!.textContent).to.equal('Heading 2');
        expect(section1.querySelector('.accordion-totals__label')!.textContent).to.equal('Heading summaryLabel1: ');
        expect(section2.querySelector('.accordion-totals__label')!.textContent).to.equal('Heading 2 summaryLabel2: ');
        expect(() => component.getByTestId('accordion-with-value-content-component-1')).not.to.throw();
        expect(() => component.getByTestId('accordion-with-value-content-component-2')).not.to.throw();
        const content1 = component.getByTestId('accordion-with-value-content-component-1');
        const content2 = component.getByTestId('accordion-with-value-content-component-2');
        expect(content1.textContent).to.equal('This is some content 1');
        expect(content2.textContent).to.equal('This is some content 2');
        expect(content1.querySelectorAll('.govuk-details').length).to.equal(0);
        expect(content2.querySelectorAll('.govuk-details').length).to.equal(0);
        expect(component.container.querySelectorAll('.govuk-accordion__open-all span')![0].textContent).to.equal(
            'Show all',
        );
        expect(component.container.querySelector('.govuk-accordion__controls')!.children.length).to.equal(1);
    });

    it('should render text in component without main child', () => {
        props.children = <div></div>;
        component = render(<AccordionWithValue {...props} />);
        expect(component.container.querySelectorAll('.govuk-accordion__open-all span')![0].textContent).to.equal(
            'Show all',
        );
        expect(component.container.querySelector('.govuk-accordion__controls')!.children.length).to.equal(2);
    });

    it('should have defaultExpanded sections when required', () => {
        props.sections[0].defaultExpanded = true;
        component = render(<AccordionWithValue {...props} />);
        expect(component.getByTestId('accordion-with-value-section-component-1').className).to.contain(
            'govuk-accordion__section--expanded',
        );
        expect(component.getByTestId('accordion-with-value-section-component-2').className).to.not.contain(
            'govuk-accordion__section--expanded',
        );
    });

    it('should render text in component without guidance when only one section exists', () => {
        props.sections.pop();
        component = render(<AccordionWithValue {...props} />);
        expect(() => component.getByTestId('accordion-with-value-section-component-1')).not.to.throw();
        expect(() => component.getByTestId('accordion-with-value-section-component-2')).to.throw();
        const section1 = component.getByTestId('accordion-with-value-section-component-1');
        expect(section1.querySelector('.govuk-accordion__section-heading button')!.textContent).to.equal('Heading');
        expect(section1.querySelector('.accordion-totals__label')!.textContent).to.equal('Heading summaryLabel1: ');
        expect(() => component.getByTestId('accordion-with-value-content-component-1')).not.to.throw();
        const content1 = component.getByTestId('accordion-with-value-content-component-1');
        expect(content1.textContent).to.equal('This is some content 1');
        expect(content1.querySelectorAll('.govuk-details').length).to.equal(0);
        expect(component.container.querySelectorAll('.govuk-accordion__open-all span')![0].textContent).to.equal(
            'Show all',
        );
    });

    it('should render guidance blocks inside accordions', () => {
        props.sections[0].guidance = {
            content: 'Guidance content 1',
            title: 'Guidance title 1',
        };
        props.sections[1].guidance = {
            content: 'Guidance content 2',
            title: 'Guidance title 2',
        };
        component = render(<AccordionWithValue {...props} />);

        expect(() => component.getByTestId('accordion-with-value-content-component-1')).not.to.throw();
        expect(() => component.getByTestId('accordion-with-value-content-component-2')).not.to.throw();
        const content1 = component.getByTestId('accordion-with-value-content-component-1');
        const content2 = component.getByTestId('accordion-with-value-content-component-2');
        expect(content1.querySelectorAll('.govuk-details').length).to.equal(1);
        expect(content2.querySelectorAll('.govuk-details').length).to.equal(1);
        expect(content1.querySelector('.govuk-details__summary-text')!.textContent).to.equal('Guidance title 1');
        expect(content2.querySelector('.govuk-details__summary-text')!.textContent).to.equal('Guidance title 2');
        expect(content1.querySelector('.govuk-details__summary-text')!.textContent).to.equal('Guidance title 1');
        expect(content2.querySelector('.govuk-details__summary-text')!.textContent).to.equal('Guidance title 2');
        expect(content1.querySelector('#details-content-0')!.textContent).to.equal('Guidance content 1');
        expect(content2.querySelector('#details-content-1')!.textContent).to.equal('Guidance content 2');
        expect(content1.querySelector('#details-content-0')!.getAttribute('aria-hidden')).to.equal('true');
        expect(content2.querySelector('#details-content-1')!.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should toggle guidance blocks correctly', () => {
        props.sections[0].guidance = {
            content: 'Guidance content 1',
            title: 'Guidance title 1',
        };
        props.sections[1].guidance = {
            content: 'Guidance content 2',
            title: 'Guidance title 2',
        };
        component = render(<AccordionWithValue {...props} />);

        const openAllButton = component.container.querySelector('.govuk-accordion__open-all');
        expect(openAllButton).not.to.be.null;
        fireEvent.click(openAllButton!);

        const guidanceAccordions = component.container.querySelectorAll(
            '.govuk-accordion__section-content .govuk-details',
        );

        guidanceAccordions.forEach(accordion => {
            fireEvent.click(accordion.querySelector('.govuk-details__summary')!);
            expect(accordion.getAttribute('open')).not.to.be.null;
        });
    });

    it('should correctly toggle open all', function () {
        const innerProps: AccordionWithValueProps = {
            sections: [
                {
                    testId: 'component-1',
                    children: <div>This is some content 1</div>,
                    guidance: { content: undefined, title: '' },
                    heading: 'Heading',
                    sectionKey: 'sectionKey',
                    summaryLabel: 'summaryLabel1',
                    summaryValue: 'summaryValue',
                },
                {
                    testId: 'component-2',
                    children: <div>This is some content 2</div>,
                    guidance: { content: undefined, title: '' },
                    heading: 'Heading 2',
                    sectionKey: 'sectionKey',
                    summaryLabel: 'summaryLabel2',
                    summaryValue: 'summaryValue',
                },
            ],
        };
        component = render(<AccordionWithValue {...innerProps} />);
        const openAllButton = component.container.querySelector('.govuk-accordion__open-all');
        expect(openAllButton).not.to.be.null;
        fireEvent.click(openAllButton!);
        expect(openAllButton!.querySelectorAll('span')![0].textContent).to.equal('Hide all');

        expect(component.getByTestId('accordion-with-value-section-component-1').className).to.contain(
            'govuk-accordion__section--expanded',
        );
        expect(component.getByTestId('accordion-with-value-section-component-2').className).to.contain(
            'govuk-accordion__section--expanded',
        );
    });

    it('should correctly toggle close all when default values are opened', function () {
        props.sections[0].defaultExpanded = true;
        props.sections[1].defaultExpanded = true;

        component = render(<AccordionWithValue {...props} />);
        const openAllButton = component.container.querySelector('.govuk-accordion__open-all');
        expect(openAllButton!.querySelectorAll('span')![0].textContent).to.equal('Hide all');
        expect(component.getByTestId('accordion-with-value-section-component-1').className).to.contain(
            'govuk-accordion__section--expanded',
        );
        expect(component.getByTestId('accordion-with-value-section-component-2').className).to.contain(
            'govuk-accordion__section--expanded',
        );
        fireEvent.click(openAllButton!);
        expect(openAllButton!.querySelectorAll('span')![0].textContent).to.equal('Show all');
        expect(component.getByTestId('accordion-with-value-section-component-1').className).not.to.contain(
            'govuk-accordion__section--expanded',
        );
        expect(component.getByTestId('accordion-with-value-section-component-2').className).not.to.contain(
            'govuk-accordion__section--expanded',
        );
    });

    it('should correctly toggle close all when toggled twice', function () {
        component = render(<AccordionWithValue {...props} />);
        const toggleAllButton = component.container.querySelector('.govuk-accordion__open-all');
        expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Show all');
        fireEvent.click(toggleAllButton!);
        expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Hide all');
        expect(component.getByTestId('accordion-with-value-section-component-1').className).to.contain(
            'govuk-accordion__section--expanded',
        );
        expect(component.getByTestId('accordion-with-value-section-component-2').className).to.contain(
            'govuk-accordion__section--expanded',
        );
        fireEvent.click(toggleAllButton!);
        expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Show all');
        expect(component.getByTestId('accordion-with-value-section-component-1').className).not.to.contain(
            'govuk-accordion__section--expanded',
        );
        expect(component.getByTestId('accordion-with-value-section-component-2').className).not.to.contain(
            'govuk-accordion__section--expanded',
        );
    });

    describe('toggling accordions', function () {
        let innerProps: AccordionWithValueProps;
        let toggleAllButton: Element;
        let sectionOneButton: Element;
        let sectionTwoButton: Element;
        let sectionThreeButton: Element;

        beforeEach(function () {
            innerProps = {
                sections: [
                    {
                        testId: 'component-1',
                        children: <div>This is some content 1</div>,
                        heading: 'Heading',
                        sectionKey: 'sectionKey',
                        summaryLabel: 'summaryLabel1',
                        summaryValue: 'summaryValue',
                    },
                    {
                        testId: 'component-2',
                        children: <div>This is some content 2</div>,
                        heading: 'Heading 2',
                        sectionKey: 'sectionKey',
                        summaryLabel: 'summaryLabel2',
                        summaryValue: 'summaryValue',
                    },
                    {
                        testId: 'component-3',
                        children: <div>This is some content 3</div>,
                        heading: 'Heading 3',
                        sectionKey: 'sectionKey',
                        summaryLabel: 'summaryLabel3',
                        summaryValue: 'summaryValue3',
                    },
                ],
            };
            component = render(<AccordionWithValue {...innerProps} />);
            toggleAllButton = component.container.querySelector('.govuk-accordion__open-all')!;
            expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Show all');
            expect(() => component.getByTestId(`accordion-with-value-section-component-1`)).not.to.throw();
            expect(() => component.getByTestId(`accordion-with-value-section-component-2`)).not.to.throw();
            expect(() => component.getByTestId(`accordion-with-value-section-component-3`)).not.to.throw();

            sectionOneButton = component
                .getByTestId(`accordion-with-value-section-component-1`)!
                .querySelector('.govuk-accordion__section-header')!;
            sectionTwoButton = component
                .getByTestId(`accordion-with-value-section-component-2`)!
                .querySelector('.govuk-accordion__section-header')!;
            sectionThreeButton = component
                .getByTestId(`accordion-with-value-section-component-3`)!
                .querySelector('.govuk-accordion__section-header')!;
        });

        it('should open individual sections', function () {
            fireEvent.click(sectionTwoButton);
            expect(component.getByTestId('accordion-with-value-section-component-1').className).not.to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-2').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-3').className).not.to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Show all');
        });

        it('should close individual sections', function () {
            fireEvent.click(sectionOneButton);
            fireEvent.click(sectionTwoButton);
            fireEvent.click(sectionOneButton);
            expect(component.getByTestId('accordion-with-value-section-component-1').className).not.to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-2').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Show all');
        });

        it('should open all sections when open all is clicked and only sections are open', function () {
            fireEvent.click(sectionOneButton);
            fireEvent.click(sectionTwoButton);
            fireEvent.click(toggleAllButton);
            expect(component.getByTestId('accordion-with-value-section-component-1').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-2').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-3').className).to.contain(
                'govuk-accordion__section--expanded',
            );
        });

        it('should show Hide all when all accordions are open', function () {
            fireEvent.click(sectionOneButton);
            fireEvent.click(sectionTwoButton);
            fireEvent.click(sectionThreeButton);
            expect(component.getByTestId('accordion-with-value-section-component-1').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-2').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-3').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Hide all');
        });

        it('should Hide all when all accordions are open', function () {
            fireEvent.click(sectionOneButton);
            fireEvent.click(sectionTwoButton);
            fireEvent.click(sectionThreeButton);
            fireEvent.click(toggleAllButton);
            expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Show all');
            expect(component.getByTestId('accordion-with-value-section-component-1').className).not.to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-2').className).not.to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-3').className).not.to.contain(
                'govuk-accordion__section--expanded',
            );
        });

        it('should toggle individual accordions after all have been opened', function () {
            fireEvent.click(toggleAllButton);
            fireEvent.click(sectionOneButton);
            expect(toggleAllButton!.querySelectorAll('span')![0].textContent).to.equal('Show all');
            expect(component.getByTestId('accordion-with-value-section-component-1').className).not.to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-2').className).to.contain(
                'govuk-accordion__section--expanded',
            );
            expect(component.getByTestId('accordion-with-value-section-component-3').className).to.contain(
                'govuk-accordion__section--expanded',
            );
        });
    });
});
