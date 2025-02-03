import { Checkboxes, CheckboxesItemProps } from 'govuk-react-jsx';
import { HeadingText } from '../heading';
import React from 'react';
import usePersistState from '../../hooks/persistState';

type Direction = 'vertical' | 'horizontal';

export type CollapsibleCheckboxesProps = {
    id: string;
    name: string;
    checkboxItems: CheckboxesItemProps[];
    heading: string;
    jsEnabled: boolean;
    defaultExpanded: boolean;
    className?: string;
    direction?: Direction;
};

export const CollapsibleCheckboxes: React.FunctionComponent<CollapsibleCheckboxesProps> = ({
    id,
    name,
    checkboxItems,
    heading,
    jsEnabled,
    defaultExpanded,
    className,
    direction = 'horizontal',
}) => {
    const [isExpanded, setIsExpanded] = usePersistState<boolean>(defaultExpanded, id);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const jsEnabledClass = jsEnabled ? 'collapsible-checkboxes js-enabled' : 'collapsible-checkboxes';
    const additionalClasses = className ?? '';
    const expanded = jsEnabled ? isExpanded : false;
    const insetDivStyle = expanded ? '' : 'js-hidden';
    const buttonText = isExpanded ? 'Hide' : 'Show';
    return (
        <>
            <div className={`${jsEnabledClass} ${additionalClasses}`} data-testid={'collapsible-checkboxes'}>
                <div className="collapsible-heading" data-testid={'collapsible-checkboxes-heading'}>
                    <HeadingText
                        text={heading}
                        tag="h3"
                        size="m"
                        className={'grouped-checkboxes__title govuk-heading-s govuk-!-margin-bottom-0'}
                    />
                    <div className="govuk-!-margin-left-2 js-only" onClick={toggleExpand}>
                        <button
                            aria-expanded={isExpanded}
                            type="button"
                            aria-controls={`collapsible-checkboxes-${id}`}
                            className="govuk-link toggle-checkboxes-button"
                            aria-label={`${buttonText} ${heading}`}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
                <div id={`collapsible-checkboxes-${id}`} className={insetDivStyle} aria-hidden={!isExpanded}>
                    <Checkboxes
                        className={`govuk-checkboxes govuk-checkboxes--small ${
                            direction === 'vertical'
                                ? 'collapsible-checkbox-items--vertical'
                                : 'collapsible-checkbox-items--horizontal'
                        }`}
                        data-testid={'collapsible-checkboxes-checkboxes'}
                        items={checkboxItems}
                        name={name}
                        formGroup={{
                            className: 'govuk-form-group govuk-!-margin-bottom-0',
                        }}
                    />
                </div>
            </div>
        </>
    );
};
