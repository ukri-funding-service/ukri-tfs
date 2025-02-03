export interface PolicyRole {
    id: number;
    name: string;
    isDefaultApplicationRole: boolean;
    requiresGrantEligibleOrganisation?: boolean;
    isLeadAwardHolder: boolean;
    description: string;
}
