import { render, screen } from '@testing-library/react';
import React from 'react';
import { ApplicationFilterSideBarProps, ApplicationFilterStatus, GroupFilter, topContent } from '../../../../src';
import { expect } from 'chai';

describe('top content', () => {
    it('should have application status heading', () => {
        const topContentProps: ApplicationFilterSideBarProps = {
            applicationStatuses: [ApplicationFilterStatus.AwaitingAssessment],
            checkedApplicationStatusFilters: [ApplicationFilterStatus.AwaitingAssessment],
        };
        render(<>{topContent(topContentProps)}</>);

        const title = screen.queryByTestId('filter-summary');
        expect(title?.textContent).to.equal("0 applications with a status of 'Awaiting Assessment'");
    });

    describe('groups', () => {
        const exampleGroup: GroupFilter = { name: 'some-group', id: 1, applicationCount: 0 };
        const exampleGroup2: GroupFilter = { name: 'some-group-2', id: 2, applicationCount: 0 };
        const exampleGroup3: GroupFilter = { name: 'some-group-3', id: 3, applicationCount: 0 };

        it('should have group heading', () => {
            const topContentProps: ApplicationFilterSideBarProps = {
                applicationStatuses: [],
                groups: [exampleGroup],
                checkedGroups: [exampleGroup],
            };

            render(<>{topContent(topContentProps)}</>);

            const title = screen.queryByTestId('filter-summary');
            expect(title?.textContent).to.equal("0 applications in the group 'some-group'");
        });

        it('should have multiple groups heading', () => {
            const topContentProps: ApplicationFilterSideBarProps = {
                applicationStatuses: [],
                groups: [exampleGroup, exampleGroup2, exampleGroup3],
                checkedGroups: [exampleGroup, exampleGroup2, exampleGroup3],
            };

            render(<>{topContent(topContentProps)}</>);

            const title = screen.queryByTestId('filter-summary');
            expect(title?.textContent).to.equal(
                "0 applications in the groups 'some-group', 'some-group-2' or 'some-group-3'",
            );
        });
    });

    it('should have application status and group heading', () => {
        const exampleGroup: GroupFilter = { name: 'some-group', id: 1, applicationCount: 0 };

        const topContentProps: ApplicationFilterSideBarProps = {
            applicationStatuses: [ApplicationFilterStatus.AwaitingAssessment],
            checkedApplicationStatusFilters: [ApplicationFilterStatus.AwaitingAssessment],
            groups: [exampleGroup],
            checkedGroups: [exampleGroup],
        };

        render(<>{topContent(topContentProps)}</>);

        const title = screen.queryByTestId('filter-summary');
        expect(title?.textContent).to.equal(
            "0 applications with a status of 'Awaiting Assessment' and in the group 'some-group'",
        );
    });
});
