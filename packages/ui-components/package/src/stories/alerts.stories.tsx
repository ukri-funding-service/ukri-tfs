import { boolean, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { TfsAlert } from '../components/alerts';

const stories = storiesOf('Components', module);
stories.add('TfsAlert', () => {
    const knobGroup = 'TfsAlert';
    const alertType = select(
        'Alert Type',
        ['success', 'cross', 'danger', 'info', 'warning', 'mono', undefined],
        undefined,
        knobGroup,
    );
    const hasHeading = boolean('Display Heading', false, knobGroup);
    const hasLink = boolean('Display Link', true, knobGroup);
    return (
        <TfsAlert
            alertType={alertType}
            text={text('Alert Text', 'See knobs section below for config', knobGroup)}
            href={hasLink ? '?path=/story/components--boxedcontent' : undefined}
            linkText={hasLink ? text('Alert Link Text', 'Story', knobGroup) : undefined}
            headingText={hasHeading ? 'Here is a heading' : undefined}
        />
    );
});
