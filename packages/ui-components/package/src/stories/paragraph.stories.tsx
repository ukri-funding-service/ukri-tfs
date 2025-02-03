import { storiesOf } from '@storybook/react';
import React from 'react';
import { Paragraph } from '../components';
import { text, boolean } from '@storybook/addon-knobs';

import '../styles.scss';

const stories = storiesOf('Components', module);

stories.add('Paragraph', () => {
    const paragraphText = text(
        'Paragraph Text',
        `We have sent a link to jane.mcdoe@somersetuniversity.ac.uk to verify this email address. Select this link to sign into your UKRI Funding Service account and start your application for 'New Generation Thinkers scheme'. If you can't see the email in your inbox, check your junk folder.`,
    );
    return (
        <Paragraph id="foo" shouldUseDangerouslySetInnerHTML={boolean('Use Dangerously Set Inner Html', false)}>
            {paragraphText}
        </Paragraph>
    );
});
