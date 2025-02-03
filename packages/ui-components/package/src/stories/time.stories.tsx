import React from 'react';
import { storiesOf } from '@storybook/react';
import { Time, TfsTime, toMeridianValue } from '../components';
import { select, boolean, text } from '@storybook/addon-knobs';
import { ValidationResult } from '@ukri-tfs/validation';

const stories = storiesOf('Components', module);

stories.add('Time', () => {
    const labelText = text('Label Text', 'Time');
    const hintText = text('Form hint', 'Examples: 09:00am or 12:00pm');
    const defaultTime: Time = {
        time: text('Default time', '09:00'),
        ampm: toMeridianValue(select('Default AM/PM', ['am', 'pm'], 'am')),
    };
    const setValue: boolean = boolean('Set value?', false);
    const value: Time = {
        time: text('Value time', '12:00'),
        ampm: toMeridianValue(select('Value AM/PM', ['am', 'pm'], 'am')),
    };
    const valid: boolean = boolean('Valid?', true);
    const message: string = text('Message', 'Please enter a valid time');
    const result: ValidationResult = new ValidationResult(null, true, valid, message, '', true, 'openingTime');
    return (
        <TfsTime
            name="openingTime"
            label={labelText}
            hint={hintText}
            defaultTime={defaultTime}
            timeValue={setValue ? value : undefined}
            validation={result}
        />
    );
});
