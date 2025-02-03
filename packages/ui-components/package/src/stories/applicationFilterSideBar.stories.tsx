import React from 'react';
import { storiesOf } from '@storybook/react';
import { ApplicationFilterSideBar } from '../components/sideBar/applicationFilterSideBar';
import { ApplicationFilterStatus } from '../enums/enums';

const stories = storiesOf('Components', module);

stories.add('Application Filter Side Bar - without groups', () => (
    <ApplicationFilterSideBar
        applicationStatuses={[
            ApplicationFilterStatus.AwaitingAssessment,
            ApplicationFilterStatus.Submitted,
            ApplicationFilterStatus.ForSubmission,
        ]}
        checkedApplicationStatusFilters={[ApplicationFilterStatus.ForSubmission]}
        csrfToken="some-token"
    />
));

stories.add('Application Filter Side Bar - with groups', () => (
    <ApplicationFilterSideBar
        applicationStatuses={[
            ApplicationFilterStatus.AwaitingAssessment,
            ApplicationFilterStatus.Submitted,
            ApplicationFilterStatus.ForSubmission,
        ]}
        nonDefaultGroupsExist={true}
        showFilterHideButtons={true}
        checkedApplicationStatusFilters={[ApplicationFilterStatus.Submitted, ApplicationFilterStatus.ForSubmission]}
        groups={[
            { name: 'Group 1', id: 1, applicationCount: 5 },
            { name: 'Group 4', id: 4, applicationCount: 4 },
            { name: 'Group 1030', id: 1030, applicationCount: 0 },
            { name: 'Group 1', id: 1, applicationCount: 5 },
            { name: 'Group 4', id: 4, applicationCount: 4 },
            { name: 'Group 1030', id: 1030, applicationCount: 0 },
            { name: 'Group 1', id: 1, applicationCount: 5 },
            { name: 'Group 4', id: 4, applicationCount: 4 },
            { name: 'Group 1030', id: 1030, applicationCount: 0 },
            { name: 'Group 1', id: 1, applicationCount: 5 },
            { name: 'Group 4', id: 4, applicationCount: 4 },
            { name: 'Group 1030', id: 1030, applicationCount: 0 },
            { name: 'Group 1030', id: 1030, applicationCount: 0 },
        ]}
        checkedGroups={[{ name: 'Group 4', id: 4, applicationCount: 0 }]}
        csrfToken="some-token"
        shouldTruncateGroupFilter={true}
    />
));
