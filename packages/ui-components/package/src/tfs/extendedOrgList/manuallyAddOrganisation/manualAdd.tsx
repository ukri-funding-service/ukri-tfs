import React from 'react';
import { Button, WarningText } from 'govuk-react-jsx';
import { CsrfProps, getErrorMessage } from '@ukri-tfs/frontend-utils';
import { errorFormat } from '@ukri-tfs/validation';
import { Form, Input } from '../../../components';

export interface ManualAddOrganisationProps extends CsrfProps {
    errorList: Array<errorFormat>;
    warningString?: string;
    disabled?: boolean;
}

export const ManualAddOrganisationForm = (props: ManualAddOrganisationProps): JSX.Element => {
    return (
        <Form {...props}>
            <div className="container">
                <Input
                    name="name"
                    label="Organisation name"
                    errorMessages={getErrorMessage(props.errorList, 'name')}
                    widthSize="20"
                />
                <Input
                    name="city"
                    label="Town or city"
                    errorMessages={getErrorMessage(props.errorList, 'city')}
                    widthSize="20"
                />
                <Input
                    name="country"
                    label="Country"
                    errorMessages={getErrorMessage(props.errorList, 'country')}
                    widthSize="30"
                />
                <Input
                    name="webAddress"
                    label="Website address (optional)"
                    errorMessages={getErrorMessage(props.errorList, 'webAddress')}
                    widthSize="20"
                />

                {props.warningString && <WarningText iconFallbackText="Warning">{props.warningString}</WarningText>}
            </div>
            <div className="container">
                <Button id="continue-button" disabled={props.disabled}>
                    Continue
                </Button>
            </div>
        </Form>
    );
};
