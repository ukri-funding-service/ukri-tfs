import { storiesOf } from '@storybook/react';
import React from 'react';
import { BoxedContent, Paragraph } from '../components/index';

const stories = storiesOf('Components', module);
stories.add('BoxedContent', () => {
    return (
        <BoxedContent>
            text outside of paragraph
            <Paragraph>text inside of paragraph</Paragraph>
        </BoxedContent>
    );
});
