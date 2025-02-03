import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import { TfsApplicationContentDetailsSection } from '../../../../../src';

describe('<TfsApplicationContentDetailsSection /> component tests', () => {
    describe('displayStartDateAndDuration is true', () => {
        let wrapper: RenderResult;
        beforeEach(() => {
            wrapper = render(
                <TfsApplicationContentDetailsSection
                    id="test-section"
                    applicationSummary={'summary content\nthis is some summary text'}
                    displayStartDateAndDuration={true}
                    projectStartDate="August 2020"
                    projectDuration="24 months"
                />,
            );
        });
        afterEach(() => {
            wrapper.unmount();
        });

        it('should display start date, duration and summary HEADINGS', () => {
            expect(wrapper.container.querySelectorAll('h4').length).to.equal(3);
        });

        it('should display start date, duration and summary CONTENTS', () => {
            expect(wrapper.container.querySelectorAll('p').length).to.equal(3);
        });

        it('should display the correct summary heading', () => {
            expect(wrapper.container.querySelectorAll('h4')[0].textContent).to.equal('Project Summary');
        });

        it('should display the correct summary contents', () => {
            const paragraphComponent = wrapper.container.querySelector('p');
            expect(paragraphComponent).to.not.be.null;

            expect(paragraphComponent!.innerHTML).to.equal('summary content<br>this is some summary text');
        });

        it('should display the correct project start date heading', () => {
            expect(wrapper.container.querySelectorAll('h4')[1].textContent).to.equal('Start date');
        });

        it('should display the correct project start date', () => {
            const paragraphComponent = wrapper.container.querySelectorAll('div')[2].querySelector('p');
            expect(paragraphComponent).to.not.be.null;

            expect(paragraphComponent!.innerHTML).to.equal('August 2020');
        });

        it('should display the correct project duration heading', () => {
            expect(wrapper.container.querySelectorAll('h4')[2].textContent).to.equal('Duration');
        });

        it('should display the correct project duration', () => {
            const paragraphComponent = wrapper.container.querySelectorAll('div')[3].querySelector('p');
            expect(paragraphComponent).to.not.be.null;

            expect(paragraphComponent!.innerHTML).to.equal('24 months');
        });
    });

    describe('displayStartDateAndDuration is false', () => {
        let wrapper: RenderResult;
        beforeEach(() => {
            wrapper = render(
                <TfsApplicationContentDetailsSection
                    id="test-section"
                    applicationSummary="summary content"
                    displayStartDateAndDuration={false}
                    projectStartDate="August 2020"
                    projectDuration="24 months"
                    summaryTitle="Test Summary Title"
                />,
            );
        });

        it('should display the correct summary heading', () => {
            expect(wrapper.container.querySelectorAll('h4')[0].textContent).to.equal('Test Summary Title');
        });

        it('should display the correct summary contents', () => {
            const paragraphComponent = wrapper.container.querySelector('p');
            expect(paragraphComponent).to.not.be.null;

            expect(paragraphComponent!.textContent).to.equal('summary content');
        });

        it('should not display start date heading', () => {
            expect(wrapper.container.querySelectorAll('h4')[1]).to.be.undefined;
        });

        it('should not display start date', () => {
            expect(wrapper.container.querySelectorAll('p')[1]).to.be.undefined;
        });

        it('should not display project duration heading', () => {
            expect(wrapper.container.querySelectorAll('h4')[2]).to.be.undefined;
        });

        it('should not display project duration', () => {
            expect(wrapper.container.querySelectorAll('p')[2]).to.be.undefined;
        });
    });
});
