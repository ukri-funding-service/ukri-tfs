import { storiesOf } from '@storybook/react';
import React from 'react';
import { NavigationList } from '../components/navigationList';

const stories = storiesOf('Components', module);

stories.add('Navigation List', () => {
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

    return <NavigationList heading={header} items={navigationItems} />;
});
