import { render, RenderResult, within } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { TableCheckbox } from '../../../src/components';
import { Column, TypedTable } from '../../../src/components/table';

interface ExampleDataItem {
    name: string;
    id: number;
    rowError?: string | string[];
}

describe('<TypedTable /> component tests', () => {
    const ExampleTable = TypedTable<ExampleDataItem>();
    const caption = 'Table caption';
    const captionClass = 'caption-class';
    const opps = ['OPP564: UK-Canada Diabetes Research Team Grants', 'OPP8964: Strength in places Round 3'];
    const exampleData: ExampleDataItem[] = opps.map((item, i) => {
        return { name: item, id: i + 1 };
    });

    describe('component', () => {
        let component: RenderResult;

        beforeEach(() => {
            component = render(
                <ExampleTable
                    rowKey="id"
                    data={exampleData}
                    caption={caption}
                    rowClassName={(x: ExampleDataItem) => (x.id === 1 ? 'rowClassAdded' : '')}
                    errorMessages={[]}
                >
                    <Column header="Id" value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                    <Column header="Name" value={(x: ExampleDataItem) => x.name} width={150} dataType="numeric" />
                    <Column
                        header="Additional Information"
                        value={(x: ExampleDataItem) => x.name + ' additional information'}
                        width={200}
                    />
                </ExampleTable>,
            );
        });

        afterEach(() => {
            component.unmount();
        });

        it('should set the correct caption', () => {
            expect(component.container.querySelector('caption')?.textContent).to.equal(caption);
        });

        it('should set the correct caption class', () => {
            expect(component.container.querySelector('caption')?.className).to.equal(
                'govuk-table__caption govuk-heading-m',
            );
        });

        it('should set the correct number of columns', () => {
            expect(component.container.querySelectorAll('th')).to.have.lengthOf(3);
        });

        it('should set the correct number of rows', () => {
            expect(component.container.querySelector('tbody')?.querySelectorAll('tr')).to.have.lengthOf(2);
        });

        it('should set the correct width of column 1', () => {
            expect(component.container.querySelectorAll('col')[0].getAttribute('width')).to.equal('100%');
        });

        it('should set the correct width of column 2', () => {
            expect(component.container.querySelectorAll('col')[1].getAttribute('width')).to.equal('150%');
        });

        it('should set the correct header in column 1', () => {
            expect(component.container.querySelectorAll('th')[0].textContent).to.equal('Id');
        });

        it('should set the correct header in column 2', () => {
            expect(component.container.querySelectorAll('th')[1].textContent).to.equal('Name');
        });

        it('should set the correct content in cell column 1 row 1', () => {
            expect(component.container.querySelectorAll('tr')[1].querySelectorAll('td')[0].textContent).to.equal('1');
        });

        it('should set the correct content in cell column 1 row 2', () => {
            expect(component.container.querySelectorAll('tr')[2].querySelectorAll('td')[0].textContent).to.equal('2');
        });

        it('should set the correct content in cell column 2 row 1', () => {
            expect(component.container.querySelectorAll('tr')[1].querySelectorAll('td')[1].textContent).to.equal(
                'OPP564: UK-Canada Diabetes Research Team Grants',
            );
        });

        it('should set the correct content in cell column 2 row 2', () => {
            expect(component.container.querySelectorAll('tr')[2].querySelectorAll('td')[1].textContent).to.equal(
                'OPP8964: Strength in places Round 3',
            );
        });

        it('should set the numberic header class correctly in column 2', () => {
            expect(component.container.querySelectorAll('th')[1].className).to.eql(
                'govuk-table__header govuk-table__header--numeric',
            );
        });

        it('should set the numeric cell class correctly in column 2', () => {
            expect(component.container.querySelectorAll('tr')[2].querySelectorAll('td')[1].className).to.eql(
                'govuk-table__cell govuk-table__cell--numeric',
            );
        });

        it('should set a row class name on id==1', () => {
            expect(component.container.querySelectorAll('tr')[1].className).to.eql('govuk-table__row rowClassAdded');
        });

        it('should not set a row class name on other row', () => {
            expect(component.container.querySelectorAll('tr')[2].className).to.eql('govuk-table__row');
        });

        it('should not set ids if idPrefix not set', () => {
            const headerRow = component.container.querySelector('tr');
            expect(headerRow?.querySelectorAll('th')[0].id).to.be.empty;
            expect(headerRow?.querySelectorAll('th')[1].id).to.be.empty;
            expect(headerRow?.querySelectorAll('th')[2].id).to.be.empty;
        });

        it('should not have have class print-hide if printHidden is not specified', () => {
            const headerRow = component.container.querySelectorAll('tr')[0];
            const cell = component.container.querySelectorAll('tr')[1];

            expect(headerRow?.querySelector('th')?.getAttribute('class')).to.eql('govuk-table__header');
            expect(cell?.querySelector('td')?.getAttribute('class')).to.eql('govuk-table__cell');
        });

        it('should not have error classes if error not present', () => {
            expect(component.container.querySelector('.application-item--error.error-target')).to.be.null;
        });
    });

    describe('componentWithIds', () => {
        let componentWithIds: RenderResult;

        beforeEach(() => {
            componentWithIds = render(
                <ExampleTable data={exampleData} caption={caption}>
                    <Column header="Id" value={(x: ExampleDataItem) => x.id.toString()} width={100} idPrefix="id" />
                    <Column
                        header="Name"
                        value={(x: ExampleDataItem) => x.name}
                        width={150}
                        dataType="numeric"
                        idPrefix="name"
                    />
                    <Column
                        header="Additional Information"
                        value={(x: ExampleDataItem) => x.name + ' additional information'}
                        width={200}
                        idPrefix="additional-info"
                    />
                </ExampleTable>,
            );
        });

        it('should set the header ids correctly', () => {
            const headerRow = componentWithIds.container.querySelector('tr');
            expect(headerRow?.querySelectorAll('th')[0].id).to.equal('id-header');
            expect(headerRow?.querySelectorAll('th')[1].id).to.equal('name-header');
            expect(headerRow?.querySelectorAll('th')[2].id).to.equal('additional-info-header');
        });

        it('should set the ids correctly in column 1', () => {
            const columnNumber = 0;
            expect(
                componentWithIds.container.querySelectorAll('tr')[1].querySelectorAll('td')[columnNumber].id,
            ).to.equal('id0');
            expect(
                componentWithIds.container.querySelectorAll('tr')[2].querySelectorAll('td')[columnNumber].id,
            ).to.equal('id1');
        });

        it('should set the ids correctly in column 2', () => {
            const columnNumber = 1;
            expect(
                componentWithIds.container.querySelectorAll('tr')[1].querySelectorAll('td')[columnNumber].id,
            ).to.equal('name0');
            expect(
                componentWithIds.container.querySelectorAll('tr')[2].querySelectorAll('td')[columnNumber].id,
            ).to.equal('name1');
        });

        it('should set the ids correctly in column 3', () => {
            const columnNumber = 2;
            expect(
                componentWithIds.container.querySelectorAll('tr')[1].querySelectorAll('td')[columnNumber].id,
            ).to.equal('additional-info0');
            expect(
                componentWithIds.container.querySelectorAll('tr')[2].querySelectorAll('td')[columnNumber].id,
            ).to.equal('additional-info1');
        });
    });

    describe('componentWithCaptionClass', () => {
        let componentWithCaptionClass: RenderResult;
        beforeEach(() => {
            componentWithCaptionClass = render(
                <ExampleTable data={exampleData} caption={caption} captionClass={captionClass}>
                    <Column header="Id" value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                    <Column header="Name" value={(x: ExampleDataItem) => x.name} width={150} />
                    <Column
                        header="Additional Information"
                        value={(x: ExampleDataItem) => x.name + ' additional information'}
                        width={200}
                    />
                </ExampleTable>,
            );
        });

        it('should set the correct caption class', () => {
            expect(componentWithCaptionClass.container.querySelector('caption')?.className).to.equal(
                `govuk-table__caption ${captionClass}`,
            );
        });
    });

    describe('componentWithAlign', () => {
        let componentWithAlign: RenderResult;

        beforeEach(() => {
            componentWithAlign = render(
                <ExampleTable data={exampleData}>
                    <Column
                        header="Id"
                        value={(x: ExampleDataItem) => x.id.toString()}
                        width={100}
                        textAlign={'right'}
                    />
                    <Column
                        header="Name"
                        value={(x: ExampleDataItem) => x.name}
                        width={150}
                        dataType="numeric"
                        textAlign={'center'}
                    />
                    <Column header="NoAlign" value={(x: ExampleDataItem) => x.name} width={150} />
                </ExampleTable>,
            );
        });

        it('should have correct text alignment', () => {
            const headerRow = componentWithAlign.container.querySelector('tr');
            expect(headerRow?.querySelectorAll('th')[0].className).to.eql('govuk-table__header u-align-right');
            expect(headerRow?.querySelectorAll('th')[1].className).to.eql(
                'govuk-table__header govuk-table__header--numeric u-align-center',
            );
            expect(headerRow?.querySelectorAll('th')[2].className).to.eql('govuk-table__header');

            expect(componentWithAlign.container.querySelectorAll('tr')[2].querySelectorAll('td')[0].className).to.eql(
                'govuk-table__cell u-align-right',
            );
            expect(componentWithAlign.container.querySelectorAll('tr')[2].querySelectorAll('td')[1].className).to.eql(
                'govuk-table__cell govuk-table__cell--numeric u-align-center',
            );
            expect(componentWithAlign.container.querySelectorAll('tr')[2].querySelectorAll('td')[2].className).to.eql(
                'govuk-table__cell',
            );
        });
    });

    describe('componentWithPrintHiddenCell', () => {
        let componentWithPrintHiddenCell: RenderResult;

        beforeEach(() => {
            componentWithPrintHiddenCell = render(
                <ExampleTable data={exampleData} caption={caption} captionClass={captionClass}>
                    <Column header="Id" value={(x: ExampleDataItem) => x.id.toString()} width={100} printHidden />
                </ExampleTable>,
            );
        });

        it('should have have class print-hide if printHidden specified', () => {
            const headerRow = componentWithPrintHiddenCell.container.querySelectorAll('tr')[0];
            const cell = componentWithPrintHiddenCell.container.querySelectorAll('tr')[1];

            expect(headerRow?.querySelector('th')?.className).to.eql('govuk-table__header print-hide');
            expect(cell?.querySelector('td')?.className).to.eql('govuk-table__cell print-hide');
        });
    });

    describe('componentWithCheckboxes', () => {
        let componentWithCheckboxes: RenderResult;

        beforeEach(() => {
            componentWithCheckboxes = render(
                <ExampleTable
                    data={exampleData}
                    caption={caption}
                    rowClassName={(x: ExampleDataItem) => (x.id === 1 ? 'rowClassAdded' : '')}
                >
                    <Column
                        selectAllHeader="checkBoxTargetName"
                        header=""
                        value={(x: ExampleDataItem) => (
                            <TableCheckbox
                                value={x.id.toString()}
                                name="checkBoxTargetName"
                                hiddenLabel={'hidden string for accessibility'}
                            ></TableCheckbox>
                        )}
                    />
                    <Column header="Id" value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                </ExampleTable>,
            );
        });

        it('should have a select all button if specified', () => {
            const headerRow = componentWithCheckboxes.container.querySelectorAll('tr')[0];
            const checkbox = headerRow.querySelectorAll('th')[0].querySelector('input');
            expect(checkbox?.name).to.eql('select all checkBoxTargetName');
        });
    });

    describe('componentWithAriaLabel', () => {
        let componentWithAriaLabel: RenderResult;

        beforeEach(() => {
            componentWithAriaLabel = render(
                <ExampleTable data={exampleData} caption={caption} captionClass={captionClass}>
                    <Column header="" value={(x: ExampleDataItem) => x.id.toString()} ariaLabel="Action" />
                </ExampleTable>,
            );
        });

        it('should have have hidden labels if ariaLabel is specified', () => {
            const headerRow = componentWithAriaLabel.container.querySelectorAll('tr')[0];
            const cell = componentWithAriaLabel.container.querySelectorAll('tr')[1];

            expect(headerRow?.querySelector('th')?.innerHTML).to.eql('<div class="govuk-visually-hidden">Action</div>');
            expect(cell?.querySelector('td')?.outerHTML).to.eql(
                '<td class="govuk-table__cell" aria-label="Action">1</td>',
            );
        });
    });

    describe('componentWithErrorMessages', () => {
        let componentWithErrorMessages: RenderResult;

        beforeEach(() => {
            componentWithErrorMessages = render(
                <ExampleTable data={exampleData} errorMessages={['Error message 1', 'Error message 2']}>
                    <Column header="" value={(x: ExampleDataItem) => x.id.toString()} ariaLabel="Action" />
                </ExampleTable>,
            );
        });

        it('should have error classes if error is present', () => {
            expect(componentWithErrorMessages.container.querySelector('.application-item--error.error-target')).to.not
                .be.null;
        });

        it('should have error messages if error is present', () => {
            expect(componentWithErrorMessages.queryByText('Error message 1')).to.not.be.null;
            expect(componentWithErrorMessages.queryByText('Error message 2')).to.not.be.null;
        });
    });

    describe('componentWithLabel', () => {
        let componentWithLabel: RenderResult;

        beforeEach(() => {
            componentWithLabel = render(
                <ExampleTable data={exampleData} caption={caption} label="Test Label">
                    <Column header="Id" value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                </ExampleTable>,
            );
        });

        it('should have error messages if error is present', () => {
            expect(componentWithLabel.queryAllByText('Test Label').length).to.not.equal(0);
        });
    });

    describe('componentWithHeaderColSpan', () => {
        let componentWithHeaderColSpan: RenderResult;

        beforeEach(() => {
            componentWithHeaderColSpan = render(
                <ExampleTable data={exampleData} caption={caption} label="Test Label">
                    <Column header="Id" headerColSpan={2} value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                    <Column header="Id2" value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                </ExampleTable>,
            );
        });

        it('should set the correct colspan of header', () => {
            expect(componentWithHeaderColSpan.container.querySelectorAll('th')[0].getAttribute('colspan')).to.equal(
                '2',
            );
            expect(componentWithHeaderColSpan.container.querySelectorAll('th').length).to.equal(1);
            expect(
                componentWithHeaderColSpan.container.querySelectorAll('tr')[1].querySelectorAll('td').length,
            ).to.equal(2);
        });
    });

    describe('componentWithRowColSpan', () => {
        let componentWithRowColSpan: RenderResult;

        beforeEach(() => {
            componentWithRowColSpan = render(
                <ExampleTable data={exampleData} caption={caption} label="Test Label">
                    <Column header="Id" rowColSpan={2} value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                    <Column header="Id2" value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                </ExampleTable>,
            );
        });

        it('should set the correct colspan of rows', () => {
            expect(componentWithRowColSpan.container.querySelectorAll('td')[0].getAttribute('colspan')).to.equal('2');
            expect(componentWithRowColSpan.container.querySelectorAll('tr')[1].querySelectorAll('td').length).to.equal(
                1,
            );
            expect(componentWithRowColSpan.container.querySelectorAll('th').length).to.equal(2);
        });
    });

    describe('componentWithBorderRight', () => {
        let componentWithBorderRight: RenderResult;

        beforeEach(() => {
            componentWithBorderRight = render(
                <ExampleTable data={exampleData} caption={caption} label="Test Label">
                    <Column header="Id" borderRight value={(x: ExampleDataItem) => x.id.toString()} width={100} />
                </ExampleTable>,
            );
        });

        it('should set the correct border of column', () => {
            expect(componentWithBorderRight.container.querySelector('.cell-border-right')).to.not.be.null;
        });
    });

    describe('with row errors', () => {
        const renderComponentWithRowErrors = (rowErrors: string | string[]) =>
            render(
                <ExampleTable data={[{ name: 'name', id: 1, rowError: rowErrors }]}>
                    <Column header="" value={(x: ExampleDataItem) => x.id.toString()} ariaLabel="Action" />
                </ExampleTable>,
            );

        it('should display single row level error message', () => {
            const rowsWithError =
                renderComponentWithRowErrors('Single row error').container.getElementsByClassName(
                    'govuk-table--error-row',
                );

            expect(rowsWithError.length).to.be.greaterThan(0);

            within(rowsWithError[0] as HTMLElement).getAllByText('Single row error');
        });

        it('should not display when error message is an empty string', () => {
            const rowsWithError =
                renderComponentWithRowErrors('').container.getElementsByClassName('govuk-table--error-row');
            expect(rowsWithError.length).to.equal(0);
        });

        it('should display stacked row level error messages', () => {
            const rowWithError = renderComponentWithRowErrors([
                'Row error message 1',
                'Row error message 2',
            ]).container.getElementsByClassName('govuk-table--error-row');

            expect(rowWithError.length).to.be.greaterThan(1);

            within(rowWithError[0] as HTMLElement).getAllByText('Row error message 1');
            within(rowWithError[1] as HTMLElement).getAllByText('Row error message 2');
        });

        it('should not display when error messages are an empty array', () => {
            const rowsWithError = renderComponentWithRowErrors([]).container.getElementsByClassName(
                'govuk-table--error-row',
            );
            expect(rowsWithError.length).to.equal(0);
        });
    });

    describe('componentWithInlineHeader', () => {
        let componentWithInlineHeader: RenderResult;

        beforeEach(() => {
            componentWithInlineHeader = render(
                <ExampleTable data={exampleData} caption={caption} label="Test Label">
                    <Column
                        header="Id"
                        borderRight
                        value={(x: ExampleDataItem) => x.id.toString()}
                        width={100}
                        isInlineHeader={(_, { row }) => row === 1}
                    />
                </ExampleTable>,
            );
        });

        it('should render inline header row', () => {
            const headerRow = componentWithInlineHeader.container.querySelectorAll('tr')[2].querySelectorAll('th')[0];

            expect(
                componentWithInlineHeader.container.querySelectorAll('tr')[1].querySelectorAll('td')[0].textContent,
            ).to.equal('1');
            expect(headerRow.textContent).to.equal('2');
            expect(headerRow.getAttribute('scope')).to.equal('row');
        });
    });
});
