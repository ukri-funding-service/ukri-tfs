import { storiesOf } from '@storybook/react';
import React from 'react';
import { boolean } from '@storybook/addon-knobs';

import '../styles.scss';
import { Header } from '../components/header';
import { HeaderLink } from 'govuk-react-jsx';

const stories = storiesOf('Components', module);

stories.add('Header', () => {
    const headerItems: HeaderLink[] = [
        {
            id: 'headerInactiveLink',
            text: 'Inactive Header',
            url: '#',
            isActive: false,
            navType: 'TOP',
        },
        {
            id: 'headerOpportunitiesLink',
            text: 'Opportunties',
            url: '#',
            isActive: true,
            currentlySelected: true,
            navType: 'TOP',
        },
        {
            id: 'headerApplicationsLink',
            text: 'Applications',
            url: '#',
            isActive: true,
            currentlySelected: false,
            navType: 'TOP',
        },
    ];

    return (
        <Header
            isAdmin={boolean('Show admin version', true)}
            signedIn={boolean('User signed in', true)}
            items={headerItems}
        />
    );
});
