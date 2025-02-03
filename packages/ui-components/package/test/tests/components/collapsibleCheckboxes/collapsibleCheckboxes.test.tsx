import { fireEvent, render } from '@testing-library/react';
import chai, { expect } from 'chai';
import 'mocha';
import React from 'react';
import sinonChai from 'sinon-chai';
import { CollapsibleCheckboxes, CollapsibleCheckboxesProps } from '../../../../src/components/collapsibleCheckboxes';
import { CheckboxesItemProps } from 'govuk-react-jsx';
import sinon, { SinonStub } from 'sinon';

describe('CollapsibleCheckboxes tests', () => {
    let getItemSpy: SinonStub;
    let setItemSpy: SinonStub;
    let localStorageMock: Storage;

    before(() => {
        chai.use(sinonChai);
    });

    beforeEach(() => {
        getItemSpy = sinon.stub();
        setItemSpy = sinon.stub();

        localStorageMock = {
            getItem: getItemSpy,
            setItem: setItemSpy,
            clear: sinon.stub(),
            key: sinon.stub(),
            length: 0,
            removeItem: sinon.stub(),
        };

        global.localStorage = localStorageMock;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render the expanded checkboxes', () => {
        const checkboxes: CheckboxesItemProps[] = [
            { children: 'In expert review (1000)', value: 'In expert review', id: '1', defaultChecked: true },
            { children: 'Sent for response (222)', value: 'Sent for response', id: '2', defaultChecked: true },
            { children: 'Expert review complete (31)', value: 'Expert review complete', id: '3', defaultChecked: true },
            { children: 'Failed expert review sent (4)', value: 'Failed expert review', id: '4', defaultChecked: true },
        ];

        const component = render(
            <CollapsibleCheckboxes
                id={'status-filters'}
                name={'collapsible-checkboxes'}
                checkboxItems={checkboxes}
                heading={'Collapsible checkboxes'}
                jsEnabled={true}
                defaultExpanded={true}
            />,
        );

        const expectedCheckboxes = [
            'In expert review (1000)',
            'Sent for response (222)',
            'Expert review complete (31)',
            'Failed expert review sent (4)',
        ];
        const heading = component.getByTestId('collapsible-checkboxes-heading');
        const checkboxComponents = component.getByTestId('collapsible-checkboxes-checkboxes');
        const namedCheckboxes = component.container.querySelectorAll('input[name="collapsible-checkboxes"]');

        expect(heading.textContent).to.contain('Collapsible checkboxes');
        expect(heading.textContent).to.contain('Hide');
        expect(namedCheckboxes.length).to.eql(4);
        expectedCheckboxes.forEach(checkbox => {
            expect(checkboxComponents.textContent).to.contain(checkbox);
        });
    });

    it('should render without being expanded', () => {
        const checkboxes = [
            { children: 'In expert review (1000)', value: 'In expert review', id: '1', defaultChecked: true },
        ];

        const component = render(
            <CollapsibleCheckboxes
                id={'status-filters'}
                name={'collapsible-checkboxes'}
                checkboxItems={checkboxes}
                heading={'my hidden checkboxes'}
                jsEnabled={true}
                defaultExpanded={false}
            />,
        );

        const heading = component.getByTestId('collapsible-checkboxes-heading');

        expect(heading.textContent).to.contain('my hidden checkboxes');
        expect(heading.textContent).to.contain('Show');
        expect(heading.textContent).to.not.contain('Hide');
    });

    it('should render without javascript', () => {
        const checkboxes = [
            { children: 'In expert review (1000)', value: 'In expert review', id: '1', defaultChecked: true },
            { children: 'Sent for response (222)', value: 'Sent for response', id: '2', defaultChecked: true },
            { children: 'Expert review complete (31)', value: 'Expert review complete', id: '3', defaultChecked: true },
            { children: 'Failed expert review sent (4)', value: 'Failed expert review', id: '4', defaultChecked: true },
        ];

        const component = render(
            <CollapsibleCheckboxes
                id={'status-filters'}
                name={'collapsible-checkboxes'}
                checkboxItems={checkboxes}
                heading={'Collapsible checkboxes'}
                jsEnabled={false}
                defaultExpanded={true}
            />,
        );

        const expectedCheckboxes = [
            'In expert review (1000)',
            'Sent for response (222)',
            'Expert review complete (31)',
            'Failed expert review sent (4)',
        ];
        const heading = component.getByTestId('collapsible-checkboxes-heading');
        const checkboxComponents = component.getByTestId('collapsible-checkboxes-checkboxes');
        const toggleButton = component.container.querySelector('.js-enabled');
        const checkboxContainer = component.container.querySelector('.js-hidden');
        const namedCheckboxes = component.container.querySelectorAll('input[name="collapsible-checkboxes"]');

        expect(heading.textContent).to.contain('Collapsible checkboxes');
        expect(toggleButton).to.be.null;
        expect(checkboxContainer).to.not.be.null;
        expect(namedCheckboxes.length).to.eql(4);
        expectedCheckboxes.forEach(checkbox => {
            expect(checkboxComponents.textContent).to.contain(checkbox);
        });
    });

    describe('usePersistState', () => {
        const expectedLocalStorageId = 'collapsibleCheckboxesExpanded:collapsible-checkboxes';
        const checkboxItems: CheckboxesItemProps[] = [{ children: 'My checkbox', value: 'myCheckbox' }];
        const props: CollapsibleCheckboxesProps = {
            id: 'collapsible-checkboxes',
            name: 'collapsibleCheckboxes',
            checkboxItems: checkboxItems,
            heading: 'Collapsible checkboxes',
            jsEnabled: true,
            defaultExpanded: true,
        };

        it('should read show/hide status from local storage on render', () => {
            getItemSpy.returns('false');

            render(<CollapsibleCheckboxes {...props} />);

            expect(getItemSpy).to.have.been.calledWith(expectedLocalStorageId);
        });

        it('should persist show/hide status to local storage on click', () => {
            const component = render(<CollapsibleCheckboxes {...props} />);

            const toggleButton = component.getByText('Hide');

            fireEvent.click(toggleButton);

            expect(setItemSpy.getCall(0)).to.have.been.calledWith(expectedLocalStorageId, 'true');
            expect(setItemSpy.getCall(1)).to.have.been.calledWith(expectedLocalStorageId, 'false');
        });
    });

    it('should render wrapper with optional classes', () => {
        const component = render(
            <CollapsibleCheckboxes
                id={'collapsible-checkboxes'}
                name={'collapsibleCheckboxes'}
                checkboxItems={[]}
                heading={'Collapsible checkboxes'}
                jsEnabled={true}
                defaultExpanded={true}
                className="my-optional-class"
            />,
        );

        const wrapper = component.getByTestId('collapsible-checkboxes');

        expect(wrapper.getAttribute('class')).to.contain('my-optional-class');
    });
});
