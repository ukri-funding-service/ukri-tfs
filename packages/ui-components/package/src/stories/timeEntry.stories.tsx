import { storiesOf } from '@storybook/react';
import React from 'react';
import { TimeEntry } from '../components';

const stories = storiesOf('Components', module);

stories.add('TimeEntry', () => {
    return <TimeEntry name="timeEntry" label="" />;
});
