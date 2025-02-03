import React from 'react';
import { storiesOf } from '@storybook/react';
import { NotFoundGuidance } from '../components/notFoundGuidance';
import { text, boolean } from '@storybook/addon-knobs';

const stories = storiesOf('Components', module);

stories.add('NotFoundGuidance', () => {
    const knobGroup = 'NotFoundGuidance';
    return (
        <NotFoundGuidance
            jsEnabled={boolean('jsEnabled', true, knobGroup)}
            summaryLine={text('Summary Line', 'Need help finding an Organisation?', knobGroup)}
            itemType={text('Item Type', 'Organisation', knobGroup)}
            itemListDescription={text('Item List Description', 'organisations', knobGroup)}
            mailToConfig={{
                subject: text('Mail-to Subject', 'subject', knobGroup),
                body: text('Mail-to Body', 'body', knobGroup),
                recipientAddress: text('Mail-to Recipient', 'somebody@example.com', knobGroup),
            }}
        />
    );
});
