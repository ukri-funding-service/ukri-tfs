import { storiesOf } from '@storybook/react';
import React from 'react';
import { Accordion, AccordionProps, HeadingSize, Paragraph, TagSize } from '../components';
import { object, boolean } from '@storybook/addon-knobs';

const stories = storiesOf('Components', module);

stories.add('Accordion', () => {
    const sectionValues = object(
        'Accordion Sections',
        [
            {
                sectionKey: 'test',
                children: 'Lorem ipsum dolar sit amet',
                heading: 'Directly Allocated',
                headingLevel: 'h3',
                headingSize: 'l',
            },
            {
                sectionKey: 'test2',
                children: 'Lorem ipsum dolar sit amet',
                heading: 'Directly Incurred',
                headingLevel: 'h3',
                headingSize: 'l',
            },
        ],
        'ACCORDION-SECTIONS',
    );

    const props: AccordionProps = {
        sections: sectionValues.map(({ children, ...sectionValue }, idx) => ({
            ...sectionValue,
            headingLevel: sectionValue.headingLevel as TagSize,
            headingSize: sectionValue.headingSize as HeadingSize,
            children: <Paragraph key={idx}>{children}</Paragraph>,
        })),
        jsEnabled: boolean('jsEnabled', true, 'JS-ENABLED'),
    };

    return <Accordion {...props} />;
});
