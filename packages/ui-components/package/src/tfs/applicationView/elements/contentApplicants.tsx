import React from 'react';
import { ApplicantSummary } from '../types/applicationViewContent';
import { TypedTable, Column } from '../../../components/table';

interface TfsApplicationContentApplicantsSectionProps {
    id: string;
    className?: string;
    applicants: ApplicantSummary[];
    hideEmail: boolean;
}

const ApplicantsTable = TypedTable<ApplicantSummary>();

const getName = (applicant: ApplicantSummary) => applicant.name;
const getEmail = (applicant: ApplicantSummary) => applicant.email;
const getRole = (applicant: ApplicantSummary) => (applicant.role ? applicant.role : '');
const getOrganisation = (applicant: ApplicantSummary) => applicant.organisationName;

const applicantsTable = (
    applicants: ApplicantSummary[],
    attributes: Omit<TfsApplicationContentApplicantsSectionProps, 'applicants'>,
): JSX.Element => (
    <ApplicantsTable
        tableClassName="govuk-!-font-size-16"
        data={applicants}
        captionClass="govuk-heading-s serif"
        {...attributes}
    >
        <Column header="Name" value={getName} />
        <Column header="Role" value={getRole} />
        <Column header="Organisation" value={getOrganisation} />
        {attributes.hideEmail ? null : <Column printHidden header="Email" value={getEmail} />}
    </ApplicantsTable>
);

export const TfsApplicationContentApplicantsSection: React.FunctionComponent<TfsApplicationContentApplicantsSectionProps> =
    ({ applicants, ...attributes }): JSX.Element => {
        return applicantsTable(applicants, attributes);
    };
