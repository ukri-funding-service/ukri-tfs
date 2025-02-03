import { FileMetadata } from '../../../components';
import { Organisation } from '../../extendedOrgList/types/organisation';

interface SectionSharedProperties {
    title: string;
    formUrl?: string;
}

export interface PolicyRole {
    id: number;
    name: string;
}

export enum TfsApplicationSectionType {
    Details = 'DETAILS',
    Applicants = 'APPLICANTS',
    Custom = 'CUSTOM',
    Costs = 'COSTS',
    StructuredCosts = 'FULL_RESOURCES_AND_COSTS',
    ProjectPartners = 'PROJECT_PARTNERS',
}

export interface DetailsSection extends SectionSharedProperties {
    type: TfsApplicationSectionType.Details;
    summary?: string;
    displayStartDateAndDuration: boolean;
    projectStartDate?: string;
    projectDuration?: string;
    summaryTitle?: string;
}

export interface CustomQuestionSection extends SectionSharedProperties {
    type: TfsApplicationSectionType.Custom;
    questionsetId: string;
    questionSubTitleLabel: string;
    questionGuidanceNotesContent: string;
    fileMetadata: FileMetadata[];
    answer?: string;
}

export interface ApplicantSummary {
    name: string;
    email: string;
    role: string | undefined;
    organisationName: string;
}

export interface StaffPerson extends ApplicantSummary {
    id: number; // personId
    applicationPersonId: number;
    organisationId: number;
}

export interface ApplicantsSection extends SectionSharedProperties {
    type: TfsApplicationSectionType.Applicants;
    applicants: ApplicantSummary[];
}

interface CostCategory {
    name: string;
    sequence: number;
    percentage: number;
    costAmount: number | null;
    opportunityCostPolicyCategoryId: number;
}

export interface CostPolicy {
    id?: number;
    isComplete: boolean;
    costCategories: CostCategory[];
}

export interface CostPolicySection extends SectionSharedProperties {
    type: TfsApplicationSectionType.Costs;
    costPolicy?: CostPolicy;
}
export interface OpportunityCostPolicyCategory {
    id?: number;
    name?: string;
    percentageValue?: number;
    parentId?: number;
    sequence?: number;
}

export interface OpportunityCostPolicyCategoryTree {
    id?: number;
    name?: string;
    percentageValue?: number;
    sequence?: number;
    children: OpportunityCostPolicyCategoryTree[];
}

export interface StaffCost {
    id: number;
    applicationPersonId?: number;
    unnamedLabel?: string;
    unnamedRoleId?: number;
    applicationCostId: number;
    opportunityCostCategoryId?: number;
    ftePercentage?: number;
    fullEconomicCostPence?: number;
    startDate?: Date;
    endDate?: Date;
}

export interface LinkedCostCategory {
    id?: number;
    opportunityCostPolicyCategoryId: number;
    costAmountGbp?: number;
}

export interface LinkedCost {
    id?: number;
    organisationId?: number;
    organisation?: Organisation;
    linkedCostCategories?: LinkedCostCategory[];
    staffCosts?: StaffCost[];
}

export interface StructuredCosts {
    costPolicyCategoryTrees: OpportunityCostPolicyCategoryTree[];
    costPolicyCategories: OpportunityCostPolicyCategory[];
    linkedCosts: LinkedCost[];
    applicants: StaffPerson[];
    policyRoles: PolicyRole[];
    breakdownUrl: string;
    justification?: string | null;
    disableBreakdown?: true;
}

export interface StructuredCostSection extends SectionSharedProperties {
    type: TfsApplicationSectionType.StructuredCosts;
    structuredCosts: StructuredCosts;
}

export interface ProjectPartnersSection extends SectionSharedProperties {
    type: TfsApplicationSectionType.ProjectPartners;
    partners: ApplicationProjectPartner[];
}

export type TfsApplicationSection =
    | DetailsSection
    | CustomQuestionSection
    | ApplicantsSection
    | CostPolicySection
    | StructuredCostSection
    | ProjectPartnersSection;

export interface TfsApplicationViewContent {
    name: string;
    showEditLinks: boolean;
    sections: TfsApplicationSection[];
}
export interface ApplicationProjectPartnersContactData {
    firstName: string;
    lastName: string;
    email: string;
}

export interface ApplicationProjectPartnerContribution {
    value: number;
    summary: string;
}

export interface ApplicationProjectPartner {
    id: number;
    organisation: Organisation;
    contactData: ApplicationProjectPartnersContactData;
    directContribution: ApplicationProjectPartnerContribution | null;
    inKindContribution: ApplicationProjectPartnerContribution | null;
}
