import { array, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { BackLink, HeaderLink, Label } from 'govuk-react-jsx';
import React from 'react';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Column, GdsErrorSummary, GdsLinkButton, Paragraph, ProgressBar, TypedTable } from '../components/index';
import { HeadingText, PageLayoutDefault, PageLayoutFull, PageLayoutFullWidth, PageLayoutList } from '../index';

const headerItems: HeaderLink[] = [
    {
        id: 'headerInactiveLink',
        text: 'Inactive Header',
        url: '#',
        isActive: false,
        navType: 'TOP',
    },
    {
        id: 'headerOpportunitiesLink',
        text: 'Opportunities',
        url: '#',
        isActive: true,
        currentlySelected: true,
        navType: 'TOP',
    },
    {
        id: 'headerApplicationsLink',
        text: 'Applications',
        url: '#',
        isActive: true,
        currentlySelected: false,
        navType: 'TOP',
    },
];

const PageWrapping: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout--full-height">
            <Header isAdmin={true} signedIn={true} items={headerItems} />

            <div id="main-content" className="container full-width">
                {children}
            </div>

            <Footer />
        </div>
    );
};

const heading = (
    <HeadingText
        caption={text('Caption', 'A caption (edit me longer!)')}
        text={text('Heading', 'A heading (edit me longer!)')}
        size="l"
        tag="h1"
    />
);
interface ExampleDataItem {
    name: string;
    id: number;
}

const ExampleTable = TypedTable<ExampleDataItem>();
const opps = array(
    'Opportunity names',
    ['OPP564: UK-Canada Diabetes Research Team Grants', 'OPP8964: Strength in places Round 3'],
    '\n',
);
const exampleData: ExampleDataItem[] = opps.map((item, i) => {
    return { name: item, id: i + 1 };
});

const table = (
    <ExampleTable data={exampleData}>
        <Column
            header="Id"
            value={(x: ExampleDataItem) => (
                <Label className="govuk-label--s" htmlFor="storybook-placeholder">
                    {x.id.toString()}
                </Label>
            )}
        />
        <Column header="Name" value={(x: ExampleDataItem) => <GdsLinkButton text={x.name} href="#" ariaLabel="" />} />
        <Column header="" value={() => <GdsLinkButton text="Delete Opportunity" href="#" ariaLabel="" />} />
    </ExampleTable>
);

const progressBar = (
    <ProgressBar
        prependedHiddenAccessibilityText="Your application is"
        percentComplete={50}
        appendedText="complete"
        displayPercentage={true}
    />
);

const summaryInfo = (
    <div className="application-data">
        <dl className="application-data__list">
            <dt className="application-data__key">Opportunity:</dt>
            <dd className="application-data__value">OPP001: Biosensors for ribosome inactivating protiens</dd>
            <dt className="application-data__key">Application reference:</dt>
            <dd className="application-data__value">APP001</dd>
            <dt className="application-data__key">Application deadline:</dt>
            <dd className="application-data__value">Saturday 29 February 2020, 4:00pm</dd>
            <dt className="application-data__key">Funder(s):</dt>
            <dd className="application-data__value">AHRC, BBSRC, EPSRC</dd>
        </dl>
    </div>
);

const errors = array('Error messages', [
    'Please enter your username',
    'Your password must be at least 8 characters long',
]);
const errorArray = errors.map((x, i) => {
    return { message: x, fieldName: i.toString() };
});
const errorSummary = <GdsErrorSummary errors={errorArray} />;

const sidebar = (
    <React.Fragment>
        {progressBar}
        {summaryInfo}
    </React.Fragment>
);

const main = (
    <React.Fragment>
        <Paragraph id="test">
            Main Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto expedita praesentium amet voluptatum
            assumenda repellat ratione dolorum molestias fugiat doloribus nobis tempore
        </Paragraph>
        {table}
    </React.Fragment>
);

const breadcrumbs = <BackLink href="#">Back to where you came from</BackLink>;

const stories = storiesOf('Layout Components', module);

stories.add('Page layout - default', () => {
    return (
        <PageWrapping>
            <PageLayoutDefault
                breadcrumbs={breadcrumbs}
                heading={heading}
                errorSummary={errorSummary}
                main={main}
                sideBar={sidebar}
            />
        </PageWrapping>
    );
});

stories.add('Page layout - default sidebar omitted', () => {
    return (
        <PageWrapping>
            <PageLayoutDefault breadcrumbs={breadcrumbs} heading={heading} errorSummary={errorSummary} main={main} />
        </PageWrapping>
    );
});

stories.add('Page layout - default noSidebar true', () => {
    return (
        <PageWrapping>
            <PageLayoutDefault
                breadcrumbs={breadcrumbs}
                heading={heading}
                errorSummary={errorSummary}
                main={main}
                noSidebar={true}
            />
        </PageWrapping>
    );
});

stories.add('Page layout - list', () => {
    return (
        <PageWrapping>
            <PageLayoutList
                breadcrumbs={breadcrumbs}
                heading={heading}
                main={main}
                sideBar={sidebar}
                errorSummary={errorSummary}
            />
        </PageWrapping>
    );
});

stories.add('Page layout - full', () => {
    return (
        <PageWrapping>
            <PageLayoutFull breadcrumbs={breadcrumbs} heading={heading} main={main} errorSummary={errorSummary} />
        </PageWrapping>
    );
});

stories.add('Page layout - full width', () => {
    return (
        <PageWrapping>
            <PageLayoutFullWidth breadcrumbs={breadcrumbs} heading={heading} main={main} errorSummary={errorSummary} />
        </PageWrapping>
    );
});
