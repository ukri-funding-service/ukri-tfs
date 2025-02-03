import React, { ReactNode } from 'react';

export type DescriptionListProps = { className?: string; id?: string; children: ReactNode };

export class DescriptionList extends React.Component<DescriptionListProps, {}> {
    constructor(props: DescriptionListProps) {
        super(props);
    }
    render(): React.ReactElement {
        return (
            <dl id={this.props.id} className={this.props.className}>
                {this.props.children}
            </dl>
        );
    }
}

export type DescriptionEntryProps = {
    termClassName?: string;
    term: ReactNode | string;
    detailsClassName?: string;
    details: ReactNode | string;
    ['details-testid']?: string;
    className?: string;
};

export class DescriptionEntry extends React.Component<DescriptionEntryProps, {}> {
    constructor(props: DescriptionEntryProps) {
        super(props);
    }
    render(): React.ReactElement {
        return (
            <div className={this.props.className}>
                <dt role="listitem" className={this.props.termClassName}>
                    {this.props.term}
                </dt>
                <dd className={this.props.detailsClassName} data-testid={this.props['details-testid']}>
                    {this.props.details}
                </dd>
            </div>
        );
    }
}
