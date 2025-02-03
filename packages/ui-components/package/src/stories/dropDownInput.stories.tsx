import { storiesOf } from '@storybook/react';
import React from 'react';
import { DropDownInput } from '../components/dropDownInput';

const stories = storiesOf('Components', module);

stories.add('DropDownInput', () => {
    const title = 'Drop Down Input Component';

    const options = [
        { value: 'option1', displayValue: 'Option 1' },
        { value: 'option2', displayValue: 'Option 2' },
        { value: 'option3', displayValue: 'Option 3' },
    ];

    return <DropDownInput title={title} name={'storyDropDown'} options={options} />;
});
