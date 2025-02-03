import React from 'react';
import { storiesOf } from '@storybook/react';
import { topContent } from '../components/topContent/topContent';
import { ApplicationFilterStatus } from '../enums/enums';
import { ApplicationFilterSideBarProps } from '../components';

const stories = storiesOf('Components', module);

const applicationStatuses = [ApplicationFilterStatus.AwaitingAssessment];
const groups = [
    { name: 'Maths Department', id: 1, applicationCount: 0 },
    { name: 'English Department', id: 2, applicationCount: 0 },
    { name: 'IT Department', id: 3, applicationCount: 0 },
];

const applicationTopContentProps: ApplicationFilterSideBarProps = {
    applicationStatuses: applicationStatuses,
    checkedApplicationStatusFilters: applicationStatuses,
};

stories.add('Top content -  application status', () => <>{topContent(applicationTopContentProps)}</>);

const groupTopContentProps: ApplicationFilterSideBarProps = {
    applicationStatuses: [],
    groups: groups,
    checkedGroups: groups,
};

stories.add('Top content -  groups', () => <>{topContent(groupTopContentProps)}</>);

const combinedTopContentProps: ApplicationFilterSideBarProps = {
    applicationStatuses: applicationStatuses,
    checkedApplicationStatusFilters: applicationStatuses,
    groups: groups,
    checkedGroups: groups,
};

stories.add('Top content -  group and application', () => <>{topContent(combinedTopContentProps)}</>);
