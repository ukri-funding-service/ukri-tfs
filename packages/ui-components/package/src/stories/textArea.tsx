import { storiesOf } from '@storybook/react';
import React from 'react';
import { TextAreaWithWordCount } from '../components/textAreaWithWordCount';

const stories = storiesOf('Components', module);

stories.add('Text Area with word count', () => <TextAreaWithWordCount name="Input" maxWordCount={20} rows={4} />);
