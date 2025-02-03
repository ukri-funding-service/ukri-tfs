import React from 'react';
import { Column, Form, Paragraph, TypedTable, withPagination } from '../../';
import { Organisation } from './types/organisation';
import { CsrfProps } from '@ukri-tfs/frontend-utils';
import { PageInfo } from '../../utils/pageInfo';

export interface ResultListProps {
    pageInfo: PageInfo & { baseUrl?: string };
    organisations: Organisation[];
    manualAddOrganisationUrl: string;
    searchTerm: string;
    resultsHint?: string;
}

export const resultList = (props: ResultListProps, csrfProps: CsrfProps): JSX.Element => {
    const totalRecords = props.pageInfo.totalRecords;

    const renderFooter = (): JSX.Element => {
        return (
            <>
                <p className="govuk-body">If you cannot find the right organisation, try:</p>
                <ul className="govuk-list govuk-list--bullet">
                    <li>double-checking your spelling</li>
                    <li>using different search terms</li>
                    <li>searching for something less specific</li>
                </ul>
                {props.manualAddOrganisationUrl && (
                    <p className="govuk-body">
                        Or you can{' '}
                        <a id="new-organisation" className="govuk-link" href={props.manualAddOrganisationUrl}>
                            enter the organisation&#39;s details manually
                        </a>
                        .
                    </p>
                )}
            </>
        );
    };

    const tableListOfOrgs = (): JSX.Element => {
        const pageProps = {
            currentPage: props.pageInfo.page,
            pagesToShow: props.pageInfo.pageSize,
            totalPages: props.pageInfo.totalPages,
            getLink: (val: number) => `${props.pageInfo.baseUrl}&page=${val}`,
        };

        const summaryProps = {
            startResult: props.pageInfo.startRecord!,
            endResult: props.pageInfo.endRecord!,
            totalResults: props.pageInfo.totalRecords,
            resultsName: 'items',
        };

        const TableWithPagination = withPagination(TypedTable<Organisation>());

        return (
            <TableWithPagination
                data={props.organisations}
                caption={''}
                id={'search-orgs-result-table'}
                paginationPages={pageProps}
                paginationSummary={summaryProps}
                tableClassName="govuk-!-margin-bottom-0"
            >
                <Column
                    header="Organisation name and details"
                    value={(org: Organisation) => (
                        <div>
                            <span>
                                <strong>{org.name} </strong>
                            </span>
                            <br />
                            <span className="meta">
                                {[org.city, org.country]
                                    .filter(i => i && i.length)
                                    .map((i: string) => i.trim())
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </div>
                    )}
                    width={60}
                />
                <Column
                    textAlign="right"
                    ariaLabel="Action"
                    header=""
                    value={(org: Organisation) => (
                        <Form
                            {...csrfProps}
                            name="selectOrganisation"
                            method="POST"
                            key={`select-organisation-${org.id}`}
                        >
                            <input type="hidden" name="organisationId" value={org.id} />
                            <input className="govuk-button--link" type="submit" value="Select organisation" />
                        </Form>
                    )}
                    width={30}
                />
            </TableWithPagination>
        );
    };

    let resultsHint = <></>;
    if (props.resultsHint) {
        resultsHint = <Paragraph>{props.resultsHint}</Paragraph>;
    }

    if (totalRecords > 0) {
        return (
            <section id="results-info">
                <p id="organisation-results-text" className="govuk-body">
                    {totalRecords} result{totalRecords === 1 ? '' : 's'} for <b>&apos;{props.searchTerm}&apos;</b>.
                </p>
                {resultsHint}
                {tableListOfOrgs()}
                {renderFooter()}
            </section>
        );
    } else {
        return (
            <>
                <p id="organisation-results-text" className="govuk-body">
                    There are no results for <b>&apos;{props.searchTerm}&apos;</b>.
                </p>
                {renderFooter()}
            </>
        );
    }
};
