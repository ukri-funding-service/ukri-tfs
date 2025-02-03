/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import { expect } from 'chai';
import sinon from 'sinon';
import focusAndScrollToError from '../../../src/components/focusAndScrollToError';

describe('focusAndScrollToFormGroup', () => {
    beforeEach(() => {
        expect((window as any).tinyMCE).to.be.undefined;
    });

    afterEach(() => {
        sinon.restore();
        (window as any).tinyMCE = undefined;
    });

    it('can focus on a rich text editor', () => {
        const focus = sinon.stub();

        (window as any).tinyMCE = {
            editors: {
                component__rte_hidden: {
                    focus,
                },
            },
        };

        const mockEvent = {
            target: { getAttribute: () => '#component' },
            preventDefault: sinon.stub(),
        };

        focusAndScrollToError(mockEvent as any);

        expect(focus.calledOnce);
    });

    it('can focus on an element', () => {
        const focus = sinon.stub();

        const element = {
            getElementsByTagName: () => null,
            focus,
        } as any;

        sinon.replace(document, 'getElementById', (id: string) => {
            if (id === 'component') {
                return element;
            } else {
                return null;
            }
        });

        const mockEvent = {
            target: { getAttribute: () => '#component' },
            preventDefault: sinon.stub(),
        };

        focusAndScrollToError(mockEvent as any);

        expect(focus.calledOnce);
    });

    it('can focus on an input element', () => {
        const focus = sinon.stub();

        const element = {
            getElementsByTagName: () => [{ focus }],
        } as any;

        sinon.replace(document, 'getElementById', (id: string) => {
            if (id === 'component') {
                return element;
            } else {
                return null;
            }
        });

        const mockEvent = {
            target: { getAttribute: () => '#component' },
            preventDefault: sinon.stub(),
        };

        focusAndScrollToError(mockEvent as any);

        expect(focus.calledOnce);
    });

    it('can scroll a wrapper element into view', () => {
        const scrollIntoView = sinon.stub();

        const element = {
            getElementsByTagName: () => {},
            focus: () => {},
            scrollIntoView: () => [{ scrollIntoView }],
        } as any;

        sinon.replace(document, 'getElementById', (id: string) => {
            if (id === 'component-wrapper') {
                return element;
            } else {
                return null;
            }
        });

        const mockEvent = {
            target: { getAttribute: () => '#component-wrapper' },
            preventDefault: sinon.stub(),
        };

        focusAndScrollToError(mockEvent as any);

        expect(scrollIntoView.calledOnce);
    });

    it('can scroll a parent element into view', () => {
        const scrollIntoView = sinon.stub();

        const element = {
            getElementsByTagName: () => [],
            focus: () => {},
            parentElement: {
                classList: { contains: (str: string) => str === 'govuk-form-group' },
                scrollIntoView,
            },
        } as any;

        sinon.replace(document, 'getElementById', (id: string) => {
            if (id === 'component') {
                return element;
            } else {
                return null;
            }
        });

        const mockEvent = {
            target: { getAttribute: () => '#component' },
            preventDefault: sinon.stub(),
        };

        focusAndScrollToError(mockEvent as any);

        expect(scrollIntoView.calledOnce);
    });
});
