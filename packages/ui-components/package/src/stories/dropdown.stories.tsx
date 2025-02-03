import { storiesOf } from '@storybook/react';
import React from 'react';
import { Dropdown } from '../components/dropdown';

const stories = storiesOf('Components', module);

stories.add('DropDown', () => {
    const header = 'Header';

    const navigationItems = [
        {
            url: '#',
            name: 'Link 1',
        },
        {
            url: '#',
            name: 'Link 2',
        },
        {
            url: '#',
            name: 'Link 3',
        },
        {
            url: '#',
            name: 'Link 4',
        },
        {
            url: '#',
            name: 'Link 5',
        },
    ];

    return <Dropdown id="dropdownId" heading={header} items={navigationItems} />;
});
