export type KeyValue = { [k: string]: string | number };
export type OptionalKeyValue = { [k: string]: string | number | undefined | string[] | number[] };

export class Path<T extends KeyValue> {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    private injectParams(params: Partial<T>): string {
        const path = this.path;
        return Object.keys(params).reduce((acc: string, cur: string) => {
            const arg = params[cur];
            if (arg !== undefined) {
                const type = typeof params[cur];
                acc = acc.replace(`<${type}:${cur}>`, arg.toString());
            }
            return acc;
        }, path);
    }

    private encodeParams(params: OptionalKeyValue): OptionalKeyValue {
        const args = { ...params };

        return Object.keys(args).reduce((acc: object, cur: string) => {
            const arg = args[cur];
            if (typeof arg === 'string') {
                acc = { ...acc, [cur]: encodeURIComponent(arg) };
            } else if (Array.isArray(arg)) {
                const encodedVals: string[] = [];
                arg.forEach((val: string | number) => {
                    encodedVals.push(encodeURIComponent(val));
                });
                acc = { ...acc, [cur]: encodedVals };
            } else {
                acc = { ...acc, [cur]: arg };
            }
            return acc;
        }, {});
    }

    private appendQueryParamsToUrl(path: string, queryParams: OptionalKeyValue): string {
        const formattedQueries = Object.keys(queryParams).flatMap((key: string) => {
            const val = queryParams[key];
            if (Array.isArray(val)) {
                const paramVals: string[] = [];
                val.forEach((paramVal: string | number) => {
                    paramVals.push(`${key}=${paramVal}`);
                });
                return paramVals;
            } else if (val === '' || val === undefined) {
                return [`${key}`];
            } else {
                return [`${key}=${queryParams[key]}`];
            }
        });
        const joinedQueries = formattedQueries.join('&');
        return `${path}?${joinedQueries}`;
    }

    generate(params?: Partial<T>, queryParams?: OptionalKeyValue): string {
        let url = this.path;

        if (params !== undefined) {
            const encodedParams = this.encodeParams(params) as Partial<T>;
            url = this.injectParams(encodedParams);
        }

        if (queryParams !== undefined) {
            const encodedParams = this.encodeParams(queryParams);
            url = this.appendQueryParamsToUrl(url, encodedParams);
        }

        return url;
    }
}

export interface ApplicationParams {
    applicationId: string;
}

export interface OrganisationParams {
    organisationId: number;
}

export interface ApplicantParams {
    applicantId: number;
}

export interface RoleId {
    roleId: number;
}
type OrganisationApplicationParams = ApplicationParams & OrganisationParams;
type IndividualStaffCostParams = OrganisationApplicationParams & ApplicantParams;
type UnnamedStaffCostParams = OrganisationApplicationParams & RoleId;

export interface InviteUuidParams extends ApplicationParams {
    inviteUuid: string;
}

export interface OpportunityParams {
    opportunityId: string;
}

export interface OppAppParams extends OpportunityParams {
    applicationComponentId: number;
}

export interface OppAppOrgParams extends OppAppParams {
    organisationId?: number;
}

export interface InvConfirmEmailParam {
    role: string;
}

export interface PanelParams {
    panelId: string;
}

export interface PanelApplicationParams extends PanelParams {
    applicationId: string;
}

export interface CustomSectionParams {
    applicationId: string;
    sectionId: number;
}

export const initialisePath = <T extends {}>(path: string): Path<T> => new Path<T>(path);

