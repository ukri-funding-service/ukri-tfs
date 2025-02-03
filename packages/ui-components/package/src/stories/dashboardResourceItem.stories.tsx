import { storiesOf } from '@storybook/react';
import React from 'react';
import { DashboardResourceItem, DashboardResourceItemProps } from '../components';

const stories = storiesOf('Components', module);

const item: DashboardResourceItemProps = {
    ariaLabel: 'Go to Application',
    link: '#',
    numberOfItems: 3,
    title: 'Applications',
    footer: 'In Progress',
    id: 'applications-tile',
};

stories.add('DashboardResourceItem', () => <DashboardResourceItem items={[item]} />);
