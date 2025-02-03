import React from 'react';
import { storiesOf } from '@storybook/react';
import { MarkAsComplete } from '../components/index';

const stories = storiesOf('Components', module);

stories.add('Mark as complete checkbox', () => (
    <MarkAsComplete text={'Mark as complete'} id={'fundersComplete'} value={'fundersComplete'} checked={false} />
));
