import { boolean, date, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import moment from 'moment';
import React from 'react';

import { ValidationResult } from '@ukri-tfs/validation';
import { TfsDatePicker } from '../components/tfsDatePicker';

const stories = storiesOf('Components', module);

stories.add('Date', () => {
    const label: string = text('Label Text', 'Date');
    const hint: string = text('Form hint', 'Format: DD/MM/YYYY');
    const value: string = text('Enter a date', '01/01/2020');
    const valid: boolean = boolean('Valid?', true);
    const message: string = text('Message', 'Enter a valid date');

    const result: ValidationResult = new ValidationResult(
        null,
        true,
        valid,
        valid ? '' : message,
        '',
        true,
        'openingTime',
    );

    return (
        <TfsDatePicker
            name="openingDate"
            label={label}
            hint={hint}
            value={value}
            validation={result}
            container={() => document.getElementById('storybook-preview-wrapper')!}
            formatDateInput={(dateToFormat: Date) =>
                moment(dateToFormat).format(text('Enter a date format', 'DD/MM/YYYY'))
            }
            formatMonthDropdown={(dateToFormat: Date) =>
                moment(dateToFormat).format(text('Enter a month dropdown format', 'MMMM YYYY'))
            }
            minDate={new Date(date('Minimum selectable date', new Date('2019-01-01')))}
            maxDate={new Date(date('Maximum selectable date', new Date('2020-12-31')))}
        />
    );
});
