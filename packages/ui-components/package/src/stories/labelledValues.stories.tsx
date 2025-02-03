import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { LabelledValues } from '../components/labelledValues';
import '../styles.scss';

const stories = storiesOf('Components', module);

stories.add('LabelledValues', () => {
    return (
        <LabelledValues
            labelledValues={[
                { label: text('labelNameOne', 'labelValueOne'), value: text('columnLabelOne', 'columnValueOne') },
                { label: text('labelNameTwo', 'labelValueTwo'), value: text('columnLabelTwo', 'columnValueTwo') },
                {
                    label: text('labelNameThree', 'labelValueThree'),
                    value: text('columnLabelThree', 'columnValueThree'),
                },
            ]}
        />
    );
});
