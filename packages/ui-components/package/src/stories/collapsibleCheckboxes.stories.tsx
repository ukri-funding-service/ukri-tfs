import { storiesOf } from '@storybook/react';
import React from 'react';
import '../styles.scss';
import { text, boolean, withKnobs } from '@storybook/addon-knobs';
import { CollapsibleCheckboxes } from '../components/collapsibleCheckboxes/collapsibleCheckboxes';
import { CheckboxesItemProps } from 'govuk-react-jsx';

const stories = storiesOf('Components', module);

const checkboxItems: CheckboxesItemProps[] = [
    { children: 'In expert review (1000)', value: 'In expert review', id: '1', defaultChecked: true },
    { children: 'Sent for response (222)', value: 'Sent for response', id: '2', defaultChecked: false },
    { children: 'Expert review complete (31)', value: 'Expert review complete', id: '3', defaultChecked: true },
    { children: 'Failed expert review sent (4)', value: 'Failed expert review', id: '4', defaultChecked: false },
];

stories.addDecorator(withKnobs);

stories.add('CollapsibleCheckboxes', () => {
    return (
        <CollapsibleCheckboxes
            id={'status-filters'}
            name={'collapsible-checkboxes'}
            checkboxItems={checkboxItems}
            heading={text('Heading', 'Filter by status')}
            jsEnabled={boolean('JSEnable', true)}
            defaultExpanded={true}
        />
    );
});
