import { storiesOf } from '@storybook/react';
import React from 'react';
import '../styles.scss';
import { SearchInput } from '../components/searchInput';

const stories = storiesOf('Components', module);

stories.add('SearchInput', () => (
    <SearchInput
        label="Keyword search"
        hint="Applicant, applicant title"
        buttonName="searchButton"
        defaultValue="defaultValue"
    />
));
