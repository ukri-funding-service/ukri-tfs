import React from 'react';
import { storiesOf } from '@storybook/react';
import { CustomButton } from '../components/index';

const stories = storiesOf('Components', module);

stories.add('Custom Button', () => <CustomButton />);
