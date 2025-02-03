import { storiesOf } from '@storybook/react';
import { DictionaryList } from '../components/dictionaryList';
import React from 'react';

const stories = storiesOf('Components', module);

stories.add('Tfs Dictionary List', () => {
    return (
        <DictionaryList
            items={[
                { key: 'Application reference:', value: 'APP500' },
                { key: 'Applicant:', value: 'John Doe' },
                { key: 'Organisation:', value: 'University of Bristol' },
            ]}
        />
    );
});
