import { storiesOf } from '@storybook/react';
import React from 'react';
import { PhaseBanner } from '../components/index';

import '../styles.scss';

const stories = storiesOf('Components', module);

stories.add('Phase Banner', () => <PhaseBanner phase="BETA" surveyUrl="https://forms.office.com/e/cCd0b1SveT" />);
