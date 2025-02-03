import React, { ReactElement } from 'react';
import { DescriptionEntry, DescriptionList } from './descriptionList';

export type DictionaryListItems = { key: string | ReactElement; value: string; classes?: string[] }[];
export interface DictionaryListProps {
    items: DictionaryListItems;
    bold?: boolean;
}

export class DictionaryList extends React.Component<DictionaryListProps, {}> {
    constructor(props: DictionaryListProps) {
        super(props);
    }
    render(): React.ReactElement {
        return (
            <div className="application-data">
                <DescriptionList className="application-data__list">
                    {this.props.items.map((dictionaryItem, index) => {
                        const classes = dictionaryItem.classes;
                        const classNames = classes ? classes?.join(' ') : '';

                        const termClasses =
                            'application-data__key' +
                            (this.props.bold === true ? ' govuk-body govuk-!-font-weight-bold govuk-!-margin-0' : '');

                        const detailsClasses =
                            'application-data__value' +
                            (this.props.bold === true ? ' govuk-body govuk-!-margin-0' : '');

                        return (
                            <div className={classNames} key={index}>
                                <DescriptionEntry
                                    termClassName={termClasses}
                                    term={dictionaryItem.key}
                                    detailsClassName={detailsClasses}
                                    details={dictionaryItem.value}
                                />
                            </div>
                        );
                    })}
                </DescriptionList>
            </div>
        );
    }
}
