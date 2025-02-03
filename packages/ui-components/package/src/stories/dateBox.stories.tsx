import { storiesOf } from '@storybook/react';
import React from 'react';
import { TfsDatePicker } from '../components/index';
import moment from 'moment';
import '../styles.scss';

const stories = storiesOf('Components', module);
const dateHint = 'DD/MM/YYYY';
const monthNameHint = 'MMMM YYYY';
const dateFormat = (date: Date) => moment(date).format(dateHint);
const monthSelectFormat = (date: Date) => moment(date).format(monthNameHint);
const maxDate = new Date();
maxDate.setDate(30);
stories.add('Datebox', () => (
    <TfsDatePicker
        label={'Date'}
        name="openingDate"
        hint={'Date picker hint'}
        value={''}
        formatDateInput={dateFormat}
        formatMonthDropdown={monthSelectFormat}
    />
));
