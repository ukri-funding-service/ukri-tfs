import { storiesOf } from '@storybook/react';
import React from 'react';
import { GdsTypeAhead } from '../components/index';
import { invalidValidationResult } from './util/ExampleValidationResults';
const stories = storiesOf('Components', module);

stories.add('GdsTypeAhead', () => (
    <GdsTypeAhead
        id="select-1"
        items={[
            {
                children: '',
                value: '',
                hidden: true,
            },
            {
                children: 'alpha',
                value: '1',
            },
            {
                children: 'beta',
                value: '2',
            },
        ]}
        name="select-1"
        defaultValue=""
    />
));

stories.add('InvalidGdsTypeAhead', () => (
    <GdsTypeAhead
        validation={invalidValidationResult}
        id="select-1"
        items={[
            {
                children: '',
                value: '',
                hidden: true,
            },
            {
                children: 'alpha',
                value: '1',
            },
            {
                children: 'beta',
                value: '2',
            },
        ]}
        name="select-1"
        defaultValue=""
    />
));
