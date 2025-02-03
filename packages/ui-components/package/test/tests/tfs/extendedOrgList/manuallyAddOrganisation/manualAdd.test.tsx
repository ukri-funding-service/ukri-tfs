import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ManualAddOrganisationForm, ManualAddOrganisationProps } from '../../../../../src/tfs/extendedOrgList';

describe('manual add organisation form tests', () => {
    it('Should display the organisation fields', () => {
        const props: ManualAddOrganisationProps = {
            errorList: [],
            csrfToken: 'abc',
            disabled: false,
        };

        const expectedFieldLabels: string[] = [
            'Organisation name',
            'Town or city',
            'Country',
            'Website address (optional)',
        ];

        const wrapper = render(<ManualAddOrganisationForm {...props} />);
        const fields = wrapper.container.querySelectorAll('.govuk-form-group .govuk-label');

        expect(fields.length).to.eql(expectedFieldLabels.length);

        fields.forEach((field, i) => {
            expect(field.outerHTML).to.contains(expectedFieldLabels[i]);
        });
        wrapper.unmount();
    });
});
