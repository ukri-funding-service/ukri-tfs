import React from 'react';
import { Column, TypedTable } from '../../../components';
import { displayCurrencyWithOptionalDecimals } from '../../../helpers';
import { ApplicationProjectPartner } from '../types/applicationViewContent';

interface TfsApplicationContentProjectPartnerSectionProps {
    id: string;
    partners: ApplicationProjectPartner[];
}

interface ProjectPartnersTableProps {
    partners: ApplicationProjectPartner[];
    editColumnFunction?: (partner: ApplicationProjectPartner) => React.ReactElement;
}

export const ProjectPartnersTable = (props: ProjectPartnersTableProps): React.ReactElement => {
    const Table = TypedTable<ApplicationProjectPartner>();

    return (
        <Table data={props.partners}>
            <Column
                header="Project partner"
                value={(projectPartner: ApplicationProjectPartner) => {
                    return (
                        <>
                            <b>{projectPartner.organisation.name}</b>
                            <br />
                            {projectPartner.organisation.city}, {projectPartner.organisation.country}
                        </>
                    );
                }}
            />
            <Column
                header="Contact"
                value={(projectPartner: ApplicationProjectPartner) => {
                    return (
                        <>
                            <b>{projectPartner.contactData.firstName + ' ' + projectPartner.contactData.lastName}</b>
                            <br />
                            {projectPartner.contactData.email}
                        </>
                    );
                }}
            />
            <Column
                header="Direct contribution"
                value={(projectPartner: ApplicationProjectPartner) => {
                    if (!projectPartner.directContribution) {
                        return <></>;
                    }

                    return (
                        <>
                            <b>{'£' + displayCurrencyWithOptionalDecimals(projectPartner.directContribution.value)}</b>
                            <br />
                            {projectPartner.directContribution.summary}
                        </>
                    );
                }}
            />
            <Column
                header="Indirect contribution"
                value={(projectPartner: ApplicationProjectPartner) => {
                    if (!projectPartner.inKindContribution) {
                        return <></>;
                    }

                    return (
                        <>
                            <b>{'£' + displayCurrencyWithOptionalDecimals(projectPartner.inKindContribution.value)}</b>
                            <br />
                            {projectPartner.inKindContribution.summary}
                        </>
                    );
                }}
            />
            {props.editColumnFunction ? <Column header="" value={props.editColumnFunction} /> : <></>}
        </Table>
    );
};

export const TfsApplicationContentProjectPartnerSection: React.FunctionComponent<TfsApplicationContentProjectPartnerSectionProps> =
    ({ partners, id }): JSX.Element => {
        const partnerContent =
            partners?.length > 0 ? (
                <ProjectPartnersTable partners={partners} />
            ) : (
                <p className="govuk-body serif meta">No project partners.</p>
            );
        return (
            <div id={id} style={{ overflowX: 'auto' }}>
                {partnerContent}
            </div>
        );
    };
