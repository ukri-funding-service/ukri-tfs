import React from 'react';
import { AriaSortOptions, ColumnDataType, ColumnTextAlign, Modes } from './table';
import { TableCheckbox } from './tableCheckbox';

type CallBackFunction<T> = (data: T, index: { column: number; row: number }) => React.ReactNode;

interface ColumnProps<T> {
    header: string | React.ReactNode;
    renderCell: CallBackFunction<T>;
    isInlineHeader: CallBackFunction<T>;
    width?: number;
    dataItem?: T;
    mode?: Modes;
    columnIndex?: number;
    rowIndex?: number;
    dataType?: ColumnDataType;
    idPrefix?: string;
    meta?: boolean;
    textAlign?: ColumnTextAlign;
    className?: (data: T, index: { column: number; row: number }) => string;
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

export class TableColumn<T> extends React.Component<ColumnProps<T>, {}> {
    renderCell(
        data: T,
        column: number,
        row: number,
        dataType: ColumnDataType,
        idPrefix?: string,
        meta?: boolean,
        textAlign?: ColumnTextAlign,
    ): React.ReactNode {
        let className = 'govuk-table__cell';

        if (dataType === 'numeric') {
            className += ' govuk-table__cell--numeric';
        }

        if (meta) {
            className += ' meta';
        }

        if (textAlign) {
            className += ` u-align-${textAlign}`;
        }

        if (this.props.className) {
            className += ` ${this.props.className(data, { column, row })}`;
        }

        if (this.props.printHidden) {
            className += ` print-hide`;
        }

        if (this.props.borderRight) {
            className += ` cell-border-right`;
        }

        const props: React.HTMLAttributes<HTMLTableCellElement> = {
            className: className.trim(),
        };

        if (idPrefix) {
            props.id = `${idPrefix}${row}`;
        }

        const ariaLabel = this.props.ariaLabel;

        const isInlineHeader = this.props.isInlineHeader(data, { column, row });

        const cellProps: JSX.IntrinsicElements['td'] & { 'data-testid': string | undefined } = {
            ...props,
            key: column,
            'aria-label': ariaLabel,
            'data-testid': this.props.testId,
            colSpan: this.props.rowColSpan,
        };
        const cellContents = this.props.renderCell(data, { column, row });

        return isInlineHeader ? (
            <th {...cellProps} scope="row">
                {cellContents}
            </th>
        ) : (
            <td {...cellProps}>{cellContents}</td>
        );
    }

    renderSelectAllCheckbox(targetName: string): React.ReactNode {
        return renderSelectAllCheckbox(targetName);
    }

    renderHeader(
        column: number,
        dataType: ColumnDataType,
        idPrefix?: string,
        textAlign?: ColumnTextAlign,
    ): React.ReactNode {
        let className = 'govuk-table__header';

        if (dataType === 'numeric') {
            className += ' govuk-table__header--numeric';
        }

        if (textAlign) {
            className += ` u-align-${textAlign}`;
        }

        if (this.props.printHidden) {
            className += ` print-hide`;
        }

        if (this.props.headerClassName) {
            className += ` ${this.props.headerClassName}`;
        }

        const props: React.ThHTMLAttributes<HTMLTableCellElement> = {
            className,
            scope: Modes.col,
        };

        if (idPrefix) {
            props.id = `${idPrefix}-header`;
        }

        if (this.props.ariaSort !== undefined) {
            className += ` sortable-heading-button`;
        }

        const header = this.props.selectAllHeader
            ? this.renderSelectAllCheckbox(this.props.selectAllHeader)
            : this.props.header;

        const ariaLabel = this.props.ariaLabel;
        const headerAriaLabel = this.props.headerAriaLabel;

        return (
            <th
                {...props}
                key={column}
                colSpan={this.props.headerColSpan}
                aria-sort={this.props.ariaSort}
                aria-label={headerAriaLabel}
            >
                {header}
                {ariaLabel ? <div className="govuk-visually-hidden">{ariaLabel}</div> : null}
            </th>
        );
    }

    renderCol(column: number, width?: number): React.ReactNode {
        return <col key={column} width={`${width}%`} />;
    }

    render(): React.ReactNode {
        switch (this.props.mode) {
            case Modes.col:
                return this.renderCol(this.props.columnIndex!, this.props.width);
            case Modes.header:
                return this.renderHeader(
                    this.props.columnIndex!,
                    this.props.dataType || 'text',
                    this.props.idPrefix,
                    this.props.textAlign,
                );
            case Modes.cell:
                return this.renderCell(
                    this.props.dataItem!,
                    this.props.columnIndex!,
                    this.props.rowIndex!,
                    this.props.dataType || 'text',
                    this.props.idPrefix,
                    this.props.meta,
                    this.props.textAlign,
                );
            default:
                return null;
        }
    }
}

export const renderSelectAllCheckbox = (targetName: string): React.ReactNode => {
    return (
        <TableCheckbox
            className="js-only-block"
            name={'select all ' + targetName}
            hiddenLabel={'select all ' + targetName}
            onClick={event => {
                const selectAllElement = event.target as HTMLInputElement;
                const tableElement = selectAllElement.closest('table');
                if (tableElement) {
                    const inputs = tableElement.getElementsByTagName('input');
                    for (let i = 0, n = inputs.length; i < n; i++) {
                        if (inputs[i].name === targetName && inputs[i].disabled !== true) {
                            inputs[i].checked = selectAllElement.checked;
                        }
                    }
                }
            }}
        ></TableCheckbox>
    );
};
