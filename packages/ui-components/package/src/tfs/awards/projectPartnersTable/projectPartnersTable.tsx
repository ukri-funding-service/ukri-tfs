import { Button } from 'govuk-react-jsx';
import React, { ReactElement } from 'react';
import { Column, TypedTable } from '../../../components/table';

export interface TfsProjectPartner {
    projectPartnerId: number;
    awardId: number;
    organisationName: string;
    directContributionPence: number;
    inKindContributionPence: number;
    nameOfContact: string;
    country: string;
}

export interface TfsProjectPartnersTableProps {
    projectPartners: TfsProjectPartner[];
    editMode?: boolean;
    testId?: string;
}

export const sortProjectPartners = (projectPartners: TfsProjectPartner[]): TfsProjectPartner[] => {
    return projectPartners.sort((a, b) => {
        return a.organisationName.localeCompare(b.organisationName);
    });
};

export const formatPenceAsPoundsCurrency = (penceValue: number): string => {
    const pounds = penceValue / 100;
    const fixedPounds = pounds.toFixed(2);

    return fixedPounds.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ProjectPartnersTableType = TypedTable<TfsProjectPartner>();

export const TfsProjectPartnersTable = (props: TfsProjectPartnersTableProps): ReactElement => {
    return (
        <ProjectPartnersTableType data={sortProjectPartners(props.projectPartners)} id={props.testId}>
            <Column
                header="Organisation name"
                value={(projectPartner: TfsProjectPartner) => projectPartner.organisationName}
            />
            <Column header="Country" value={(projectPartner: TfsProjectPartner) => projectPartner.country} />
            <Column
                dataType="numeric"
                header="Direct contribution (£)"
                value={(projectPartner: TfsProjectPartner) =>
                    formatPenceAsPoundsCurrency(projectPartner.directContributionPence)
                }
            />
            <Column
                dataType="numeric"
                header="Indirect contribution (£)"
                value={(projectPartner: TfsProjectPartner) =>
                    formatPenceAsPoundsCurrency(projectPartner.inKindContributionPence)
                }
            />
            <Column
                header="Name of contact"
                value={(projectPartner: TfsProjectPartner) => projectPartner.nameOfContact}
            />
            {props.editMode ? (
                <Column
                    header=""
                    value={(partner: TfsProjectPartner) => (
                        <Button className="govuk-button--link" name="remove-partner" value={partner.projectPartnerId}>
                            Remove
                        </Button>
                    )}
                />
            ) : (
                <></>
            )}
        </ProjectPartnersTableType>
    );
};
