import React, { ReactNode, useState } from 'react';
import { HeadingSize, HeadingText, TagSize } from './heading';

export type AccordionSection = {
    testId?: string;
    sectionKey?: string;
    children: ReactNode;
    heading: string;
    headingLevel?: TagSize;
    headingSize?: HeadingSize;
    defaultExpanded?: boolean;
};

export type AccordionProps = {
    children?: ReactNode;
    sections: AccordionSection[];
    jsEnabled?: boolean;
};

type AccordionState = { [k: number]: boolean };

export const Accordion = (props: AccordionProps): JSX.Element => {
    const { sections, jsEnabled } = props;
    const defaultAccordionState: AccordionState = {};

    sections.forEach((section: AccordionSection, i) => {
        defaultAccordionState[i] = section.defaultExpanded ?? false;
    });

    const [toggleAccordionState, setToggleAccordionState] = useState<AccordionState>(defaultAccordionState);

    const accordionSection = (section: AccordionSection, index: number): JSX.Element => {
        const toggleSectionAccordion = (value: boolean) => {
            setToggleAccordionState({
                ...toggleAccordionState,
                [index]: value,
            });
        };

        const testId = section.testId ?? index;
        const headingLevel = section.headingLevel ?? 'h3';
        const headingSize = section.headingSize ?? 'm';

        const expandedByDefault = jsEnabled ? toggleAccordionState[index] : true;

        return (
            <div
                className={
                    'govuk-accordion__section' + (expandedByDefault ? ' govuk-accordion__section--expanded' : '')
                }
                key={`${section.sectionKey ?? 'accordion-section'}-${index}`}
                data-testid={`accordion-section-${testId}`}
            >
                {sectionHeader({
                    toggleSectionAccordion,
                    toggleAccordionState,
                    index,
                    testId,
                    heading: section.heading,
                    headingLevel,
                    headingSize,
                })}
                <div
                    id={`accordion-default-content-${index}`}
                    className="govuk-accordion__section-content"
                    aria-labelledby={`accordion-default-heading-${index}`}
                    data-testid={`accordion-content-${testId}`}
                >
                    {section.children}
                </div>
            </div>
        );
    };

    return (
        <div className={'accordion' + (jsEnabled ? ' js-enabled' : '')} data-testid="accordion">
            <div className="govuk-accordion ukri-accordion" data-module="govuk-accordion" id="accordion-default">
                {sections.map((section, index) => accordionSection(section, index))}
            </div>
        </div>
    );
};

interface SectionHeaderProps {
    toggleSectionAccordion: (value: boolean) => void;
    toggleAccordionState: AccordionState;
    index: number;
    testId: string | number;
    heading: string;
    headingLevel: TagSize;
    headingSize: HeadingSize;
}

const sectionHeader = (props: SectionHeaderProps) => {
    const { toggleAccordionState, toggleSectionAccordion, index, testId, heading, headingLevel, headingSize } = props;

    const chevronIconState = toggleAccordionState[index] ? 'up' : 'down';
    const accordionToggleTextState = toggleAccordionState[index] ? 'Hide' : 'Show';

    const headerContent = (
        <button
            type="button"
            id={`accordion-default-heading-${index}`}
            aria-controls={`accordion-default-content-${index}`}
            className="govuk-accordion__section-button"
            aria-expanded={toggleAccordionState[index]}
            data-testid={`accordion-heading-${testId}`}
        >
            <span
                className={`govuk-accordion__section-heading-text govuk-heading-${headingSize}`}
                id="accordion-default-heading-1"
            >
                <span className="govuk-accordion__section-heading-text-focus">{heading}</span>
            </span>

            <span className="govuk-visually-hidden govuk-accordion__section-heading-divider">, </span>

            <span
                className="govuk-accordion__section-toggle js-only"
                data-testid={`accordion-section-control-${index}`}
                data-nosnippet=""
            >
                <span className="govuk-accordion__section-toggle-focus">
                    <span
                        className={`govuk-accordion-nav__chevron govuk-accordion-nav__chevron--${chevronIconState}`}
                    ></span>
                    <span className="govuk-accordion__section-toggle-text"> {accordionToggleTextState} </span>
                </span>
            </span>
        </button>
    );

    return (
        <div
            className="govuk-accordion__section-header"
            onClick={_e => {
                toggleSectionAccordion(!toggleAccordionState[index]);
            }}
        >
            <HeadingText
                tag={headingLevel}
                size={headingSize}
                className="govuk-accordion__section-heading"
                text={headerContent}
            />
        </div>
    );
};
