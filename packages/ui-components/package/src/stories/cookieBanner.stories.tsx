import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { CookieBanner } from '../components/index';

const stories = storiesOf('Components', module);

stories.add('Cookie Banner', () => {
    return (
        <CookieBanner
            submitUrl={text('submit url', 'http://127.0.0.1:3003/?path=/story/react-components--cookie-banner')}
            cookiesEnabled={false}
        />
    );
});
