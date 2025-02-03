import { storiesOf } from '@storybook/react';
import React from 'react';
import { Tag } from '../components';

const stories = storiesOf('Components', module);

stories.add('Tag (default)', () => {
    return <Tag>Alpha</Tag>;
});

stories.add('Tag (with test-id)', () => {
    return <Tag testId="test">Alpha</Tag>;
});

stories.add('Tag (tints)', () => {
    return (
        <>
            <Tag tint="GREY">GREY</Tag>
            <br />
            <br />
            <Tag tint="GREEN">GREEN</Tag>
            <br />
            <br />
            <Tag tint="TURQUOISE">TURQUOISE</Tag>
            <br />
            <br />
            <Tag tint="BLUE">BLUE</Tag>
            <br />
            <br />
            <Tag tint="PURPLE">PURPLE</Tag>
            <br />
            <br />
            <Tag tint="PINK">PINK</Tag>
            <br />
            <br />
            <Tag tint="RED">RED</Tag>
            <br />
            <br />
            <Tag tint="ORANGE">ORANGE</Tag>
            <br />
            <br />
            <Tag tint="YELLOW">YELLOW</Tag>
            <br />
            <br />
        </>
    );
});

stories.add('Tag (background colours)', () => {
    return (
        <>
            <Tag backgroundColor="GREEN">GREEN</Tag>
            <br />
            <br />
            <Tag backgroundColor="TURQUOISE">TURQUOISE</Tag>
            <br />
            <br />
            <Tag backgroundColor="BLUE">BLUE</Tag>
            <br />
            <br />
            <Tag backgroundColor="PURPLE">PURPLE</Tag>
            <br />
            <br />
            <Tag backgroundColor="PINK">PINK</Tag>
            <br />
            <br />
            <Tag backgroundColor="RED">RED</Tag>
            <br />
            <br />
            <Tag backgroundColor="ORANGE">ORANGE</Tag>
            <br />
            <br />
            <Tag backgroundColor="YELLOW">YELLOW</Tag>
        </>
    );
});
