import { storiesOf } from '@storybook/react';
import React from 'react';
import { Input, InputWithCharacterCount } from '../components';
import { Details } from 'govuk-react-jsx';
import '../styles.scss';
import { TextAreaWithWordCount } from '../components/textAreaWithWordCount';

const stories = storiesOf('Components', module);

stories.add('Input', () => <Input name="Input" label="Email" placeholder="helloWorld@myemail.com" widthSize="20" />);
stories.add('Input with custom hint', () => (
    <Input
        name="Input"
        label="Password"
        placeholder="helloWorld@myemail.com"
        widthSize="20"
        hint={
            <Details summaryChildren="Help with nationality">
                We need to know your nationality so we can work out which elections you’re entitled to vote in. If you
                can’t provide your nationality, you’ll have to send copies of identity documents through the post.
            </Details>
        }
        errorMessages={['hello from the other side']}
    />
));

stories.add('Input with character count', () => (
    <InputWithCharacterCount
        name="Input"
        label="Password"
        placeholder="helloWorld@myemail.com"
        widthSize="20"
        showCharacterCount={true}
        maxCharacterCount={30}
    />
));

stories.add('Text Area with word count', () => <TextAreaWithWordCount name="Input" maxWordCount={20} rows={4} />);
