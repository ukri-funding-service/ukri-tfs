import { storiesOf } from '@storybook/react';
import React from 'react';
import { CompletionStatus } from '../components/completionStatus';

const stories = storiesOf('Components', module);

stories.add('CompletionStatus (default)', () => {
    return <CompletionStatus />;
});

stories.add('CompletionStatus (complete with default aria label)', () => {
    return <CompletionStatus isComplete={true} />;
});

stories.add('CompletionStatus (incomplete with default aria label)', () => {
    return <CompletionStatus isComplete={false} />;
});

stories.add('CompletionStatus (custom aria label)', () => {
    return <CompletionStatus ariaLabel="This is a custom aria label" />;
});
