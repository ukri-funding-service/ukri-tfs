import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';

import { RadiosWithConditional } from '../components';
import { RadioButtonProps } from '../components/radioButton';
import { Input } from '../components/govuk-react-jsx';

const stories = storiesOf('Components', module);

stories.add('Radio button with conditional', () => {
    const RadioButtonData: RadioButtonProps[] = [
        {
            name: '',
            text: 'Brie',
            hint: 'Creamy, from France, best when ripe',
            value: 'Brie',
            id: 'brie',
            checked: false,
        },
        {
            name: '',
            text: 'Cheddar',
            hint: 'Comes from Somerset, the king of cheese',
            value: 'Cheddar',
            id: 'cheddar',
            checked: true,
            revealContent: <p>This content is revealed when the item is selected</p>,
        },
        {
            name: '',
            text: 'Gorgonzola',
            hint: 'Smells of feet, an acquired taste',
            value: 'Gorgonzola',
            id: 'gorgonzola',
            checked: false,
            revealContent: <textarea name="test" defaultValue="Some test text" />,
        },
        { name: '', text: 'Stilton', hint: 'Blue cheese, very tasty', value: 'Stilton', id: 'stilton', checked: false },
        {
            name: '',
            text: 'Wensleydale',
            hint: 'Crumbly and mild, from Yorkshire',
            value: 'Wensleydale',
            id: 'wensleydale',
            revealContent: <Input />,
            revealContentClassName: 'govuk-!-width-full',
            checked: false,
        },
        {
            name: '',
            text: 'Gouda',
            hint: "Sweet, creamy, yellow cow's milk cheese originating from the Netherlands",
            value: 'Gouda',
            id: 'gouda',
            checked: false,
            revealContent: <p>This content is positioned below the input parent div</p>,
            revealContentBottom: true,
        },
        {
            name: '',
            text: 'Feta',
            hint: 'Greek brined white cheese',
            value: 'Feta',
            id: 'feta',
            checked: false,
            divider: 'or',
        },
    ];

    return (
        <RadiosWithConditional
            legend={text('Legend', 'Select your absolute favourite cheese')}
            radioGroupName={text('Group name', 'cheese_types')}
            legendSize={select('Legend size', ['xl', 'l', 'm', 's'], 'm')}
            radioData={RadioButtonData}
            radioSize={select('Radio size', ['normal', 'small'], 'normal')}
        />
    );
});

stories.add('Radio button with conditional - error', () => {
    const RadioButtonData: RadioButtonProps[] = [
        {
            name: '',
            text: 'Brie',
            hint: 'Creamy, from France, best when ripe',
            value: 'Brie',
            id: 'brie',
            checked: false,
        },
        {
            name: '',
            text: 'Cheddar',
            hint: 'Comes from Somerset, the king of cheese',
            value: 'Cheddar',
            id: 'cheddar',
            checked: false,
        },
    ];

    return (
        <RadiosWithConditional
            legend={text('Legend', 'Select your absolute favourite cheese')}
            radioGroupName={text('Group name', 'cheese_types')}
            legendSize={select('Legend size', ['xl', 'l', 'm', 's'], 'm')}
            radioData={RadioButtonData}
            radioSize={select('Radio size', ['normal', 'small'], 'normal')}
            errorMessage={{ children: 'Cheese is not optional' }}
        />
    );
});