export const urls = {
    edi: {
        profile: initialisePath('/account-settings/edi-profile'),
    },
    application: {
        confirmSubmit: initialisePath<ApplicationParams>('/applications/<string:applicationId>/confirm'),
        list: initialisePath('/applications'),
        view: initialisePath<ApplicationParams>('/applications/<string:applicationId>'),
        preview: initialisePath<ApplicationParams>('/applications/<string:applicationId>?tab=readTab'),
        setup: initialisePath<ApplicationParams>('/applications/<string:applicationId>/setup'),
        projectDetails: initialisePath<ApplicationParams>('/applications/<string:applicationId>/project-details'),
        applicants: {
            view: initialisePath<ApplicationParams>('/applications/<string:applicationId>/applicants'),
            add: initialisePath<ApplicationParams>('/applications/<string:applicationId>/applicants/add'),
            selectRole: initialisePath<ApplicationParams>(
                '/applications/<string:applicationId>/applicants/select-role',
            ),
            searchOrganisation: initialisePath<ApplicationParams>(
                '/applications/<string:applicationId>/applicants/organisation-search',
            ),
            decline: initialisePath<InviteUuidParams>(
                '/applications/<string:applicationId>/applicants/decline/<string:inviteUuid>',
            ),
            selectOrganisation: initialisePath<ApplicationParams>(
                '/applications/<string:applicationId>/applicants/organisation-select',
            ),
            manualAddOrganisation: initialisePath<ApplicationParams>(
                '/applications/<string:applicationId>/applicants/manual-add-organisation',
            ),
        },
        resourcesAndCost: initialisePath<ApplicationParams>('/applications/<string:applicationId>/resources-and-cost'),
        resourcesAndCosts: {
            index: initialisePath<ApplicationParams>('/applications/<string:applicationId>/resources-and-costs'),
            breakdown: initialisePath<ApplicationParams>(
                '/applications/<string:applicationId>/resources-and-costs/detailed-view',
            ),
            organisations: {
                index: initialisePath<OrganisationApplicationParams>(
                    '/applications/<string:applicationId>/resources-and-costs/organisations/<number:organisationId>',
                ),
                staff: {
                    index: initialisePath<OrganisationApplicationParams>(
                        '/applications/<string:applicationId>/resources-and-costs/organisations/<number:organisationId>/staff',
                    ),
                    member: initialisePath<IndividualStaffCostParams>(
                        '/applications/<string:applicationId>/resources-and-costs/organisations/<number:organisationId>/staff/<number:applicantId>',
                    ),
                    unnamedMember: initialisePath<UnnamedStaffCostParams>(
                        '/applications/<string:applicationId>/resources-and-costs/organisations/<number:organisationId>/staff/unnamed/<number:roleId>', //?staffCostId=<number:staffCostId>
                    ),
                    unnamedMemberSelectRole: initialisePath<OrganisationApplicationParams>(
                        '/applications/<string:applicationId>/resources-and-costs/organisations/<number:organisationId>/staff/unnamed/select-role', //?staffCostId=<number:staffCostId>
                    ),
                },
            },
        },
        customSection: initialisePath<CustomSectionParams>(
            '/applications/<string:applicationId>/section/<number:sectionId>/edit',
        ),
        review: initialisePath<ApplicationParams>('/applications/<string:applicationId>/review'),
        reviewResponse: initialisePath<ApplicationParams>('/applications/<string:applicationId>?tab=responseTab'),
        submitReviewResponse: initialisePath<ApplicationParams>(
            '/applications/<string:applicationId>/confirm-review-response',
        ),
    },
    opportunity: {
        list: initialisePath('/opportunities'),
    },
    review: {
        list: initialisePath('/reviews'),
        view: initialisePath('/applications/<string:applicationId>/review'),
        yourReviewTab: initialisePath('/applications/<string:applicationId>/review?tab=yourReviewTab'),
        confirm: initialisePath('/applications/<string:applicationId>/confirm-review'),
    },
    panel: {
        list: initialisePath('/panels'),
        view: initialisePath<PanelParams>('/panels/<string:panelId>'),
        applicationView: initialisePath<PanelApplicationParams>(
            '/panels/<string:panelId>/applications/<string:applicationId>',
        ),
        prescoreConfirmation: initialisePath<PanelApplicationParams>(
            '/panels/<string:panelId>/applications/<string:applicationId>/prescore-confirmation',
        ),
        manageApplications: initialisePath<PanelParams>('/panels/<string:panelId>/manage-applications'),
    },
    organisation: {
        application: {
            listNoParams: initialisePath<OrganisationParams>('/organisations/<number:organisationId>/applications'),
        },
    },
    apply: {
        doYouHaveAnAccount: initialisePath<OppAppParams>(
            '/<string:opportunityId>/apply/<number:applicationComponentId>/options',
        ),
        organisation: {
            select: {
                view: initialisePath<OppAppParams>(
                    '/<string:opportunityId>/apply/<number:applicationComponentId>/select-organisation',
                ),
                withOrgansiationId: initialisePath<OppAppOrgParams>(
                    '/<string:opportunityId>/apply/<number:applicationComponentId>/select-organisation/<number:organisationId>',
                ),
            },
            confirm: initialisePath<OppAppOrgParams>(
                '/<string:opportunityId>/apply/<number:applicationComponentId>/confirm-organisation/<number:organisationId>',
            ),
            confirmExisting: initialisePath<OppAppOrgParams>(
                '/<string:opportunityId>/apply/<number:applicationComponentId>/confirm-existing-organisation',
            ),
        },
        accountDetails: initialisePath<OppAppOrgParams>(
            '/<string:opportunityId>/apply/<number:applicationComponentId>/account-details/<number:organisationId>',
        ),
        confirmEmail: initialisePath<OppAppOrgParams>(
            '/<string:opportunityId>/apply/<number:applicationComponentId>/confirm-email/<number:organisationId>',
        ),
    },
    external: {
        privacyNotice: 'https://www.ukri.org/privacy-notice/',
        termsOfService: 'https://www.ukri.org/about-us/terms-of-use/',
        opportunitiesListing: 'https://www.ukri.org/funding/funding-opportunities/',
    },
    home: initialisePath('/'),
    register: initialisePath<OppAppOrgParams>(
        '/register/<string:opportunityId>/<number:applicationComponentId>/<number:organisationId>',
    ),
    resetPassword: {
        view: initialisePath('/reset-password'),
    },
    resetPasswordExpired: {
        view: initialisePath('/reset-password-expired'),
    },
    accountSettings: {
        view: initialisePath('/account-settings/personal-details'),
    },
    signIn: {
        withOpportunityId: {
            view: initialisePath<OpportunityParams>('/signIn/<string:opportunityId>'),
            withApplicationComponentId: {
                view: initialisePath<OppAppParams>('/signIn/<string:opportunityId>/<number:applicationComponentId>'),
                withOrganisationId: {
                    view: initialisePath<OppAppOrgParams>(
                        '/signIn/<string:opportunityId>/<number:applicationComponentId>/<number:organisationId>',
                    ),
                },
            },
        },
        view: initialisePath('/signIn'),
    },
    champion: {
        home: initialisePath<OrganisationParams>('/organisations/<number:organisationId>'),
    },
    invite: {
        confirmEmail: initialisePath<InvConfirmEmailParam>('/invite/<string:role>/confirm-email'),
    },
};
