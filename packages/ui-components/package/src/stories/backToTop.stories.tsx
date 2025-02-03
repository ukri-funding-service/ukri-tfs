import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text } from '@storybook/addon-knobs';

import { BackToTop } from '../components/index';

const stories = storiesOf('Components', module);

stories.add('Back to Top', () => (
    <BackToTop
        target={text('Target', '#my-target')}
        text={text('Text', 'My text')}
        isSticky={boolean('Is Sticky', false)}
    />
));
