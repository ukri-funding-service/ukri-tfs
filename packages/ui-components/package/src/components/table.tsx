import React, { ReactElement } from 'react';
import cx from 'classnames';
import { TableColumn } from './tableColumn';
import { GdsErrorMessage } from './errorMessage';

export type ColumnDataType = 'text' | 'numeric';
export type ColumnTextAlign = 'left' | 'center' | 'right';

export type AriaSortOptions = 'ascending' | 'descending' | 'none';

export enum Modes {
    col = 'col',
    header = 'header',
    cell = 'cell',
    width = 'width',
}

type CallBackFunction<T, TResult> = (item: T, index: { column: number; row: number }) => TResult;

interface TableColumnProps<T, TResult> {
    header: string | React.ReactNode;
    width?: number;
    value: CallBackFunction<T, TResult>;
    isInlineHeader?: CallBackFunction<T, TResult>;
    dataType?: ColumnDataType;
    idPrefix?: string;
    meta?: boolean;
    textAlign?: ColumnTextAlign;
    className?: (item: T, index: { column: number; row: number }) => string;
    printHidden?: boolean;
    headerClassName?: string;
    selectAllHeader?: string;
    ariaLabel?: string;
    testId?: string;
    headerColSpan?: number;
    rowColSpan?: number;
    borderRight?: boolean;
    ariaSort?: AriaSortOptions;
    headerAriaLabel?: string;
}

type TableChild<T> = React.ReactElement<TableColumnProps<T, {}>> | null;

type TableError = {
    rowError?: string;
};

interface TableProps<T extends TableError> {
    id?: string;
    className?: string;
    tableClassName?: string;
    rowClassName?: (item: T, row: number) => string;
    caption?: string | React.ReactElement;
    captionClass?: string;
    data: T[];
    children: TableChild<T> | TableChild<T>[];
    subHeader?: React.ReactElement;
    superHeader?: React.ReactElement;
    footer?: React.ReactElement;
    financeTable?: boolean;
    errorMessages?: string[];
    label?: string;
    testId?: string;
    rowTestId?: (item: T) => string;
    removeHeader?: boolean;
    rowKey?: keyof T;
    displayRowError?: boolean;
}

