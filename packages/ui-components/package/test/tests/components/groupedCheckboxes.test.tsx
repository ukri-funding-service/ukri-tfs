import { expect } from 'chai';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { GroupedCheckboxes } from '../../../src';
import sinon, { SinonStub } from 'sinon';
import { CheckboxesItemProps } from 'govuk-react-jsx';

describe('<GroupedCheckboxes /> component tests', () => {
    let component: RenderResult;

    let getItemSpy: SinonStub;
    let setItemSpy: SinonStub;
    let localStorageMock: Storage;

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
        component.unmount();
        sinon.restore;
    });

    it('should render heading with correct number of checkboxes', () => {
        component = render(
            <GroupedCheckboxes
                title="My grouped checkboxes"
                items={[
                    {
                        children: 'Checkbox 1',
                        value: 'Checkbox 1',
                    },
                    {
                        children: 'Checkbox 2',
                        value: 'Checkbox 2',
                    },
                    {
                        children: 'Checkbox 3',
                        value: 'Checkbox 3',
                    },
                ]}
                name="grouped-checkboxes"
                displayShowHideButton={true}
                shouldTruncateList={false}
            ></GroupedCheckboxes>,
        );

        const legend = component.container.querySelector('legend');
        const checkboxes = component.container.querySelectorAll('input[name="grouped-checkboxes"]');
        const button = component.getByRole('button', { name: 'Hide My grouped checkboxes' });
        const checkboxWrapper = component.queryByTestId('checkbox-wrapper');

        expect(checkboxWrapper).to.exist;
        expect(checkboxWrapper!.className).to.not.include('hidden');
        expect(legend).to.exist;
        expect(legend!.textContent).to.contain('My grouped checkboxes');
        expect(checkboxes.length).to.eql(3);
        expect(button).to.exist;
        expect(button.textContent).to.equal('Hide');
    });

    it('should not render hide button if prop false', () => {
        component = render(
            <GroupedCheckboxes
                title="My grouped checkboxes"
                items={[]}
                name="grouped-checkboxes"
                displayShowHideButton={false}
                shouldTruncateList={false}
            ></GroupedCheckboxes>,
        );

        const button = component.queryByRole('button', { name: 'Hide My grouped checkboxes' });

        expect(button).to.not.exist;
    });

    it('should render Show button and hide component if Hide button pressed', () => {
        component = render(
            <GroupedCheckboxes
                title="My grouped checkboxes"
                items={[]}
                name="grouped-checkboxes"
                displayShowHideButton={true}
                shouldTruncateList={false}
            ></GroupedCheckboxes>,
        );

        const button = component.getByRole('button', { name: 'Hide My grouped checkboxes' });
        fireEvent.click(button);

        const clickedButton = component.getByRole('button', { name: 'Show My grouped checkboxes' });
        const checkboxes = component.queryByTestId('checkbox-wrapper');

        expect(clickedButton.textContent).to.equal('Show');
        expect(checkboxes).to.exist;
        expect(checkboxes!.className).to.include('hidden');
    });

    describe('show Full List', () => {
        const checkboxItemProp: CheckboxesItemProps = {};
        const truncatableCheckboxesItemProps: CheckboxesItemProps[] = [
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
            checkboxItemProp,
        ];

        describe('showFullListButton render', () => {
            it('should not render fullList button if prop false', () => {
                component = render(
                    <GroupedCheckboxes
                        title="My grouped checkboxes"
                        items={truncatableCheckboxesItemProps}
                        name="grouped-checkboxes"
                        displayShowHideButton={false}
                        shouldTruncateList={false}
                    ></GroupedCheckboxes>,
                );

                const button = component.queryByRole('button', { name: 'Show full list My grouped checkboxes' });

                expect(button).to.not.exist;
            });

            it('should not render fullList button if less than 10 items', () => {
                component = render(
                    <GroupedCheckboxes
                        title="My grouped checkboxes"
                        items={[]}
                        name="grouped-checkboxes"
                        displayShowHideButton={false}
                        shouldTruncateList={true}
                    ></GroupedCheckboxes>,
                );

                const button = component.queryByRole('button', { name: 'Show full list My grouped checkboxes' });

                expect(button).to.not.exist;
            });

            it('should render fullList button if valid', () => {
                component = render(
                    <GroupedCheckboxes
                        title="My grouped checkboxes"
                        items={truncatableCheckboxesItemProps}
                        name="grouped-checkboxes"
                        displayShowHideButton={false}
                        shouldTruncateList={true}
                    ></GroupedCheckboxes>,
                );

                const button = component.getByRole('button', { name: 'Show full list My grouped checkboxes' });

                expect(button.textContent).to.equal('Show full list');
            });
        });

        describe('truncate list', () => {
            it('should display truncated list if shouldTruncateList true', () => {
                component = render(
                    <GroupedCheckboxes
                        title="My grouped checkboxes"
                        items={truncatableCheckboxesItemProps}
                        name="grouped-checkboxes"
                        displayShowHideButton={false}
                        shouldTruncateList={true}
                    ></GroupedCheckboxes>,
                );

                const checkboxes = component.container.querySelectorAll('input[name="grouped-checkboxes"]');

                expect(checkboxes.length).to.eql(10);
            });

            it('should display full list if shouldTruncateList false', () => {
                component = render(
                    <GroupedCheckboxes
                        title="My grouped checkboxes"
                        items={truncatableCheckboxesItemProps}
                        name="grouped-checkboxes"
                        displayShowHideButton={false}
                        shouldTruncateList={false}
                    ></GroupedCheckboxes>,
                );

                const checkboxes = component.container.querySelectorAll('input[name="grouped-checkboxes"]');

                expect(checkboxes.length).to.eql(11);
            });

            it('should display full list if show full list button clicked', () => {
                component = render(
                    <GroupedCheckboxes
                        title="My grouped checkboxes"
                        items={truncatableCheckboxesItemProps}
                        name="grouped-checkboxes"
                        displayShowHideButton={false}
                        shouldTruncateList={true}
                    ></GroupedCheckboxes>,
                );

                const button = component.getByRole('button', { name: 'Show full list My grouped checkboxes' });
                fireEvent.click(button);

                const checkboxes = component.container.querySelectorAll('input[name="grouped-checkboxes"]');
                const clickedButton = component.getByRole('button', {
                    name: 'Show reduced list My grouped checkboxes',
                });

                expect(checkboxes.length).to.eql(11);
                expect(clickedButton.textContent).to.equal('Show reduced list');
            });
        });
    });
});
