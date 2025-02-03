import { storiesOf } from '@storybook/react';
import React from 'react';
import '../styles.scss';
import { TfsNotificationBanner, TfsNotificationBannerHeading, TfsNotificationBannerMainText } from '../components/';

const stories = storiesOf('Components', module);

stories.add('TfsNotificationBanner with multiple lines', () => (
    <TfsNotificationBanner titleId="test">
        <TfsNotificationBannerHeading>child content</TfsNotificationBannerHeading>
        <p>paragraph</p>
    </TfsNotificationBanner>
));

stories.add('Success TfsNotificationBanner with one line', () => (
    <TfsNotificationBanner titleId="test" type="success">
        <TfsNotificationBannerMainText>child content</TfsNotificationBannerMainText>
    </TfsNotificationBanner>
));
