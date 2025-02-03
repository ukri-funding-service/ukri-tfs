import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ApplicationFilterStatus } from '../../../../src';
import {
    ApplicationFilterSideBar,
    ApplicationFilterSideBarProps,
} from '../../../../src/components/sideBar/applicationFilterSideBar';
import sinon from 'sinon';
import * as GroupedCheckboxes from '../../../../src/components/groupedCheckboxes';
import React from 'react';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import * as searchFiltersUtils from '../../../../src/utils/searchFilterUtils';
import { CheckboxesItemProps } from 'govuk-react-jsx';

describe('<ApplicationFilterSideBar /> component tests', () => {
    before(() => {
        chai.use(sinonChai);
    });

    afterEach(() => {
        sinon.restore();
    });

    const defaultProps: ApplicationFilterSideBarProps = {
        csrfToken: 'some-csrf-token',
        applicationStatuses: [ApplicationFilterStatus.InDraft, ApplicationFilterStatus.ForSubmission],
        groups: [{ name: 'some-name', id: 4, applicationCount: 0 }],
        nonDefaultGroupsExist: true,
    };

    it('should render the sidebar', () => {
        const sideBar = render(ApplicationFilterSideBar(defaultProps));

        expect(sideBar.queryByText('Filter by status')).to.exist;
        expect(sideBar.queryByText('Apply filters')).to.exist;
        expect(sideBar.queryByRole('button', { name: 'Clear filter' })).not.to.exist;
    });

    it('should render search hint', () => {
        const sideBar = render(
            ApplicationFilterSideBar({
                ...defaultProps,
                checkedApplicationStatusFilters: [
                    ApplicationFilterStatus.MissedDeadline,
                    ApplicationFilterStatus.Submitted,
                ],
                searchHint: 'search hint text',
            }),
        );

        expect(sideBar.queryByText('search hint text')).to.exist;
    });

    describe('clear filters', () => {
        it('should display clear filter if it has an application status filter list of 1', () => {
            const sideBar = render(
                ApplicationFilterSideBar({
                    ...defaultProps,
                    checkedApplicationStatusFilters: [ApplicationFilterStatus.MissedDeadline],
                }),
            );

            expect(sideBar.queryByText('Clear filter')).to.exist;
            expect(sideBar.queryByText('Clear filters')).to.not.exist;
        });

        it('should display clear filter if it has an application group filter list of 1', () => {
            const sideBar = render(
                ApplicationFilterSideBar({
                    ...defaultProps,
                    checkedGroups: [{ name: 'group-name', id: 3, applicationCount: 0 }],
                }),
            );

            expect(sideBar.queryByText('Clear filter')).to.exist;
            expect(sideBar.queryByText('Clear filters')).to.not.exist;
        });

        it('should display clear filters if it has an application status filter list of more than 1', () => {
            const sideBar = render(
                ApplicationFilterSideBar({
                    ...defaultProps,
                    checkedApplicationStatusFilters: [
                        ApplicationFilterStatus.MissedDeadline,
                        ApplicationFilterStatus.Submitted,
                    ],
                }),
            );

            expect(sideBar.queryByText('Clear filters')).to.exist;
            expect(sideBar.queryByText('Clear filter')).to.not.exist;
        });

        it('should display clear filters if it has a checked groups filter list of more than 1', () => {
            const sideBar = render(
                ApplicationFilterSideBar({
                    ...defaultProps,
                    checkedGroups: [
                        { name: 'group-name', id: 3, applicationCount: 0 },
                        { name: 'group-other-name', id: 5, applicationCount: 0 },
                    ],
                }),
            );

            expect(sideBar.queryByText('Clear filters')).to.exist;
            expect(sideBar.queryByText('Clear filter')).to.not.exist;
        });

        it('should display clear filters if it has a filter list from application status and checked groups', () => {
            const sideBar = render(
                ApplicationFilterSideBar({
                    ...defaultProps,
                    checkedApplicationStatusFilters: [ApplicationFilterStatus.MissedDeadline],
                    checkedGroups: [{ name: 'group-name', id: 3, applicationCount: 0 }],
                }),
            );

            expect(sideBar.queryByText('Clear filters')).to.exist;
            expect(sideBar.queryByText('Clear filter')).to.not.exist;
        });

        it('should not display clear filter if application status filter and checkedGroups is empty', () => {
            const sideBar = render(
                ApplicationFilterSideBar({
                    ...defaultProps,
                    checkedApplicationStatusFilters: [],
                    checkedGroups: [],
                }),
            );

            expect(sideBar.queryByText('Clear filter')).to.not.exist;
            expect(sideBar.queryByText('Clear filters')).to.not.exist;
        });

        it('should not display clear filter if neither application status filter and checkedGroups is passed in', () => {
            const sideBar = render(
                ApplicationFilterSideBar({
                    ...defaultProps,
                }),
            );

            expect(sideBar.queryByText('Clear filter')).to.not.exist;
            expect(sideBar.queryByText('Clear filters')).to.not.exist;
        });
    });

    describe('checkboxes', () => {
        let groupedCheckboxes: sinon.SinonStub<[props: GroupedCheckboxes.GroupedCheckboxesProps], JSX.Element>;
        const mockedCheckboxItems: CheckboxesItemProps[] = [{ children: 'some-checkbox' }];

        beforeEach(() => {
            groupedCheckboxes = sinon.stub(GroupedCheckboxes, 'GroupedCheckboxes').returns(<></>);
        });

        it('should display application status filter checkboxes', () => {
            const getApplicationStatusFilterCheckboxItems = sinon
                .stub(searchFiltersUtils, 'getApplicationStatusFilterCheckboxItems')
                .returns(mockedCheckboxItems);

            render(ApplicationFilterSideBar(defaultProps));
            expect(groupedCheckboxes).to.be.calledWith(sinon.match({ items: mockedCheckboxItems }));
            expect(getApplicationStatusFilterCheckboxItems).calledWith(
                [ApplicationFilterStatus.InDraft, ApplicationFilterStatus.ForSubmission],
                sinon.match.any,
            );
        });

        it('should display group filter checkboxes if non-default groups exist', () => {
            const getGroupFilterCheckboxItems = sinon
                .stub(searchFiltersUtils, 'getGroupFilterCheckboxItems')
                .returns(mockedCheckboxItems);

            render(ApplicationFilterSideBar(defaultProps));

            expect(groupedCheckboxes).to.be.calledWith(sinon.match({ items: mockedCheckboxItems }));
            expect(getGroupFilterCheckboxItems).calledWith(defaultProps.groups);
        });

        it('should not display group filter checkboxes if nonDefaultGroupsExist is false', () => {
            const getGroupFilterCheckboxItems = sinon
                .stub(searchFiltersUtils, 'getGroupFilterCheckboxItems')
                .returns(mockedCheckboxItems);

            render(ApplicationFilterSideBar({ ...defaultProps, nonDefaultGroupsExist: false }));

            expect(groupedCheckboxes).not.to.be.calledWith(sinon.match({ items: mockedCheckboxItems }));
            expect(getGroupFilterCheckboxItems).not.calledWith(defaultProps.groups);
        });
    });
});
