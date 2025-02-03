import { storiesOf } from '@storybook/react';
import React from 'react';
import { AccordionWithValue, AccordionWithValueProps, Paragraph } from '../components';
import { Details } from 'govuk-react-jsx';
import { text, object } from '@storybook/addon-knobs';

const stories = storiesOf('Components', module);

stories.add('Accordion with value', () => {
    const sectionValues = object(
        'Accordion Sections',
        [
            {
                sectionKey: 'test',
                children: 'Lorem ipsum dolar sit amet',
                heading: 'Directly Allocated',
                summaryLabel: 'Total £',
                summaryValue: '100',
                guidance: {
                    title: 'Here is some guidance',
                    content: 'Lorem ipsum dolar sit amet',
                },
            },
            {
                sectionKey: 'test2',
                children: 'Lorem ipsum dolar sit amet',
                heading: 'Directly Incurred',
                summaryLabel: 'Total £',
                summaryValue: '200',
                guidance: {
                    title: 'Here is some guidance',
                    content: 'Lorem ipsum dolar sit amet',
                },
            },
        ],
        'ACCORDION-SECTIONS',
    );

    const props: AccordionWithValueProps = {
        sections: sectionValues.map(({ children, guidance, ...sectionValue }, idx) => ({
            ...sectionValue,
            children: <Paragraph key={idx}>{children}</Paragraph>,
            guidance: guidance
                ? {
                      ...guidance,
                      content: <Paragraph>{guidance.content}</Paragraph>,
                  }
                : undefined,
        })),
    };

    return (
        <AccordionWithValue {...props}>
            <Details summaryChildren={text('top_heading', 'Help with this accordion')}>
                <Paragraph>{text('top_text', 'Lorem ipsum dolar sit amet.')}</Paragraph>
            </Details>
        </AccordionWithValue>
    );
});

stories.add('Accordion with value (no additional content top)', () => {
    const props: AccordionWithValueProps = {
        sections: [
            {
                sectionKey: 'test',
                children: <Paragraph key={1}>Lorem ipsum dolar sit amet</Paragraph>,
                heading: 'Directly Allocated',
                summaryLabel: 'Total £',
                summaryValue: '100',
                guidance: {
                    title: 'Here is some guidance',
                    content: <Paragraph>Lorem ipsum dolar sit amet</Paragraph>,
                },
            },
            {
                sectionKey: 'test2',
                children: <Paragraph key={2}>Lorem ipsum dolar sit amet</Paragraph>,
                heading: 'Directly Incurred',
                summaryLabel: 'Total £',
                summaryValue: '200',
                guidance: {
                    title: 'Here is some guidance',
                    content: <Paragraph>Lorem ipsum dolar sit amet</Paragraph>,
                },
            },
        ],
    };

    return <AccordionWithValue {...props} />;
});
