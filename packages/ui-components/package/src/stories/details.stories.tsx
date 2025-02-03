import { storiesOf } from '@storybook/react';
import React from 'react';
import { Details } from 'govuk-react-jsx';

import '../styles.scss';

const stories = storiesOf('Components', module);

stories.add('Details', () => (
    <Details summaryChildren={'Details title'}>
        <div>
            <p>
                Some text in a <strong>strong</strong> in a div
            </p>
        </div>
    </Details>
));
