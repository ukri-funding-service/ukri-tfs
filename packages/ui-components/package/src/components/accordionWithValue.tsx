import React, { ReactNode, useMemo, useState } from 'react';

export type AccordionWithValueSection = {
    testId?: string;
    sectionKey?: string;
    children: ReactNode;
    heading: string;
    summaryLabel: string;
    summaryValue: string;
    guidance?: {
        title: string;
        content: ReactNode;
    };
    defaultExpanded?: boolean;
};

export type AccordionWithValueProps = {
    children?: ReactNode;
    sections: AccordionWithValueSection[];
};

type AccordionState = { [k: number]: boolean };

export const AccordionWithValue = (props: AccordionWithValueProps): JSX.Element => {
    const defaultAccordionState: AccordionState = {};

    // for (let i = 0; i < props.sections.length; i++) {
    //     defaultAccordionState[i] = false;
    // }
    props.sections.forEach((section: AccordionWithValueSection, i) => {
        defaultAccordionState[i] = section.defaultExpanded ?? false;
    });

    const [toggleAccordionState, setToggleAccordionState] = useState<{ [k: number]: boolean }>(defaultAccordionState);

    const toggleOpenAllState = useMemo(() => {
        return Object.values(toggleAccordionState).length && Object.values(toggleAccordionState).every(val => val);
    }, [toggleAccordionState]);

    const setToggleOpenAllState = (value: boolean) => {
        setToggleAccordionState(
            Object.keys(toggleAccordionState).reduce(
                (accordionState, key) => ({ ...accordionState, [key]: value }),
                {},
            ),
        );
    };

    const accordionSection = (section: AccordionWithValueSection, index: number): JSX.Element => {
        const [toggleGuidanceState, setToggleGuidanceState] = useState(false);

        const toggleSectionAccordion = (value: boolean) => {
            setToggleAccordionState({
                ...toggleAccordionState,
                [index]: value,
            });
        };

        const testId = section.testId ?? index;

        return (
            <div
                className={
                    'govuk-accordion__section' +
                    (toggleAccordionState[index] ? ' govuk-accordion__section--expanded' : '')
                }
                key={`${section.sectionKey ?? 'accordion-with-value-section'}-${index}`}
                data-testid={`accordion-with-value-section-${testId}`}
            >
                <div
                    className="govuk-accordion__section-header govuk-accordion__section-header--costs"
                    onClick={_e => {
                        toggleSectionAccordion(!toggleAccordionState[index]);
                    }}
                >
                    <h2 className="govuk-accordion__section-heading ukri-accordion__section-heading">
                        <span className="govuk-accordion__icon" aria-hidden="true"></span>
                        <button
                            type="button"
                            id={`accordion-default-heading-${index}`}
                            aria-controls={`accordion-default-content-${index}`}
                            className="govuk-accordion__section-button"
                            aria-expanded={toggleAccordionState[index]}
                            data-testid={`accordion-with-value-heading-${testId}`}
                        >
                            {section.heading}
                            <span className="govuk-accordion__icon" aria-hidden="true"></span>
                        </button>
                    </h2>
                    <div className="accordion-totals js-only" data-testid={`accordion-section-total-${testId}`}>
                        <label className="accordion-totals__label">
                            <span className="govuk-visually-hidden">{section.heading}</span> {section.summaryLabel}:{' '}
                        </label>
                        <input
                            type="text"
                            tabIndex={-1}
                            className="govuk-input govuk-input--secret accordion-totals__input"
                            value={section.summaryValue}
                            name="daAccordionTotal"
                            readOnly
                        />
                    </div>
                </div>
                <div
                    id={`accordion-default-content-${index}`}
                    className="govuk-accordion__section-content"
                    aria-labelledby={`accordion-default-heading-${index}`}
                    data-testid={`accordion-with-value-content-${testId}`}
                >
                    {section.guidance && (
                        <details className="govuk-details u-space-y10 js-only" data-module="govuk-details" role="group">
                            <summary
                                className="govuk-details__summary"
                                role="button"
                                aria-controls="details-content-0"
                                aria-expanded={toggleGuidanceState}
                                onClick={_e => setToggleGuidanceState(!toggleGuidanceState)}
                            >
                                <span className="govuk-details__summary-text">{section.guidance?.title}</span>
                            </summary>
                            <div
                                className="govuk-details__text"
                                id={`details-content-${index}`}
                                aria-hidden={!toggleGuidanceState}
                            >
                                {section.guidance.content}
                            </div>
                        </details>
                    )}
                    {section.children}
                </div>
            </div>
        );
    };

    const openAllText = toggleOpenAllState === true ? 'Hide all' : 'Show all';

    return (
        <div className="accordion-with-value js-enabled">
            <div className="govuk-accordion ukri-accordion" data-module="govuk-accordion" id="accordion-default">
                <div className="govuk-accordion__controls">
                    <button
                        type="button"
                        className="govuk-accordion__open-all"
                        aria-expanded={toggleOpenAllState === true}
                        onClick={_e => setToggleOpenAllState(!toggleOpenAllState)}
                    >
                        <span>{openAllText}</span>
                        <span className="govuk-visually-hidden"> sections</span>
                    </button>
                    {props.children}
                </div>
                <div className="govuk-accordion__controls"></div>
                {props.sections.map((section, index) => accordionSection(section, index))}
            </div>
        </div>
    );
};
