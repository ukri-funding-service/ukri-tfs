import { select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { CookieBannerConfirmation } from '../components/cookieBannerConfirmation';

const stories = storiesOf('Components', module);

stories.add('Cookie Banner confirmation', () => {
    const knobGroup = 'accepted';
    const acceptance = select('accepted', ['accepted', 'rejected'], knobGroup);

    return <CookieBannerConfirmation submitUrl={text('submit url', '')} actionTaken={acceptance} onSubmit={() => {}} />;
});
