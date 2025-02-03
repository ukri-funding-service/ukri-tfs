import React from 'react';
import { storiesOf } from '@storybook/react';
import { GdsLinkButton, RadiosWithConditional } from '../components';
import { ContactUs } from '../components/index';

import { TfsPageHeading } from '../tfs';
import { Button, BackLink } from 'govuk-react-jsx';

const stories = storiesOf('Demo', module);

stories.add('Roles Radio Selection', () => {
    return (
        <>
            <div className="container">
                <BackLink href="#">Back to applicants</BackLink>
            </div>

            <div className="container">
                <TfsPageHeading text="Assign role" resourceId="Add an applicant" />
                <RadiosWithConditional
                    legend=""
                    radioGroupName="cheese_types"
                    legendSize="m"
                    radioData={[
                        {
                            name: '',
                            text: 'Principal investigator',
                            value: 'principal-investigator',
                            id: 'principal-investigator',
                            checked: false,
                        },
                        {
                            name: '',
                            text: 'Co-investigator',
                            value: 'co-investigator',
                            id: 'co-investigator',
                            checked: false,
                        },
                        {
                            name: '',
                            text: 'Project partner/collaborator',
                            value: 'partner',
                            id: 'partner',
                            checked: false,
                        },
                        {
                            name: '',
                            text: 'Subcontractor/collaborator',
                            value: 'subcontractor',
                            id: 'subcontractor',
                            checked: false,
                        },
                        {
                            name: '',
                            text: 'Other',
                            value: 'other',
                            id: 'other',
                            checked: false,
                        },
                    ]}
                    radioSize="normal"
                />
                <Button>Continue</Button>
            </div>
            <div className="container">
                <GdsLinkButton href="#" text="Return to applicants" ariaLabel=""></GdsLinkButton>
            </div>
            <div className="container">
                <ContactUs
                    jsEnabled={true}
                    phoneNumberLink="+441793547490"
                    phoneNumberDisplayText="+44 (0)1793 547 490"
                />
            </div>
        </>
    );
});
