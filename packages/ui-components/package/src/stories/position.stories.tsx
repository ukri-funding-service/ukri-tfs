import React from 'react';
import { storiesOf } from '@storybook/react';
import { Position, PositionSpacing } from '../components/index';

const stories = storiesOf('Components', module);

const containerStyle = {
    borderStyle: 'solid',
};

stories.add('Position', () => (
    <React.Fragment>
        <div className="columns">
            <Position spacing={PositionSpacing.FULL}>
                <p style={containerStyle}>Full</p>
            </Position>
        </div>

        <div className="columns">
            <Position spacing={PositionSpacing.ONE_QUARTER}>
                <p style={containerStyle}>One Quarter</p>
            </Position>

            <Position spacing={PositionSpacing.HALF}>
                <p style={containerStyle}>Half</p>
            </Position>

            <Position spacing={PositionSpacing.ONE_QUARTER}>
                <p style={containerStyle}>One Quarter</p>
            </Position>
        </div>

        <div className="columns">
            <Position spacing={PositionSpacing.ONE_THIRD}>
                <p style={containerStyle}>One Third</p>
            </Position>

            <Position spacing={PositionSpacing.TWO_THIRDS}>
                <p style={containerStyle}>Two Thirds</p>
            </Position>
        </div>
        <div className="columns">
            <Position spacing={PositionSpacing.THREE_QUARTERS}>
                <p style={containerStyle}>Three Quarters</p>
            </Position>

            <Position spacing={PositionSpacing.ONE_QUARTER}>
                <p style={containerStyle}>One Quarter</p>
            </Position>
        </div>
    </React.Fragment>
));
