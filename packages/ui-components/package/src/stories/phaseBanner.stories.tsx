import { storiesOf } from '@storybook/react';
import React from 'react';
import { PhaseBanner } from '../components/index';

import '../styles.scss';

const stories = storiesOf('Components', module);

stories.add('Phase Banner', () => (
    <PhaseBanner phase="BETA" surveyUrl="https://airtable.com/appj6osCTyP9dGvrL/shrDlfX6wle4cftUR" />
));
