import { array, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Label } from 'govuk-react-jsx';
import React from 'react';
import * as Components from '../';
import { withPagination } from '../';
import { Column, TypedTable } from '../components/table';

const stories = storiesOf('Custom Components', module);
stories.addDecorator(withKnobs);

interface ExampleDataItem {
    name: string;
    id: number;
}

stories.add('Table with Pagination', () => {
    const ExampleTable = TypedTable<ExampleDataItem>();
    const opps = array(
        'Opportunity names',
        [
            'OPP564: UK-Canada Diabetes Research Team Grants',
            'OPP8964: Strength in places Round 3',
            'OPP8965: Strength in other places Round 2',
            'OPP8966: Strength in some places Round 1',
        ],
        '\n',
    );
    const exampleData: ExampleDataItem[] = opps.map((item, i) => {
        return { name: item, id: i + 1 };
    });

    const TableWithPagination = withPagination(ExampleTable);

    const pageProps = {
        currentPage: number('Current page', 10),
        pagesToShow: number('Pages to show', 10),
        totalPages: number('End value', 20),
        getLink: (val: number) => `${text('Url', '#')}?page=${val}`,
    };

    const summaryProps = {
        startResult: number('Start result', 201),
        endResult: number('End result', 220),
        totalResults: number('Total results', 400),
        resultsName: text('Results name', 'items'),
    };

    return (
        <TableWithPagination
            data={exampleData}
            caption={text('Caption', '')}
            id={text('id', 'example-table')}
            paginationPages={pageProps}
            paginationSummary={summaryProps}
        >
            <Column
                header="Id"
                value={(x: ExampleDataItem) => <Label htmlFor="storybook-placeholder">{x.id.toString()}</Label>}
                width={15}
            />
            <Column
                header="Name"
                value={(x: ExampleDataItem) => <Components.GdsLinkButton text={x.name} href="#" ariaLabel="" />}
                width={60}
            />
            <Column
                header=""
                value={() => <Components.GdsLinkButton text="Delete Opportunity" href="#" ariaLabel="" />}
                width={30}
            />
        </TableWithPagination>
    );
});
