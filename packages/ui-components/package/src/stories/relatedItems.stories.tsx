import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import { GdsRelatedItems } from '../components/index';

const stories = storiesOf('Components', module);

stories.add('Related items', () => {
    const asideTitle = text('Aside Title', 'Funders');
    const asideDescription = text('Aside Description', 'Information about the Funders');
    return (
        <GdsRelatedItems>
            <h2 className="govuk-heading-xs u-space-y5">{asideTitle.toString()}</h2>
            <p className="govuk-body-s u-space-b5">{asideDescription.toString()}</p>
        </GdsRelatedItems>
    );
});
