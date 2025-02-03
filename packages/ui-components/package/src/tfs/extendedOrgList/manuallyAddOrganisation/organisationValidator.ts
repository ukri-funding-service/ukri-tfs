import { ValidationResults, Rules } from '@ukri-tfs/validation';

export interface OrganisationDetails {
    name: string;
    city: string;
    country: string;
    webAddress?: string;
}

const defaultMaxCharLimit = 255;
export class OrganisationValidator extends ValidationResults<OrganisationDetails> {
    name = Rules.all(
        this,
        () =>
            Rules.required(
                this,
                this.model.name,
                'Enter the organisation’s name',
                'Enter the organisation’s name',
                'name',
            ),
        () =>
            Rules.maxLength(
                this,
                this.model.name,
                defaultMaxCharLimit,
                `Organisation name must be ${defaultMaxCharLimit} characters or fewer`,
                `Organisation name must be ${defaultMaxCharLimit} characters or fewer`,
                'name',
            ),
    );
    city = Rules.all(
        this,
        () =>
            Rules.required(
                this,
                this.model.city,
                'Enter the organisation’s town or city',
                'Enter the organisation’s town or city',
                'city',
            ),
        () =>
            Rules.maxLength(
                this,
                this.model.city,
                defaultMaxCharLimit,
                `Town or city must be ${defaultMaxCharLimit} characters or fewer`,
                `Town or city must be ${defaultMaxCharLimit} characters or fewer`,
                'city',
            ),
    );
    country = Rules.all(
        this,
        () =>
            Rules.required(
                this,
                this.model.country,
                'Enter the organisation’s country',
                'Enter the organisation’s country',
                'country',
            ),
        () =>
            Rules.maxLength(
                this,
                this.model.country,
                defaultMaxCharLimit,
                `Country must be ${defaultMaxCharLimit} characters or fewer`,
                `Country must be ${defaultMaxCharLimit} characters or fewer`,
                'country',
            ),
    );
    webAddress = Rules.all(this, () =>
        Rules.maxLength(
            this,
            this.model.webAddress ?? '',
            255,
            `Website address must be ${defaultMaxCharLimit} characters or fewer`,
            `Website address must be ${defaultMaxCharLimit} characters or fewer`,
            'webAddress',
        ),
    );
}
