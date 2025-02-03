import { select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Button, Label } from 'govuk-react-jsx';
import React from 'react';
import { GdsLinkButton } from '../components/linkButton';
import { TableCheckbox } from '../components/tableCheckbox';
import { TfsStatus, TfsStatusType } from '../components/tfsStatus';
import { TypedTable, Column } from '../components/table';

const stories = storiesOf('Components', module);

interface ExampleDataItem {
    name: string;
    id: number;
    statusText: string;
    statusType: TfsStatusType;
}

stories.add('Table', () => {
    const ExampleTable = TypedTable<ExampleDataItem>();
    const exampleData: ExampleDataItem[] = [
        {
            name: 'OPP564: UK-Canada Diabetes Research Team Grants',
            id: 564,
            statusText: 'Success',
            statusType: 'success',
        },
        { name: 'OPP8964: Strength in places Round 3', id: 8964, statusText: 'cross', statusType: 'cross' },
        { name: 'OPP8965: Strength in places Round 1293', id: 8965, statusText: 'info', statusType: 'info' },
    ];
    const knobGroup = 'sortOption';
    const sortOption = select('Sort option', ['ascending', 'descending', 'none', undefined], undefined, knobGroup);

    return (
        <div className="js-enabled">
            <ExampleTable
                data={exampleData}
                caption={text('Caption', '')}
                errorMessages={['Error message 1']}
                label="Test Label"
            >
                <Column
                    selectAllHeader="checkBoxTargetName"
                    ariaSort={sortOption}
                    header=""
                    value={(x: ExampleDataItem) => (
                        <TableCheckbox
                            value={x.id.toString()}
                            name="checkBoxTargetName"
                            hiddenLabel={'hidden string for accessibility'}
                        ></TableCheckbox>
                    )}
                />
                <Column
                    header="Id"
                    value={(x: ExampleDataItem) => (
                        <Label className="govuk-label--s" htmlFor="storybook-placeholder">
                            {x.id.toString()}
                        </Label>
                    )}
                    width={15}
                />
                <Column
                    header="Name"
                    value={(x: ExampleDataItem) => <GdsLinkButton text={x.name} href="#" ariaLabel="" />}
                    width={60}
                />
                <Column
                    header={
                        <Button className="govuk-button--link" name="delete-all-opportunities" value="opportnuity-ids">
                            Delete all
                        </Button>
                    }
                    value={() => <GdsLinkButton text="Delete Opportunity" href="#" ariaLabel="" />}
                    width={30}
                />
                <Column
                    header="Status"
                    value={(x: ExampleDataItem) => <TfsStatus statusType={x.statusType} text={x.statusText} />}
                    width={30}
                />
            </ExampleTable>
        </div>
    );
});
