import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { GdsLink } from '../components';

const stories = storiesOf('Components', module);
stories.add('GdsLink', () => {
    return (
        <GdsLink
            id={text('link id', 'link-1')}
            href={text('href', 'www.google.com')}
            className={text('extra classes', '')}
        >
            {text('link text', 'Link text')}
        </GdsLink>
    );
});
