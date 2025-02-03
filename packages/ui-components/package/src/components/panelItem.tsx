import cx from 'classnames';
import React from 'react';
import { Colour, Tag } from './tag';
import { GdsLinkButton, LinkButtonProps } from './linkButton';
import { HeadingText, TagSize } from './heading';

interface PanelItemProps {
    isComplete?: boolean;
    showStatusText?: boolean;
    showStatusIcon?: boolean;
    statusAriaPrefix?: string;
    error?: {
        text: string;
        fieldName: string;
    };
    leftPanel: JSX.Element;
    leftPanelFillsWidth?: boolean;
    control?: JSX.Element | string;
    metadata?: JSX.Element | string;
    metatext?: string;
    skinny?: boolean;
    lastItem?: boolean;
    elementId?: string;
    ariaDescribedBy?: string;
    fullWidth?: boolean;
    tagTitle?: string;
    tagBackgroundColor?: Colour;
    tagUseSolidBackgroundColor?: boolean;
}

export class TfsPanelItem extends React.Component<PanelItemProps, {}> {
    private createStatusElement(
        isComplete: boolean | undefined,
        completionStatusProvided: boolean,
        statusAriaPrefix: string | undefined,
        displayStatusText: boolean,
    ): JSX.Element | undefined {
        if (!completionStatusProvided) {
            return undefined;
        }
        let statusText = 'Incomplete';
        if (isComplete) {
            statusText = 'Complete';
        }
        const statusLine = displayStatusText ? statusText : <span className="govuk-visually-hidden">{statusText}</span>;

        return (
            <span className="application-item__status">
                <span className="govuk-visually-hidden">{statusAriaPrefix ?? 'This section is'} </span>
                {statusLine}
            </span>
        );
    }

    private errorElement(
        errorProp:
            | {
                  text: string;
                  fieldName: string;
              }
            | undefined,
    ): JSX.Element | undefined {
        if (errorProp) {
            return (
                <div
                    className="application-item__error-message govuk-error-message"
                    id={errorProp.fieldName + '-error'}
                >
                    <span className="govuk-visually-hidden">{`Error: `}</span>
                    {errorProp.text}
                </div>
            );
        }
        return undefined;
    }

    private tagElement(
        title: string,
        backgroundColor: Colour | undefined,
        useSolidBackgroundColor: boolean | undefined,
    ): JSX.Element {
        return (
            <span className="application-item__tag">
                <Tag backgroundColor={backgroundColor} useSolidBackgroundColor={useSolidBackgroundColor ?? false}>
                    {title}
                </Tag>
            </span>
        );
    }

    render(): React.ReactElement {
        const completionStatusProvided = typeof this.props.isComplete !== 'undefined';

        const meta = (
            <span className="application-item__meta">
                {this.props.metatext && <span className="govuk-visually-hidden">{this.props.metatext}</span>}
                {this.props.metadata}
            </span>
        );

        // we don't display complete / incomplete text when metadata provided.
        const desiplayStatusText = !this.props.metadata && this.props.showStatusText !== false;
        const showStatusIcon = completionStatusProvided && this.props.showStatusIcon !== false;

        const statusElement = this.createStatusElement(
            this.props.isComplete,
            completionStatusProvided,
            this.props.statusAriaPrefix,
            desiplayStatusText,
        );

        const completeClassName = this.props.isComplete ? 'complete' : 'incomplete';
        const iconClass = showStatusIcon ? `application-item--${completeClassName}` : '';

        const classNames = cx(
            'application-item',
            iconClass,
            { 'application-item--error': this.props.error },
            { 'application-item--skinny': this.props.skinny },
            { 'application-item--skinny-last': this.props.skinny && this.props.lastItem },
            { 'error-target': this.props.error },
        );
        const getContentsClassName = () => {
            const dynamicClasses = this.props.leftPanelFillsWidth ? 'application-item--flex-right' : '';

            return `application-item__contents govuk-clearfix govuk-width-container ${dynamicClasses}`;
        };

        return (
            <div className={classNames} id={this.props.elementId} data-testid={this.props.elementId}>
                {this.errorElement(this.props.error)}
                <div className={getContentsClassName()}>
                    <div
                        className={
                            this.props.fullWidth
                                ? 'application-item__left application-item__left--full'
                                : 'application-item__left'
                        }
                    >
                        {this.props.leftPanel}
                    </div>
                    <div
                        id={this.props.ariaDescribedBy}
                        className={
                            this.props.fullWidth
                                ? 'application-item__right application-item__right--full'
                                : 'application-item__right'
                        }
                    >
                        {this.props.metadata && meta}
                        {statusElement}
                        {this.props.tagTitle &&
                            this.tagElement(
                                this.props.tagTitle,
                                this.props.tagBackgroundColor,
                                this.props.tagUseSolidBackgroundColor,
                            )}
                        {this.props.control && <span className="application-item__control">{this.props.control}</span>}
                    </div>
                </div>
            </div>
        );
    }
}
interface TfsPanelItemHeadingLinkProps extends LinkButtonProps {
    tag?: TagSize;
}

export const TfsPanelItemHeadingLink: React.FunctionComponent<TfsPanelItemHeadingLinkProps> = props => {
    const linkText = <GdsLinkButton {...props} />;
    return <HeadingText text={linkText} size="s" tag={props.tag ?? 'h2'} className="govuk-!-font-weight-regular" />;
};
