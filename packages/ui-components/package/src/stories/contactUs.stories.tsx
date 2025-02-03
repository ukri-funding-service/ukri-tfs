import React from 'react';
import { storiesOf } from '@storybook/react';

import { ContactUs } from '../components/index';

const stories = storiesOf('Demo', module);

stories.add('Contact Us (with JS)', () => {
    return <ContactUs jsEnabled={true} phoneNumberLink="+441793547490" phoneNumberDisplayText="+44 (0)1793 547 490" />;
});

stories.add('Contact Us (without JS)', () => {
    return <ContactUs jsEnabled={false} phoneNumberLink="+441793547490" phoneNumberDisplayText="+44 (0)1793 547 490" />;
});

stories.add('Contact Us with custom text (with JS)', () => {
    return (
        <ContactUs
            jsEnabled={true}
            phoneNumberLink="+441793547490"
            phoneNumberDisplayText="+44 (0)1793 547 490"
            preLinkText="Some text before the link"
            linkText="custom link text"
            postLinkText="Some text after the link"
        />
    );
});
