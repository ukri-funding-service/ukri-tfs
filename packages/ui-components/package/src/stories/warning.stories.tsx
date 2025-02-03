import { storiesOf } from '@storybook/react';
import React from 'react';
import '../styles.scss';
import { Warning } from '../components/warning';

const stories = storiesOf('Components', module);

stories.add('Warning', () => <Warning text="This is a warning." />);

stories.add('Warning with text component', () => <Warning text={<i>Italicised warning.</i>} />);
