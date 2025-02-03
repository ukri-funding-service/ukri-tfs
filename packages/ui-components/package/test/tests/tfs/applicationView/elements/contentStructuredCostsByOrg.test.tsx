import { GetByBoundAttribute, render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon, { SinonFakeTimers } from 'sinon';
import { StaffCost } from '../../../../../src';
import {
    getStaffNameByStaffCost,
    recursiveFlattenedOpportunityCostPolicyCategoryTree,
    RoleDictionary,
    StaffDictionary,
} from '../../../../../src/helpers/structuredResourcesAndCosts';
import { TfsApplicationStructuredCostsByOrgSection } from '../../../../../src/tfs/applicationView/elements/contentStructuredResourcesAndCostByOrg';
import { structuredCosts } from '../../../factories/StructuredCostSection';

describe('<TfsApplicationStructuredCostsByOrgSection /> component tests', () => {
    let clock: SinonFakeTimers;
    const currentDate = new Date(Date.parse('04 Dec 1995 00:12:00 GMT'));

    describe('Render component', () => {
        let wrapper: RenderResult;

        beforeEach(() => {
            clock = sinon.useFakeTimers(currentDate);
            wrapper = render(
                <TfsApplicationStructuredCostsByOrgSection id="test-section" structuredCosts={structuredCosts} />,
            );
        });

        afterEach(() => {
            wrapper.unmount();
            clock.restore();
        });

        it('should mount the component', () => {
            expect(wrapper.container.textContent).to.contain('University of Birmingham');
            expect(wrapper.container.textContent).to.contain('Abertay University');
        });

        it('should contain all the table headings', () => {
            expect(wrapper.container.textContent).to.contain('Category');
            expect(wrapper.container.textContent).to.contain('Role');
            expect(wrapper.container.textContent).to.contain('% FTE');
            expect(wrapper.container.textContent).to.contain('Average hrs pw');
            expect(wrapper.container.textContent).to.contain('Start date');
            expect(wrapper.container.textContent).to.contain('End date');
            expect(wrapper.container.textContent).to.contain('Full economic cost (fEC)');
            expect(wrapper.container.textContent).to.contain('% of fEC');
            expect(wrapper.container.textContent).to.contain('Applied for');
        });

        it('should contain all the table row categories', function () {
            expect(wrapper.container.textContent).to.contain('Directly allocated');
            expect(wrapper.container.textContent).to.contain('Directly incurred');
            expect(wrapper.container.textContent).to.contain('Indirect');
            expect(wrapper.container.textContent).to.contain('Exceptions');
        });

        it('should contain all the table row child categories', function () {
            expect(wrapper.container.textContent).to.contain('Staff');
            expect(wrapper.container.textContent).to.contain('Estates');
            expect(wrapper.container.textContent).to.contain('Other');

            expect(wrapper.container.textContent).to.contain('Travel and subsistence');
            expect(wrapper.container.textContent).to.contain('Equipment');
            expect(wrapper.container.textContent).to.contain('Other');
        });

        it('should contain all the staff members', function () {
            expect(wrapper.container.textContent).to.contain('The unnamed student');
            expect(wrapper.container.textContent).to.contain('Tim Berners-Lee');
            expect(wrapper.container.textContent).to.contain('Han Solo');
            expect(wrapper.container.textContent).to.contain('UI Smoke');
        });

        describe('tests per organisation', function () {
            let universityOfBirmingham: ReturnType<GetByBoundAttribute<HTMLElement>>;

            beforeEach(function () {
                universityOfBirmingham = wrapper.getByTestId(`org-1`);
            });

            it('should contain the staff members for specific org', function () {
                expect(universityOfBirmingham.textContent).to.contain('UI Smoke');
                expect(universityOfBirmingham.textContent).to.contain('Tim Berners-Lee');
                expect(universityOfBirmingham.textContent).to.contain('The unnamed student');
                expect(universityOfBirmingham.textContent).not.to.contain('Han Solo');
            });

            it('should contain the staff data given there is a staff member', function () {
                expect(universityOfBirmingham.textContent).to.contain('UI Smoke');
                expect(universityOfBirmingham.textContent).to.contain('Project lead');
            });

            it('should contain the staff data given there is an unnamed staff member', function () {
                expect(universityOfBirmingham.textContent).to.contain('The unnamed student');
                expect(universityOfBirmingham.textContent).to.contain('Doctoral student');
            });

            // TODO: Create a test case when an applicant has no staff costs associated with them
            it('should show applicants that currently have no staff costs associated with them', function () {
                expect(true).to.be.true;
            });
        });

        it('should give the correct user columns for staff rows', function () {
            const staffRow = wrapper.getByTestId(`organisation-table-row-3-1-staff`);
            expect(staffRow.querySelector('.organisation-table-category')?.textContent).to.equal(
                'Exceptions StaffThe unnamed student',
            );
            expect(staffRow.querySelector('.organisation-table-role')?.textContent).to.equal('Doctoral student');
            expect(staffRow.querySelector('.organisation-table-average-hours-pw')?.textContent).to.equal('25.125');
            expect(staffRow.querySelector('.organisation-table-fte')?.textContent).to.equal('67%');
            expect(staffRow.querySelector('.organisation-table-start')?.textContent).to.equal('01/08/2023');
            expect(staffRow.querySelector('.organisation-table-end')?.textContent).to.equal('30/09/2023');
            expect(staffRow.querySelector('.organisation-table-full-cost')?.textContent).to.equal('£6,706');
            expect(staffRow.querySelector('.organisation-table-percentage-fte')?.textContent).to.equal('100%');
            expect(staffRow.querySelector('.organisation-table-applied-for')?.textContent).to.equal('£6,706.00');
        });

        it('should give the correct user columns for second level category rows', function () {
            const staffRow = wrapper.getByTestId(`organisation-table-row-1366-1`);
            expect(staffRow.querySelector('.organisation-table-category')?.textContent).to.equal(
                'Directly allocatedEstates',
            );
            expect(staffRow.querySelector('.organisation-table-role')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-average-hours-pw')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-fte')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-start')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-end')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-full-cost')?.textContent).to.equal('£200,008');
            expect(staffRow.querySelector('.organisation-table-percentage-fte')?.textContent).to.equal('80%');
            expect(staffRow.querySelector('.organisation-table-applied-for')?.textContent).to.equal('£160,006.40');
        });

        it('should give the correct user columns for first level category rows', function () {
            const staffRow = wrapper.getByTestId(`organisation-table-row-1362-1`);
            expect(staffRow.querySelector('.organisation-table-category')?.textContent).to.equal('Directly incurred');
            expect(staffRow.querySelector('.organisation-table-role')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-average-hours-pw')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-fte')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-start')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-end')?.textContent).to.equal('');
            expect(staffRow.querySelector('.organisation-table-full-cost')?.textContent).to.equal('£2,532,664');
            expect(staffRow.querySelector('.organisation-table-percentage-fte')?.textContent).to.equal('80%');
            expect(staffRow.querySelector('.organisation-table-applied-for')?.textContent).to.equal('£2,026,131.20');
        });

        it('should give the correct user columns given first level category rows do not have total', function () {
            const staffRow = wrapper.getByTestId(`organisation-table-row-1362-339`);
            expect(staffRow.querySelector('.organisation-table-full-cost')?.textContent).to.equal('-');
            expect(staffRow.querySelector('.organisation-table-percentage-fte')?.textContent).to.equal('80%');
            expect(staffRow.querySelector('.organisation-table-applied-for')?.textContent).to.equal('-');
        });

        it('should calculate the total per organisation correctly', function () {
            const abertayOrganisationTotalElement = wrapper.getByTestId('organisation-table-total-339');
            const birminghamOrganisationTotalElement = wrapper.getByTestId('organisation-table-total-1');

            expect(abertayOrganisationTotalElement.textContent).to.contain(
                'Total applied for: Abertay University£8,000',
            );
            expect(birminghamOrganisationTotalElement.textContent).to.contain(
                'Total applied for: University of Birmingham£3,007,053',
            );
        });

        it('should calculate the total for all organisations', function () {
            const applicationTotaltext = wrapper.getByTestId('application-table-total-text');
            const applicationTotalValue = wrapper.getByTestId('application-table-total-value');

            expect(applicationTotaltext.textContent).to.equal('Total applied for: All organisations');
            expect(applicationTotalValue.textContent).to.equal('£3,015,053.20');
        });
    });

    describe('recursiveFlattenedOpportunityCostPolicyCategoryTree', () => {
        it('should correctly flatten an opp cost policy category tree', function () {
            const categoryTree = {
                id: 1361,
                name: 'Directly allocated',
                sequence: 1,
                percentageValue: 80,
                children: [
                    {
                        id: 1365,
                        name: 'Staff',
                        sequence: 1,
                        percentageValue: 80,
                        children: [
                            {
                                id: 1368,
                                name: 'Child of staff',
                                sequence: 1,
                                percentageValue: 80,
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 1366,
                        name: 'Estates',
                        sequence: 2,
                        percentageValue: 80,
                        children: [],
                    },
                    {
                        id: 1367,
                        name: 'Other',
                        sequence: 3,
                        percentageValue: 80,
                        children: [],
                    },
                ],
            };
            const staffCosts: StaffCost[] = [
                {
                    applicationCostId: 68,
                    applicationPersonId: 3,
                    endDate: new Date(),
                    ftePercentage: 80,
                    fullEconomicCostPence: 1000,
                    id: 12,
                    opportunityCostCategoryId: 1365,
                    startDate: new Date(),
                    unnamedRoleId: 4,
                },
            ];

            const flattenedTree = recursiveFlattenedOpportunityCostPolicyCategoryTree(categoryTree, staffCosts);
            expect(flattenedTree[0].name).to.equal('Directly allocated');
            expect(flattenedTree[0].level).to.equal(0);
            expect(flattenedTree[0].isLastChildOfParent).to.equal(false);
            expect(flattenedTree[1].name).to.equal('Staff');
            expect(flattenedTree[1].level).to.equal(1);
            expect(flattenedTree[1].isLastChildOfParent).to.equal(false);
            expect(flattenedTree[2].name).to.equal(undefined);
            expect(flattenedTree[2].level).to.equal(2);
            expect(flattenedTree[2].sequence).to.equal(1);
            expect(flattenedTree[2].percentageValue).to.equal(80);
            expect(flattenedTree[3].name).to.equal('Child of staff');
            expect(flattenedTree[3].level).to.equal(2);
            expect(flattenedTree[3].isLastChildOfParent).to.equal(true);
            expect(flattenedTree[4].name).to.equal('Estates');
            expect(flattenedTree[4].level).to.equal(1);
            expect(flattenedTree[5].name).to.equal('Other');
            expect(flattenedTree[5].level).to.equal(1);
            expect(flattenedTree[5].isLastChildOfParent).to.equal(true);
            expect(flattenedTree.length).to.equal(6);
        });
    });

    describe('getStaffById', function () {
        let staffDictionary: StaffDictionary;
        let roleDictionary: RoleDictionary;

        beforeEach(function () {
            staffDictionary = {
                ['1000168']: {
                    id: 2,
                    applicationPersonId: 1000168,
                    organisationId: 1,
                    name: 'UI Smoke',
                    email: 'UI-smoketest@mmfdxrv3.mailosaur.net',
                    role: 'Project lead',
                    organisationName: 'University of Birmingham',
                },
            };
            roleDictionary = {
                ['4']: { id: 4, name: 'Researcher' },
            };
        });

        it('should correctly return the name of staff if staff is named', function () {
            const staffCost: StaffCost = {
                applicationCostId: 1,
                applicationPersonId: 1000168,
                endDate: undefined,
                ftePercentage: 0,
                fullEconomicCostPence: 0,
                id: 1,
                opportunityCostCategoryId: 1,
                startDate: undefined,
            };

            const staffResult = getStaffNameByStaffCost(staffCost, staffDictionary, roleDictionary);

            expect(staffResult).to.equal('UI Smoke');
        });

        it('should correctly return the name of staff if staff is unnamed with label', function () {
            const staffCost: StaffCost = {
                applicationCostId: 1,
                unnamedLabel: 'Jabba the Hut',
                unnamedRoleId: 4,
                endDate: undefined,
                ftePercentage: 0,
                fullEconomicCostPence: 0,
                id: 1,
                opportunityCostCategoryId: 1,
                startDate: undefined,
            };

            const staffResult = getStaffNameByStaffCost(staffCost, staffDictionary, roleDictionary);

            expect(staffResult).to.equal('Jabba the Hut');
        });

        it('should correctly return the name of staff if staff is unnamed without label', function () {
            const staffCost: StaffCost = {
                applicationCostId: 1,
                unnamedRoleId: 4,
                endDate: undefined,
                ftePercentage: 0,
                fullEconomicCostPence: 0,
                id: 1,
                opportunityCostCategoryId: 1,
                startDate: undefined,
            };

            const staffResult = getStaffNameByStaffCost(staffCost, staffDictionary, roleDictionary);

            expect(staffResult).to.equal('Researcher');
        });
    });
});
