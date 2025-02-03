import { storiesOf } from '@storybook/react';
import React from 'react';
import { CustomPanel } from '../components';

import '../styles.scss';

const stories = storiesOf('Components', module);

stories.add('Custom Panel', () => <CustomPanel>This is a custom panel</CustomPanel>);
