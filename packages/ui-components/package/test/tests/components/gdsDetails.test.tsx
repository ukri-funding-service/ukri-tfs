import 'mocha';
import { expect } from 'chai';
import React from 'react';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { GdsDetails } from '../../../src/components/details';
import { render, fireEvent } from '@testing-library/react';

describe('GdsDetails component tests', (): void => {
    before(() => {
        chai.use(sinonChai);
    });
    afterEach(() => sinon.restore());
    it('should render a single details tag', (): void => {
        const component = render(<GdsDetails title="foo" details={<p>Bar</p>} />);
        expect(component.container.querySelectorAll('details')).to.have.length(1);
    });

    it('should render its children as react JSX within the details tag', (): void => {
        const component = render(<GdsDetails title="foo" details={<p className="content">Bar</p>} />);
        expect(component.container.querySelector('.govuk-details__summary-text')?.textContent).to.equal('foo');
        expect(component.container.querySelector('.content')?.textContent).to.equal('Bar');
    });

    it('should render alt title when its defined and the expanded state is true', (): void => {
        const component = render(
            <GdsDetails
                title="foo"
                altTitle="boom"
                expandedByDefault={true}
                details={<p className="content">Bar</p>}
            />,
        );
        expect(component.container.querySelector('.govuk-details__summary-text')?.textContent).to.equal('boom');
        expect(component.container.querySelector('.content')?.textContent).to.equal('Bar');
        expect(component.container.querySelector('details')?.hasAttribute('open')).to.be.true;
    });

    it('should render its children as react JSX Paragraph', (): void => {
        const component = render(<GdsDetails containerClassName={'content'} title="foo" details={<p>Bar</p>} />);
        expect(component.container.querySelector('.govuk-details__summary-text')?.textContent).to.equal('foo');
        expect(component.container.querySelectorAll('.content')).to.have.length(1);
        expect(component.container.querySelector('.content')?.textContent).to.equal('Bar');
    });

    it('should not render the alt title when its defined and the expanded state is false', (): void => {
        const component = render(
            <GdsDetails
                title="foo"
                altTitle="boom"
                expandedByDefault={false}
                details={<p className="content">Bar</p>}
            />,
        );
        expect(component.container.querySelector('.govuk-details__summary-text')?.textContent).to.equal('foo');
        expect(component.container.querySelector('.content')?.textContent).to.equal('Bar');
        expect(component.container.querySelector('details')?.hasAttribute('open')).to.be.false;
    });

    it('should not collapse the details if content is clicked', (): void => {
        const component = render(
            <GdsDetails
                title={'show'}
                altTitle={'hide'}
                details={
                    <p className="content" id="content-id">
                        Bar
                    </p>
                }
                expandedByDefault={true}
            ></GdsDetails>,
        );
        const content = component.container.querySelector('#content-id');
        expect(content).not.null;
        expect(component.container.querySelector('details')?.getAttribute('open')).to.exist;
        fireEvent.click(content!);
        expect(component.container.querySelector('details')?.getAttribute('open')).to.exist;
    });

    it('should collapse the details if summary is clicked', (): void => {
        const component = render(
            <GdsDetails
                title={'show'}
                altTitle={'hide'}
                details={<p>content</p>}
                expandedByDefault={true}
            ></GdsDetails>,
        );
        const summary = component.container.querySelector('summary');
        expect(summary).not.null;
        expect(component.container.querySelector('details')?.getAttribute('open')).to.exist;
        fireEvent.click(summary!);
        expect(component.container.querySelector('details')?.getAttribute('open')).not.to.exist;
    });
});
