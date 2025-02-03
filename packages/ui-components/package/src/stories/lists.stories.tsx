import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs';
import { OL, PlainList, UL } from '../components';

const stories = storiesOf('Components - Lists', module);

stories.add('Unordered list masldkmasdlkm', () => (
    <UL extraSpacing={boolean('extraSpacing', false)}>
        <li>{text('item-1', 'text lkasmdlkminside my list')}</li>
        <li>{text('item-2', 'text inside my list')}</li>
        <li>{text('item-3', 'text inside my list')}</li>
    </UL>
));

stories.add('Ordered list', () => (
    <OL extraSpacing={boolean('extraSpacing', false)}>
        <li>{text('item-1', 'text inside my list')}</li>
        <li>{text('item-2', 'text inside my list')}</li>
        <li>{text('item-3', 'text inside my list')}</li>
    </OL>
));

stories.add('Plain list', () => (
    <PlainList extraSpacing={boolean('extraSpacing', false)}>
        <li>{text('item-1', 'text inside my list')}</li>
        <li>{text('item-2', 'text inside my list')}</li>
        <li>{text('item-3', 'text inside my list')}</li>
    </PlainList>
));
