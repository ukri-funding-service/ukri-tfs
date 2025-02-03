import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, withKnobs, select } from '@storybook/addon-knobs';

import { GdsFormGroup, Form } from '../components/index';

const stories = storiesOf('Container Components', module);

const containerStyle = {
    borderStyle: 'solid',
};

const loremIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

stories.addDecorator(withKnobs);

stories.add('Form', () => {
    return (
        <Form
            id={text('ID', 'formContainerId')}
            className={text('Class', 'form-example-1')}
            name={text('Name', 'exampleForm')}
            action={text('Action', '')}
            method={select('Method', ['', 'get', 'post'], '')}
            csrfToken={text('CSRF Token', '01234567-89ab-cdef-0123-456789abcdef')}
        >
            <p style={containerStyle}>{loremIpsum}</p>
        </Form>
    );
});

stories.add('Form group', () => {
    return (
        <GdsFormGroup
            id={text('ID', 'formGroupContainerId')}
            className={text('Class', 'formGroup-example-1')}
            isError={boolean('Error', true)}
        >
            <p style={containerStyle}>{loremIpsum}</p>
        </GdsFormGroup>
    );
});
