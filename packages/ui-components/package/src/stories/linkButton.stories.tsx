import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs';

import { GdsLinkButton } from '../components/index';

const stories = storiesOf('Components', module);

stories.add('Link', () => (
    <GdsLinkButton
        ariaLabel=""
        id={text('link id', 'link-1')}
        text={text('link text', 'View project details')}
        href={text('link location', '#')}
        className={text('class name', 'govuk-link')}
        openInNewTab={boolean('active', false)}
    />
));

stories.add('Link with react node in text', () => (
    <GdsLinkButton
        ariaLabel=""
        id={text('link id', 'link-1')}
        text={
            <>
                Link with <span className="focus">focussed text</span>
            </>
        }
        href={text('link location', '#')}
        className={text('class name', 'govuk-link')}
        openInNewTab={boolean('active', false)}
    />
));
