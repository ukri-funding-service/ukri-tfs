import { storiesOf } from '@storybook/react';
import { FileUpload } from '../components';
import React from 'react';

import '../styles.scss';

const stories = storiesOf('Components', module);

stories.add('FileUpload', () => <FileUpload />);