const GdsTable = <T extends TableError>(props: TableProps<T>): JSX.Element => {
    const children: React.ReactElement[] = [];
    const displayRowError = props.displayRowError === undefined ? true : props.displayRowError;
    React.Children.forEach<React.ReactElement | null>(props.children, element => {
        if (element) {
            children.push(element);
        }
    });

    const isError = props.errorMessages && props.errorMessages.length > 0;

    const headerIdxToSkip: number[] = [];
    const headers = children
        .filter((col, idx) => {
            if (headerIdxToSkip.includes(idx)) {
                return false;
            }
            if ((col.props.headerColSpan ?? 0) > 1) {
                // 2
                for (let i = 1; i < (col.props.headerColSpan ?? 0); i++) {
                    headerIdxToSkip.push(idx + i);
                }
            }
            return true;
        })
        .map(
            (column, columnIndex): JSX.Element =>
                React.cloneElement(column, { mode: Modes.header, columnIndex, key: `header-${columnIndex}` }),
        );

    const rowIdxToSkip: number[] = [];
    const filterFunction = (col: ReactElement, idx: number) => {
        if (rowIdxToSkip.includes(idx)) {
            return false;
        }
        if ((col.props.rowColSpan ?? 0) > 1) {
            for (let i = 1; i < (col.props.rowColSpan ?? 0); i++) {
                rowIdxToSkip.push(idx + i);
            }
        }
        return true;
    };

    const columns = children.map(
        (column, columnIndex): JSX.Element =>
            React.cloneElement(column, { mode: Modes.col, columnIndex, key: `columns-${columnIndex}` }),
    );
    const contents = props.data.map((dataItem, rowIndex): JSX.Element[] =>
        children.filter(filterFunction).map(
            (column, columnIndex): JSX.Element =>
                React.cloneElement(column, {
                    mode: Modes.cell,
                    rowIndex,
                    columnIndex,
                    dataItem,
                    ...column,
                    key: 'el' + columnIndex,
                }),
        ),
    );
    const captionClass = `govuk-table__caption ${props.captionClass || 'govuk-heading-m'}`;
    const tableCaption = !!props.caption ? <caption className={captionClass}>{props.caption}</caption> : null;

    const attributes: React.HTMLAttributes<HTMLDivElement> = {
        className: cx('responsive-table', { 'application-item--error': isError }, { 'error-target': isError }),
    };

    if (props.id) {
        attributes.id = props.id;
    }

    if (props.className) {
        attributes.className = cx(attributes.className, props.className);
    }

    const getRowClassName = (data: T, rowIndex: number): string => {
        let rowClassName = 'govuk-table__row';
        if (hasRowError(data)) {
            rowClassName = 'govuk-table--error-row';
        }
        if (props.rowClassName) {
            const additionalRowClass = props.rowClassName(data, rowIndex);
            if (additionalRowClass) {
                rowClassName += ' ' + additionalRowClass;
            }
        }
        return rowClassName;
    };

    const hasRowError = (data: T): boolean => {
        return data.rowError && data.rowError.length > 0 ? true : false;
    };

    let tableClassName = cx('govuk-table', 'responsive-table__table', props.tableClassName);
    if (props.financeTable) {
        tableClassName = cx('govuk-table--stripes', 'govuk-table--finance', tableClassName);
    }

    const wrapRowErrors = (rowError: string | string[] | undefined): string[] => {
        if (!rowError) {
            return [];
        }
        if (Array.isArray(rowError)) {
            return rowError;
        }
        return [rowError];
    };

    const errorMessages = (): JSX.Element => {
        return (
            <caption className="govuk-table__caption">
                {props.errorMessages?.map((errorMessage, index) => {
                    return (
                        <div
                            className="application-item__error-message govuk-error-message"
                            key={`table-error-${index}`}
                            aria-label={`Error: ${errorMessage}`}
                        >
                            {errorMessage}
                        </div>
                    );
                })}
            </caption>
        );
    };

    return (
        <div {...attributes}>
            <table className={tableClassName} data-testid={props.testId}>
                {tableCaption}
                {props.label && <h2 className="govuk-table__caption govuk-!-margin-bottom-1">{props.label}</h2>}
                {isError ? errorMessages() : undefined}
                <colgroup>{columns}</colgroup>
                {!props.removeHeader && (
                    <thead className="govuk-table__head">
                        {props.superHeader}
                        <tr className="govuk-table__row">{headers}</tr>
                        {props.subHeader}
                    </thead>
                )}
                <tbody className="govuk-table__body">
                    {contents.map((row: JSX.Element[], index: number): JSX.Element => {
                        const rowIndex = props.rowKey ? props.data[index][props.rowKey] : index;
                        return (
                            <React.Fragment key={`tableRow${rowIndex}`}>
                                {hasRowError(props.data[index]) &&
                                    wrapRowErrors(props.data[index].rowError).map((errorMessage, errorMessageIndex) => (
                                        <tr
                                            className="govuk-table__row govuk-table--error-row"
                                            key={`tableRow${rowIndex}-error${errorMessageIndex}`}
                                            data-testid={
                                                props.rowTestId
                                                    ? `error-${props.rowTestId(props.data[index])}`
                                                    : undefined
                                            }
                                        >
                                            {displayRowError && (
                                                <td colSpan={columns.length}>
                                                    <GdsErrorMessage
                                                        className="govuk-!-margin-bottom-0 govuk-!-margin-top-2"
                                                        message={errorMessage}
                                                        name={''}
                                                        showError={true}
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    ))}

                                <tr
                                    className={getRowClassName(props.data[index], index)}
                                    key={`tableRow${rowIndex}`}
                                    data-testid={props.rowTestId ? props.rowTestId(props.data[index]) : undefined}
                                >
                                    {row}
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
                {props.footer && <tfoot>{props.footer}</tfoot>}
            </table>
        </div>
    );
};

export const TypedTable: <T extends TableError | {}>() => React.FunctionComponent<TableProps<T>> = () => GdsTable;

export const Column = <T extends {}>(props: TableColumnProps<T, React.ReactNode>): React.ReactElement => {
    return (
        <TableColumn
            renderCell={(data: T, index: { column: number; row: number }) => props.value(data, index)}
            isInlineHeader={(data: T, index: { column: number; row: number }) =>
                props.isInlineHeader ? props.isInlineHeader(data, index) : false
            }
            {...props}
        />
    );
};
