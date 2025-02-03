import React from 'react';
import { textWithLineBreaks } from '../helpers/text';

export interface DetailsProps {
    title: string;
    details: JSX.Element | string;
    className?: string;
    detailsAsHtml?: boolean;
    lineBreak?: boolean;
    expandedByDefault?: boolean;
    altTitle?: string;
    containerClassName?: string;
}

interface DetailsState {
    expanded: boolean;
    displayText: string;
}

export class GdsDetails extends React.Component<DetailsProps, DetailsState> {
    constructor(props: DetailsProps) {
        super(props);
        const newExpandedState = props.expandedByDefault === true ? true : false;
        this.state = {
            expanded: newExpandedState,
            displayText: this.getDisplayText(newExpandedState),
        };
    }

    getDisplayText(expandedState: boolean): string {
        let displayText = this.props.title;
        if (expandedState === true && this.props.altTitle !== undefined) {
            displayText = this.props.altTitle;
        }
        return displayText;
    }

    // TODO add css class to remove padding-bottom from p:last-of-type to remove excess padding which extends the left-hand grey hand.
    toggleExpanded(e: React.MouseEvent<HTMLElement>): void {
        e.preventDefault();
        const newExpandedState = !this.state.expanded;
        this.setState({ expanded: newExpandedState, displayText: this.getDisplayText(newExpandedState) });
    }

    render(): React.ReactElement {
        let details;

        if (this.props.detailsAsHtml && typeof this.props.details === 'string') {
            details = (
                <div
                    className="govuk-details__text u-space-b30"
                    dangerouslySetInnerHTML={{ __html: this.props.details }}
                />
            );
        } else if (typeof this.props.details === 'string' && this.props.lineBreak) {
            details = (
                <div className="govuk-details__text u-space-b30">
                    {<p>{textWithLineBreaks(this.props.details, 'details')}</p>}
                </div>
            );
        } else {
            details = <div className="govuk-details__text u-space-b30">{this.props.details}</div>;
        }
        if (this.props.containerClassName) {
            details = <div className={`${this.props.containerClassName || ''}`}>{details}</div>;
        }
        return (
            <details
                className={`govuk-details govuk-details--list-data u-space-t20 u-space-b0 js-only ${
                    this.props.className || ''
                }`}
                data-module="govuk-details"
                open={this.state.expanded}
            >
                <summary className="govuk-details__summary u-space-b30" onClick={e => this.toggleExpanded(e)}>
                    <span className="govuk-details__summary-text">{this.state.displayText}</span>
                </summary>
                {details}
            </details>
        );
    }
}
