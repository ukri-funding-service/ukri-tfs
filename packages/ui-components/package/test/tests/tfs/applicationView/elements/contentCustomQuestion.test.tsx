import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import { TfsApplicationContentCustomQuestionSection, QuestionDetails } from '../../../../../src';

describe('<QuestionDetails /> component test', () => {
    it('should have a non-print view', () => {
        const wrapper = render(
            <QuestionDetails print={false} questionSubTitleLabel="sub-title" questionGuidanceNotesContent="guidance" />,
        );

        const detailComponent = wrapper.container.querySelector('details');
        expect(detailComponent).to.not.be.null;

        const hasPrintHide = detailComponent!.className;
        wrapper.unmount();

        expect(hasPrintHide).to.contain('print-hide');
    });

    it('should have a print view', () => {
        const wrapper = render(
            <QuestionDetails print={true} questionSubTitleLabel="sub-title" questionGuidanceNotesContent="guidance" />,
        );

        const detailComponent = wrapper.container.querySelector('details');
        expect(detailComponent).to.not.be.null;

        const hasPrintHide = detailComponent!.className;
        wrapper.unmount();

        expect(hasPrintHide).to.contain('print-show');
    });

    it('has label and guidance', () => {
        const wrapper = render(
            <QuestionDetails print={false} questionSubTitleLabel="sub-title" questionGuidanceNotesContent="guidance" />,
        );

        const strongComponent = wrapper.container.querySelector('strong');
        expect(strongComponent).to.not.be.null;

        const label = strongComponent!.textContent;

        const divComponents = Array.from(wrapper.container.querySelectorAll('div'));
        expect(divComponents).to.not.have.lengthOf(0);

        const guidance = divComponents.pop()!.textContent;
        wrapper.unmount();

        expect(label).to.equal('sub-title');
        expect(guidance).to.equal('guidance');
    });
});

describe('<TfsApplicationContentCustomQuestionSection /> component tests', () => {
    let wrapper: RenderResult;
    beforeEach(() => {
        wrapper = render(
            <TfsApplicationContentCustomQuestionSection
                id="test-section"
                answer={'custom question answer\nthis is a custom question answer'}
                fileMetadata={[]}
                questionSubTitleLabel="question sub-title"
                questionGuidanceNotesContent="question guidance"
            />,
        );
    });
    afterEach(() => {
        wrapper.unmount();
    });

    it('should display answer content', () => {
        expect(wrapper.container.querySelectorAll('p').length).to.equal(1);
    });

    it('should display the correct answer content', () => {
        const paragraphComponent = wrapper.container.querySelector('p');
        expect(paragraphComponent).to.not.be.null;

        expect(paragraphComponent!.innerHTML).to.equal('custom question answer<br>this is a custom question answer');
    });
});
