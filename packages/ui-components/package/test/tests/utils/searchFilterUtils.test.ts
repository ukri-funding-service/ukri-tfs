import {
    generateClearSearchText,
    getApplicationStatusFilterCheckboxItems,
    getGroupFilterCheckboxItems,
} from '../../../src/utils/searchFilterUtils';
import { ApplicationFilterSideBarProps, ApplicationFilterStatus, GroupFilter } from '../../../src';
import sinon from 'sinon';
import { expect } from 'chai';

describe('searchFilterUtils', () => {
    describe('getApplicationStatusFilterCheckboxItems', () => {
        const defaultApplicationStatuses: ApplicationFilterStatus[] = [
            ApplicationFilterStatus.InDraft,
            ApplicationFilterStatus.ForSubmission,
        ];

        it('should return a list of unchecked checkboxItemProps when passed an empty array of filters', () => {
            const checkboxItemProps = getApplicationStatusFilterCheckboxItems(defaultApplicationStatuses, []);

            sinon.assert.match(checkboxItemProps, [
                sinon.match({ value: ApplicationFilterStatus.InDraft, defaultChecked: false }),
                sinon.match({ value: ApplicationFilterStatus.ForSubmission, defaultChecked: false }),
            ]);
        });

        it('should return a list of checked and unchecked checkboxItemProps', () => {
            const checkedApplicationStatusFilters = [
                ApplicationFilterStatus.InDraft,
                ApplicationFilterStatus.Submitted,
            ];

            const checkboxItemProps = getApplicationStatusFilterCheckboxItems(
                [...defaultApplicationStatuses, ApplicationFilterStatus.Submitted],
                checkedApplicationStatusFilters,
            );

            sinon.assert.match(checkboxItemProps, [
                sinon.match({ value: ApplicationFilterStatus.InDraft, defaultChecked: true }),
                sinon.match({ value: ApplicationFilterStatus.ForSubmission, defaultChecked: false }),
                sinon.match({ value: ApplicationFilterStatus.Submitted, defaultChecked: true }),
            ]);
        });

        it('should return all application filter status checkbox items', () => {
            const checkboxItemProps = getApplicationStatusFilterCheckboxItems(defaultApplicationStatuses, []);
            sinon.assert.match(checkboxItemProps, [
                sinon.match({ value: ApplicationFilterStatus.InDraft, 'aria-label': 'Filter by In Draft' }),
                sinon.match({ value: ApplicationFilterStatus.ForSubmission, 'aria-label': 'Filter by For Submission' }),
            ]);
        });
    });

    describe('getGroupFilterCheckboxItems', () => {
        const defaultGroups: GroupFilter[] = [
            { name: 'some-group-name', id: 1, applicationCount: 0 },
            { name: 'some-group-name-2', id: 2, applicationCount: 0 },
        ];
        it('should return a list of unchecked checkboxItemProps when passed an empty array of filters', () => {
            const checkboxItemProps = getGroupFilterCheckboxItems(defaultGroups, []);

            sinon.assert.match(checkboxItemProps, [
                sinon.match({ value: 1, defaultChecked: false, 'aria-label': 'Filter by group some-group-name' }),
                sinon.match({ value: 2, defaultChecked: false, 'aria-label': 'Filter by group some-group-name-2' }),
            ]);
        });

        it('should return a list of checked and unchecked checkboxItemProps', () => {
            const checkedGroupFilters = [
                { name: 'some-group-name', id: 1, applicationCount: 0 },
                { name: 'some-group-name-3', id: 3, applicationCount: 0 },
            ];

            const checkboxItemProps = getGroupFilterCheckboxItems(
                [...defaultGroups, { name: 'some-group-name-3', id: 3, applicationCount: 0 }],
                checkedGroupFilters,
            );

            sinon.assert.match(checkboxItemProps, [
                sinon.match({ value: 1, defaultChecked: true }),
                sinon.match({ value: 2, defaultChecked: false }),
                sinon.match({ value: 3, defaultChecked: true }),
            ]);
        });

        it('should return a list of checkboxItemProps with correct name and application count', () => {
            const checkboxItemProps = getGroupFilterCheckboxItems(
                [
                    ...defaultGroups,
                    { name: 'some-group-name-3', id: 3, applicationCount: 6 },
                    { name: 'some-group-name-4', id: 4, applicationCount: 100 },
                ],
                [],
            );

            sinon.assert.match(checkboxItemProps, [
                sinon.match({ value: 1, defaultChecked: false, children: 'some-group-name (0)' }),
                sinon.match({ value: 2, defaultChecked: false, children: 'some-group-name-2 (0)' }),
                sinon.match({ value: 3, defaultChecked: false, children: 'some-group-name-3 (6)' }),
                sinon.match({ value: 4, defaultChecked: false, children: 'some-group-name-4 (100)' }),
            ]);
        });
    });

    describe('generateClearSearchText', () => {
        const defaultProps: ApplicationFilterSideBarProps = {
            applicationStatuses: [],
        };

        const group: GroupFilter = { name: 'some-name', id: 2, applicationCount: 0 };

        it('should say clear search when no filters present', () => {
            const result = generateClearSearchText(defaultProps);

            expect(result).to.equal('Clear search');
        });

        it('should say clear search and filter when application filter present', () => {
            const result = generateClearSearchText({
                ...defaultProps,
                checkedApplicationStatusFilters: [ApplicationFilterStatus.AwaitingAssessment],
            });

            expect(result).to.equal('Clear search and filter');
        });

        it('should say clear search and filters when application filters present', () => {
            const result = generateClearSearchText({
                ...defaultProps,
                checkedApplicationStatusFilters: [
                    ApplicationFilterStatus.AwaitingAssessment,
                    ApplicationFilterStatus.ForSubmission,
                ],
            });

            expect(result).to.equal('Clear search and filters');
        });

        it('should say clear search and filter when group filter present', () => {
            const result = generateClearSearchText({
                ...defaultProps,
                groups: [group],
                checkedGroups: [group],
            });

            expect(result).to.equal('Clear search and filter');
        });

        it('should say clear search and filters when group filters present', () => {
            const result = generateClearSearchText({
                ...defaultProps,
                groups: [group, group],
                checkedGroups: [group, group],
            });

            expect(result).to.equal('Clear search and filters');
        });

        it('should say clear search and filters when group and application filter present', () => {
            const result = generateClearSearchText({
                ...defaultProps,
                checkedApplicationStatusFilters: [ApplicationFilterStatus.AwaitingAssessment],
                groups: [group],
                checkedGroups: [group],
            });

            expect(result).to.equal('Clear search and filters');
        });
    });
});
