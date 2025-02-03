import { Checkboxes, CheckboxesItemProps } from 'govuk-react-jsx';
import React, { useEffect } from 'react';
import usePersistState from '../hooks/persistState';

export interface GroupedCheckboxesProps {
    title: string;
    name: string;
    items: CheckboxesItemProps[];
    displayShowHideButton: boolean;
    shouldTruncateList: boolean;
}

export const GroupedCheckboxes = (props: GroupedCheckboxesProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = usePersistState<Boolean>(true, `grouped-checkboxes-expanded-${props.title}`);
    const [isTruncated, setIsTruncated] = usePersistState<Boolean>(
        props.shouldTruncateList,
        `grouped-checkboxes-truncated-${props.title}`,
    );
    const truncatedListLength = 10;

    const showHideButtonText = isExpanded ? 'Hide' : 'Show';
    const showHideButtonAriaLabel = `${showHideButtonText} ${props.title}`;

    const truncatedButtonText = isTruncated ? 'Show full list' : 'Show reduced list';
    const truncatedButtonAriaLabel = `${truncatedButtonText} ${props.title}`;

    useEffect(() => {
        setIsTruncated(props.shouldTruncateList);
    }, [props.shouldTruncateList]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleTruncated = () => {
        setIsTruncated(!isTruncated);
    };

    const showHideButton = props.displayShowHideButton ? (
        <button
            type="button"
            className="govuk-button--link"
            aria-label={showHideButtonAriaLabel}
            onClick={toggleExpand}
        >
            {showHideButtonText}
        </button>
    ) : (
        <></>
    );

    const ShowFullListButton = (): JSX.Element =>
        props.shouldTruncateList && props.items.length > truncatedListLength ? (
            <div className="show-full-list">
                <button
                    type="button"
                    className="govuk-button--link"
                    aria-label={truncatedButtonAriaLabel}
                    onClick={toggleTruncated}
                >
                    {truncatedButtonText}
                </button>
            </div>
        ) : (
            <></>
        );

    return (
        <>
            <div className={`grouped-checkboxes ${isExpanded ? '' : 'hidden'}`} data-testid="checkbox-wrapper">
                <Checkboxes
                    fieldset={{
                        legend: {
                            children: [props.title, showHideButton],
                            className: 'grouped-checkboxes__title govuk-fieldset__legend--s',
                        },
                    }}
                    className={'govuk-checkboxes govuk-checkboxes--small'}
                    items={isTruncated ? props.items.slice(0, truncatedListLength) : props.items}
                    name={props.name}
                    formGroup={{
                        className: 'govuk-form-group govuk-!-margin-bottom-0',
                    }}
                />
                <ShowFullListButton />
            </div>
        </>
    );
};
