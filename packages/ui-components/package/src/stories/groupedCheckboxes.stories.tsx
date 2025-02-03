import { storiesOf } from '@storybook/react';
import React from 'react';
import { GroupedCheckboxes } from '../components';

const stories = storiesOf('Components', module);

stories.add('GroupedCheckboxes', () => {
    return (
        <GroupedCheckboxes
            title="My grouped checkboxes"
            items={[
                {
                    children: 'Checkbox 1',
                    value: 'Checkbox 1',
                },
                {
                    children: 'Checkbox 2',
                    value: 'Checkbox 2',
                },
                {
                    children: 'Checkbox 3',
                    value: 'Checkbox 3',
                },
            ]}
            name="grouped-checkboxes"
            displayShowHideButton={false}
            shouldTruncateList={false}
        ></GroupedCheckboxes>
    );
});
