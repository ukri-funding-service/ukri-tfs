import React from 'react';
import { expect } from 'chai';
import { RenderResult, render } from '@testing-library/react';
import { TfsPanelItem, TfsPanelItemHeadingLink } from '../../../src/components/panelItem';

// Returns the text of an element without its children.
// Needed to distinguish between hidden / not hidden status text.
const getTextOfElement = (element: Element) => {
    let string = '';
    element.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            string += child.textContent;
        }
    });
    return string;
};

describe('<TfsPanelItem /> component tests', () => {
    describe('isComplete is false, leftPanel is an empty div', () => {
        let reactComponent: RenderResult;

        beforeEach(() => {
            reactComponent = render(<TfsPanelItem isComplete={false} leftPanel={<div></div>} />);
        });

        afterEach(() => {
            reactComponent.unmount();
        });

        it('should not show application item completion class when isComplete is false', () => {
            expect(reactComponent.container.querySelector('.application-item--incomplete .application-item--complete'))
                .to.be.null;
        });

        it('should show hidden message and Incomplete tag when isComplete is false', () => {
            const statusComponent = reactComponent.container.querySelector('.application-item__status');
            expect(statusComponent).to.not.be.null;

            expect(statusComponent!.textContent).to.contain('This section is Incomplete');
        });

        it('should show application item completion class when isComplete is false', () => {
            expect(reactComponent.container.querySelector('.application-item--incomplete')).to.exist;
            expect(reactComponent.container.querySelector('.application-item--complete')).to.be.null;
        });

        it('should have incomplete class when isComplete is false and showIcon is unset and completionStatusProvided is true', () => {
            expect(reactComponent.container.querySelector('.application-item--incomplete')).to.exist;
        });

        it('should not have complete class when isComplete is false and showIcon is unset and completionStatusProvided is true', () => {
            expect(reactComponent.container.querySelector('.application-item--complete')).to.be.null;
        });

        it('should not display control panel if no control component provided', () => {
            expect(reactComponent.container.querySelector('.application-item__right .application-item__control')).to.be
                .null;
        });

        it('should display meta component in meta panel if provided', () => {
            expect(reactComponent.container.querySelector('.application-item__right .application-item__control')).to.be
                .null;
        });

        it('should not display meta panel if no meta component provided', () => {
            expect(reactComponent.container.querySelector('.application-item__right .application-item__meta')).to.be
                .null;
        });
    });

    describe('isComplete is true, leftPanel is an empty div', () => {
        let reactComponent: RenderResult;

        beforeEach(() => {
            reactComponent = render(<TfsPanelItem isComplete={true} leftPanel={<div></div>} />);
        });

        afterEach(() => {
            reactComponent.unmount();
        });

        it('should show application status class when isComplete is true', () => {
            const statusComponent = reactComponent.container.querySelector('.application-item__status');
            expect(statusComponent).to.not.be.null;

            expect(statusComponent!).to.exist;
        });

        it('should have complete class when isComplete is true and showIcon is unset and completionStatusProvided is true', () => {
            expect(reactComponent.container.querySelector('.application-item--complete')).to.exist;
        });
    });

    describe('individual tests', () => {
        let reactComponent: RenderResult;

        afterEach(() => {
            reactComponent.unmount();
        });

        it('should not show icon when isComplete is not provided', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} showStatusIcon={true} />);
            expect(reactComponent.container.querySelector('.application-item--incomplete')).to.be.null;
            expect(reactComponent.container.querySelector('.application-item--complete')).to.be.null;
        });

        it('should not show application status class when isComplete is not provided', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} showStatusText={true} />);
            expect(reactComponent.container.querySelector('.application-item--incomplete')).to.be.null;
            expect(reactComponent.container.querySelector('.application-item--complete')).to.be.null;
        });

        it('should have incomplete class when isComplete is false and showIcon is true and completionStatusProvided is true', () => {
            reactComponent = render(<TfsPanelItem isComplete={false} showStatusIcon={true} leftPanel={<div></div>} />);
            expect(reactComponent.container.querySelector('.application-item--incomplete')).to.exist;
        });

        it('should have complete class when isComplete is true and showIcon is true and completionStatusProvided is true', () => {
            reactComponent = render(<TfsPanelItem isComplete={true} showStatusIcon={true} leftPanel={<div></div>} />);
            expect(reactComponent.container.querySelector('.application-item--complete')).to.exist;
        });

        it('should have neither incomplete or complete class when isComplete is false and showIcon is false and completionStatusProvided is true', () => {
            reactComponent = render(<TfsPanelItem isComplete={false} showStatusIcon={false} leftPanel={<div></div>} />);
            const { container } = reactComponent;
            expect(container.querySelector('.application-item--complete')).to.be.null;
            expect(container.querySelector('.application-item--incomplete')).to.be.null;
        });

        it('should have neither incomplete or complete class when isComplete is false and showIcon is true and completionStatusProvided is true', () => {
            reactComponent = render(<TfsPanelItem isComplete={true} showStatusIcon={false} leftPanel={<div></div>} />);
            const { container } = reactComponent;
            expect(container.querySelector('.application-item--complete')).to.be.null;
            expect(container.querySelector('.application-item--incomplete')).to.be.null;
        });

        it('should display content in the left panel', () => {
            const leftPanel = <div className="myTestDiv"></div>;
            reactComponent = render(<TfsPanelItem leftPanel={leftPanel} isComplete={false} />);
            expect(reactComponent.container.querySelector('.application-item__left .myTestDiv')).to.exist;
        });

        it('should have width override on left panel', () => {
            const leftPanel = <div className="myTestDiv"></div>;
            reactComponent = render(
                <TfsPanelItem leftPanel={leftPanel} isComplete={false} leftPanelFillsWidth={true} />,
            );

            expect(
                reactComponent.container.querySelector(
                    '.application-item__contents.govuk-clearfix.govuk-width-container.application-item--flex-right',
                ),
            ).to.exist;
        });

        it('should display control component in control panel if provided', () => {
            const control = <div className="myControl"></div>;
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} control={control} isComplete={false} />);
            expect(
                reactComponent.container.querySelector(
                    '.application-item__right .application-item__control .myControl',
                ),
            ).to.exist;
        });

        it('should display metadata in right column if provided', () => {
            const metadataComponent = <div className="myMetadataComponent"></div>;
            reactComponent = render(
                <TfsPanelItem leftPanel={<div></div>} metadata={metadataComponent} isComplete={false} />,
            );
            expect(
                reactComponent.container.querySelector(
                    '.application-item__right .application-item__meta .myMetadataComponent',
                ),
            ).to.exist;
        });

        it('should not display visible status text if metadata provided', () => {
            const metadataComponent = <div className="myMetadataComponent"></div>;
            reactComponent = render(
                <TfsPanelItem
                    leftPanel={<div></div>}
                    metadata={metadataComponent}
                    isComplete={false}
                    showStatusText={true}
                />,
            );

            const rightStatusComponent = reactComponent.container.querySelector(
                '.application-item__right .application-item__status',
            );

            const visibleText = getTextOfElement(rightStatusComponent!);
            expect(visibleText).to.equal('');
        });

        it('should display status component if metadata not provided and showStatusText is unset', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} isComplete={false} />);
            const { container } = reactComponent;
            const statusComponent = container.querySelector('.application-item__status');
            expect(statusComponent).to.not.be.null;

            const rightStatusComponent = container.querySelector('.application-item__right .application-item__status');
            expect(rightStatusComponent!.textContent).to.equal('This section is Incomplete');
            const visibleText = getTextOfElement(rightStatusComponent!);
            expect(visibleText).to.equal('Incomplete');
        });

        it('should display custom status component if metadata not provided and showStatusText is unset and custom statusAriaPrefix provided', () => {
            reactComponent = render(
                <TfsPanelItem leftPanel={<div></div>} isComplete={false} statusAriaPrefix="Custom Prefix is" />,
            );
            const { container } = reactComponent;
            const rightStatusComponent = container.querySelector('.application-item__right .application-item__status');
            expect(rightStatusComponent).to.exist;
            expect(rightStatusComponent!.textContent).to.equal('Custom Prefix is Incomplete');
        });

        it('should display left panel 1/3 and right panel 1/3 width if fullWidth is not set', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} />);
            expect(reactComponent.container.querySelector('.application-item__left--full')).to.be.null;
            expect(reactComponent.container.querySelector('.application-item__right--full')).to.be.null;
        });

        it('should display left and right panels full width if fullWidth is set', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} fullWidth={true} />);
            expect(reactComponent.container.querySelector('.application-item__left--full')).to.not.be.null;
            expect(reactComponent.container.querySelector('.application-item__right--full')).to.not.be.null;
        });

        it('should display custom status component if metadata not provided and showStatusText is true and statusAriaPrefix provided', () => {
            reactComponent = render(
                <TfsPanelItem
                    leftPanel={<div></div>}
                    isComplete={true}
                    showStatusText={true}
                    statusAriaPrefix="Custom prefix is"
                />,
            );

            const statusComponent = reactComponent.container.querySelector('.application-item__status');
            expect(statusComponent).to.not.be.null;

            expect(statusComponent!.textContent).to.equal('Custom prefix is Complete');
        });

        it('should display status component if metadata not provided and showStatusText is true', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} isComplete={true} showStatusText={true} />);

            const statusComponent = reactComponent.container.querySelector('.application-item__status');
            expect(statusComponent).to.not.be.null;

            expect(statusComponent!.textContent).to.equal('This section is Complete');
        });

        it('should not display visible status text provided and showStatusText is false', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} isComplete={false} showStatusText={false} />);
            const rightStatusComponent = reactComponent.container.querySelector(
                '.application-item__right .application-item__status',
            );
            const visibleText = getTextOfElement(rightStatusComponent!);
            expect(visibleText).to.equal('');
        });

        it('should display tag component if tagTitle provided', () => {
            reactComponent = render(
                <TfsPanelItem leftPanel={<div></div>} isComplete={false} showStatusText={false} tagTitle="test tag" />,
            );
            const tagComponent = reactComponent.container.querySelector('.application-item__tag');
            expect(tagComponent).to.not.be.null;
            expect(tagComponent!.textContent).to.be.equal('test tag');
        });

        it('should not display tag component if tagTitle not provided', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} isComplete={false} showStatusText={false} />);
            expect(reactComponent.container.querySelector('.application-item__tag')).not.to.exist;
        });

        it('should have correct visually hidden status content when status is visible', () => {
            reactComponent = render(<TfsPanelItem isComplete={true} leftPanel={<div></div>} />);
            const visuallyHiddenComponent = reactComponent.container.querySelector('.govuk-visually-hidden');
            expect(visuallyHiddenComponent).to.not.be.null;
            expect(visuallyHiddenComponent!.textContent).to.equal('This section is ');
        });

        it('should have correct visually hidden status content when status is visible and statusAriaPrefix is provided', () => {
            reactComponent = render(
                <TfsPanelItem isComplete={true} leftPanel={<div></div>} statusAriaPrefix="Custom section is" />,
            );
            const visuallyHiddenComponent = reactComponent.container.querySelector('.govuk-visually-hidden');
            expect(visuallyHiddenComponent).to.not.be.null;
            expect(visuallyHiddenComponent!.textContent).to.equal('Custom section is ');
        });

        it('should display error class if error text is provided and field name is provided', () => {
            const errorMessage = 'A big problem occurred!';
            const fieldName = 'Error field name';
            reactComponent = render(
                <TfsPanelItem
                    leftPanel={<div></div>}
                    isComplete={false}
                    error={{ text: errorMessage, fieldName: fieldName }}
                />,
            );
            expect(reactComponent.container.querySelector('.application-item--error')).to.exist;
        });

        it('should not display error class if error text is not provided and field name is not provided', () => {
            reactComponent = render(
                <TfsPanelItem leftPanel={<div></div>} isComplete={false} error={{ text: '', fieldName: '' }} />,
            );
            expect(reactComponent.container.querySelector('.application-item--error')).to.exist;
        });

        it('should not display error class if error prop does not exist', () => {
            reactComponent = render(<TfsPanelItem leftPanel={<div></div>} isComplete={false} />);
            expect(reactComponent.container.querySelector('.application-item--error')).to.be.null;
        });

        it('should provide correct error field id if error text is provided and field name is provided', () => {
            const errorMessage = 'A big problem occurred!';
            const fieldName = 'big';
            reactComponent = render(
                <TfsPanelItem
                    leftPanel={<div></div>}
                    error={{ text: errorMessage, fieldName: fieldName }}
                    isComplete={false}
                />,
            );
            expect(reactComponent.container.querySelector('#big-error.application-item__error-message')).to.exist;
        });

        it('should add aria-describedby label to id', () => {
            const ariaId = 'aria-001';
            reactComponent = render(
                <TfsPanelItem leftPanel={<div aria-describedby={ariaId}></div>} ariaDescribedBy={ariaId} />,
            );
            expect(reactComponent.container.querySelectorAll(`#${ariaId}`).length).to.equal(1);
        });
    });

    describe('<TfsPanelItemHeadingLink /> component tests', () => {
        it('renders a link wrapped ina  heading class', () => {
            const reactComponent = render(<TfsPanelItemHeadingLink href="wibble" text="my link" tag="h3" />);
            const link = reactComponent.getByText('my link');
            expect((link as HTMLAnchorElement).href).to.equal('wibble');
            reactComponent.unmount();
        });
    });
});
