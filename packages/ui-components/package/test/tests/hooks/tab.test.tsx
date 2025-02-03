/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mocha';
import sinon from 'sinon';
import { useTab } from '../../../src/hooks/tab';
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

export enum ReviewTab {
    applicationInformationTab = 'applicationInformationTab',
    readApplicationTab = 'readApplicationTab',
    yourReviewTab = 'yourReviewTab',
}

describe('useTab', () => {
    afterEach(() => sinon.restore());

    it('can update the tab and the scroll position at the same time', async () => {
        const scrollTo = sinon.stub(window, 'scrollTo');

        let hook: any;
        let resolveFunction: any;

        const TestComponent = (): React.ReactElement => {
            hook = useTab(ReviewTab.applicationInformationTab);

            React.useEffect(() => {
                if (resolveFunction) {
                    resolveFunction();
                }
            });

            return <div></div>;
        };

        const wrapper = render(<TestComponent />);

        hook.setState({ scrollPosition: 7 });

        await new Promise(resolve => {
            // React 18 requires this await
            resolveFunction = resolve;
            hook.setState({ tab: ReviewTab.readApplicationTab });
        });

        wrapper.unmount();
        expect(hook.state.scrollPosition).to.equal(7);
        expect(hook.state.tab).to.equal(ReviewTab.readApplicationTab);
        expect(scrollTo).to.be.calledWith({ top: 7 });
    });
});
