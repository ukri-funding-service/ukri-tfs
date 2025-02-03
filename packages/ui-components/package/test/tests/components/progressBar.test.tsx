import { render } from '@testing-library/react';
import { expect } from 'chai';
import 'mocha';
import React from 'react';
import { ProgressBar } from '../../../src';

describe('<ProgressBar /> component tests', () => {
    it('Should render progress bar 0% complete when progress not set', () => {
        const panel = render(<ProgressBar displayPercentage={true}></ProgressBar>);

        expect(panel.container.querySelector('.progress-meter__text-back-content')?.textContent).to.equal('0%');
        expect(panel.container.querySelector('.progress-meter__text--top')?.textContent).to.equal('0%');
    });

    it('Should render progress bar 0% complete', () => {
        const panel = render(<ProgressBar percentComplete={0} displayPercentage={true}></ProgressBar>);

        expect(panel.container.querySelector('.progress-meter__text-back-content')?.textContent).to.equal('0%');
        expect(panel.container.querySelector('.progress-meter__text--top')?.textContent).to.equal('0%');
    });

    it('Should render progress bar 25% complete', () => {
        const panel = render(<ProgressBar percentComplete={25} displayPercentage={true}></ProgressBar>);

        expect(panel.container.querySelector('.progress-meter__text-back-content')?.textContent).to.equal('25%');
        expect(panel.container.querySelector('.progress-meter__text--top')?.textContent).to.equal('25%');
    });

    it('Should render progress bar 50% complete', () => {
        const panel = render(<ProgressBar percentComplete={50} displayPercentage={true}></ProgressBar>);

        expect(panel.container.querySelector('.progress-meter__text-back-content')?.textContent).to.equal('50%');
        expect(panel.container.querySelector('.progress-meter__text--top')?.textContent).to.equal('50%');
    });

    it('Should render progress bar 75% complete', () => {
        const panel = render(<ProgressBar percentComplete={75} displayPercentage={true}></ProgressBar>);

        expect(panel.container.querySelector('.progress-meter__text-back-content')?.textContent).to.equal('75%');
        expect(panel.container.querySelector('.progress-meter__text--top')?.textContent).to.equal('75%');
    });

    it('Should render progress bar 100% complete', () => {
        const panel = render(<ProgressBar percentComplete={100} displayPercentage={true}></ProgressBar>);

        expect(panel.container.querySelector('.progress-meter__text-back-content')?.textContent).to.equal('100%');
        expect(panel.container.querySelector('.progress-meter__text--top')?.textContent).to.equal('100%');
    });

    it('Should render progress bar 0% with accessibility text and prepended', () => {
        const panel = render(
            <ProgressBar
                prependedHiddenAccessibilityText="Your application is"
                percentComplete={15}
                appendedText="complete"
                displayPercentage={true}
            ></ProgressBar>,
        );

        expect(panel.container.querySelector('.progress-meter__text-back-content')?.textContent).to.equal(
            '15% complete',
        );
        expect(panel.container.querySelector('.progress-meter__text-back-content-hidden')?.textContent).to.equal(
            'Your application is ',
        );
        expect(panel.container.querySelector('.progress-meter__text--top')?.textContent).to.equal('15% complete');
    });
});
