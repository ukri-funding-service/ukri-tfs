import { storiesOf } from '@storybook/react';
import React from 'react';
import { CustomPanelGroup } from '../components';

import '../styles.scss';

const stories = storiesOf('Components', module);

stories.add('Custom Panel', () => (
    <CustomPanelGroup columnClassName="application-items u-space-b30 govuk-!-margin-bottom-5">
        <p>Custom Panel Group</p>
    </CustomPanelGroup>
));
