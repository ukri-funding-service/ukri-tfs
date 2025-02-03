import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { Columns, Position, PositionSpacing } from '../components/index';

const stories = storiesOf('Components', module);

const loremIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const containerStyle = {
    borderStyle: 'solid',
};

stories.add('Columns', () => {
    return (
        <Columns id={text('ID', 'columnContainerId')} className={text('Class', 'columns-example-1')}>
            <Position spacing={PositionSpacing.FULL}>
                <p style={containerStyle}>{loremIpsum}</p>
            </Position>
        </Columns>
    );
});
