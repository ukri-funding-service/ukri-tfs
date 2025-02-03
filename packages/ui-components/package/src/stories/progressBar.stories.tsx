import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number } from '@storybook/addon-knobs';

import { ProgressBar } from '../components/index';

const stories = storiesOf('Components', module);

stories.add('Progress bar', () => {
    const percentageComplete = number('Percentage complete', 23);
    const prependedHiddenAccessibiltyText = text('Hidden accessibilty text', 'Your application is');
    const appendedText = text('Appended text', 'Complete');
    return (
        <ProgressBar
            prependedHiddenAccessibilityText={prependedHiddenAccessibiltyText}
            percentComplete={percentageComplete}
            appendedText={appendedText}
            displayPercentage={true}
        />
    );
});
