import React from 'react';
import { render } from '@testing-library/react';
import { expect, use } from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {
    DetailsSection,
    ApplicantsSection,
    TfsApplicationSectionType,
    CustomQuestionSection,
    TfsApplicationViewToC,
    TfsApplicationViewToCProps,
    TfsApplicationViewContent,
    TfsApplicationSection,
    TfsApplicationViewToCState,
} from '../../../../../src';

describe('<TfsApplicationViewToC /> tests', () => {
    before('setup', () => {
        use(sinonChai);
    });

    let getSectionId: sinon.SinonStub;

    const detailsSection: DetailsSection = {
        type: TfsApplicationSectionType.Details,
        title: 'Application Details',
        displayStartDateAndDuration: false,
        summary: 'Summary',
    };

    const applicantsSection: ApplicantsSection = {
        type: TfsApplicationSectionType.Applicants,
        title: 'Applicants',
        applicants: [],
    };

    const customSection: CustomQuestionSection = {
        type: TfsApplicationSectionType.Custom,
        title: 'Custom Question 1',
        questionsetId: '1',
        answer: '',
        fileMetadata: [],
        questionSubTitleLabel: '',
        questionGuidanceNotesContent: '',
    };

    const validSections: TfsApplicationSection[] = [detailsSection, applicantsSection, customSection];

    const validApplicationContent: TfsApplicationViewContent = {
        name: 'Test Application',
        showEditLinks: true,
        sections: [...validSections],
    };

    let validProps: TfsApplicationViewToCProps;

    beforeEach('reset mocks', () => {
        getSectionId = sinon.stub().returns('test-id');

        validProps = {
            id: 'test-toc',
            getSectionLinkId: getSectionId,
            applicationContent: validApplicationContent,
        };
    });

    it('should render 4 list items when there are 3 sections in application content', () => {
        const component = render(<TfsApplicationViewToC {...validProps} />);
        expect(component.container.querySelectorAll('#test-toc')).to.have.lengthOf(1);
        expect(component.container.querySelectorAll('li')).to.have.lengthOf(4);
    });

    it("should show 'Top of page' link", () => {
        const component = render(<TfsApplicationViewToC {...validProps} />);
        expect(component.container.querySelectorAll('#test-toc')).to.have.lengthOf(1);

        const topOfPageItem = component.container.querySelector('li');

        if (!topOfPageItem) {
            throw new Error('Expected li element in the page');
        }

        expect(topOfPageItem.querySelector('a')?.textContent).to.be.equal('Top of page');
        expect(topOfPageItem.querySelector('a')?.getAttribute('href')).to.be.equal('#main-content');
    });

    it("should show 'Print this page' link", () => {
        const component = render(<TfsApplicationViewToC {...validProps} />);
        expect(component.container.querySelectorAll('#test-toc')).to.have.lengthOf(1);

        const printThis = component.container.querySelector('#printThis');

        if (!printThis) {
            throw new Error('Expected #printThis element in the page');
        }

        expect(printThis.textContent).to.be.equal('Print this page');
        expect(printThis.className).to.contain('js-only');
        expect(printThis.getAttribute('href')).to.be.equal('#');
    });

    it('should set the list item text to the section title', () => {
        const component = render(<TfsApplicationViewToC {...validProps} />);
        expect(component.container.querySelectorAll('#test-toc')).to.have.lengthOf(1);

        const firstSectionListItem = component.container.querySelectorAll('li')[1];
        expect(firstSectionListItem.querySelector('a')?.textContent).to.be.equal('1. Application Details');

        const secondSectionListItem = component.container.querySelectorAll('li')[2];
        expect(secondSectionListItem.querySelector('a')?.textContent).to.be.equal('2. Applicants');

        const thirdSectionListItem = component.container.querySelectorAll('li')[3];
        expect(thirdSectionListItem.querySelector('a')?.textContent).to.be.equal('3. Custom Question 1');
    });

    it('should call getSectionLinkId for each section with relevant data', () => {
        const component = render(<TfsApplicationViewToC {...validProps} />);
        expect(component.container.querySelectorAll('#test-toc')).to.have.lengthOf(1);

        expect(getSectionId).to.be.have.callCount(6);
        expect(getSectionId.getCall(0)).to.be.calledWithExactly(detailsSection);
        expect(getSectionId.getCall(1)).to.be.calledWithExactly(applicantsSection);
        expect(getSectionId.getCall(2)).to.be.calledWithExactly(customSection);
    });

    it('should set href of each list item', () => {
        const component = render(<TfsApplicationViewToC {...validProps} />);
        expect(component.container.querySelectorAll('#test-toc')).to.have.lengthOf(1);

        const firstSectionListItem = component.container.querySelectorAll('li')[1];
        expect(firstSectionListItem.querySelector('a')?.getAttribute('href')).to.be.equal('#test-id');

        const secondSectionListItem = component.container.querySelectorAll('li')[2];
        expect(secondSectionListItem.querySelector('a')?.getAttribute('href')).to.be.equal('#test-id');

        const thirdSectionListItem = component.container.querySelectorAll('li')[3];
        expect(thirdSectionListItem.querySelector('a')?.getAttribute('href')).to.be.equal('#test-id');
    });

    let setState: Function;
    class Wrapper extends TfsApplicationViewToC {
        constructor(props: TfsApplicationViewToCProps) {
            super(props);
            setState = this.setState.bind(this);
        }
    }

    it("should have an element with id 'printThis' wrapped by a div with classname 'nav__link--print", async () => {
        const wrapper = render(<Wrapper {...validProps} />);
        const printThis = wrapper.container.querySelector('#printThis');

        if (!printThis) {
            throw new Error('Expected #printThis element in the page');
        }

        expect(printThis.parentElement?.className.includes('nav__link--print')).to.be.false;

        const stateWithStickNav: TfsApplicationViewToCState = { stickNav: true, sectionScrollCount: 0 };

        await new Promise(resolve => {
            setState(stateWithStickNav, resolve);
        });

        expect(printThis.parentElement?.className.includes('nav__link--print')).to.be.true;
    });

    it("should have 'fixed' class when 'stickNav' is true in the state", async () => {
        const wrapper = render(<Wrapper {...validProps} />);
        expect(wrapper.container.querySelectorAll('#test-toc')).to.have.lengthOf(1);

        expect(wrapper.container.querySelector('.sticky-nav')?.className.includes('sticky-nav--fixed')).to.be.false;

        const stateWithStickNav: TfsApplicationViewToCState = { stickNav: true, sectionScrollCount: 0 };

        await new Promise(resolve => {
            setState(stateWithStickNav, resolve);
        });

        expect(wrapper.container.querySelector('.sticky-nav')?.className.includes('sticky-nav--fixed')).to.be.true;
    });

    it("should set 'active' class when sectionScrollCount is incremented", async () => {
        const wrapper = render(<Wrapper {...validProps} />);
        expect(wrapper.container.querySelectorAll('#test-toc')).to.have.lengthOf(1);

        expect(
            wrapper.container.querySelectorAll('.sticky-nav__link')[0].className.includes('sticky-nav__link--active'),
        ).to.be.false;
        expect(
            wrapper.container.querySelectorAll('.sticky-nav__link')[1].className.includes('sticky-nav__link--active'),
        ).to.be.false;
        expect(
            wrapper.container.querySelectorAll('.sticky-nav__link')[2].className.includes('sticky-nav__link--active'),
        ).to.be.false;
        expect(
            wrapper.container.querySelectorAll('.sticky-nav__link')[3].className.includes('sticky-nav__link--active'),
        ).to.be.false;

        const stateWithIncreasedSectionScrollCount: TfsApplicationViewToCState = {
            stickNav: false,
            sectionScrollCount: 2,
        };

        await new Promise(resolve => {
            // React 18 requires this await
            setState(stateWithIncreasedSectionScrollCount, resolve);
        });

        expect(
            wrapper.container.querySelectorAll('.sticky-nav__link')[0].className.includes('sticky-nav__link--active'),
        ).to.be.false; // 'Top of page' link is never active
        expect(
            wrapper.container.querySelectorAll('.sticky-nav__link')[1].className.includes('sticky-nav__link--active'),
        ).to.be.true;
        expect(
            wrapper.container.querySelectorAll('.sticky-nav__link')[2].className.includes('sticky-nav__link--active'),
        ).to.be.true;
        expect(
            wrapper.container.querySelectorAll('.sticky-nav__link')[3].className.includes('sticky-nav__link--active'),
        ).to.be.false;
    });
});
