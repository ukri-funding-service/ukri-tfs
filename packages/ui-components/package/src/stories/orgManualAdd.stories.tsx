import React from 'react';
import { storiesOf } from '@storybook/react';
import { TfsPageHeading } from '../tfs';
import { GdsLinkButton, Input } from '../components';
import { Button, WarningText } from 'govuk-react-jsx';

const stories = storiesOf('Demo', module);

stories.add('Organisation - Manual Add', () => (
    <>
        <div className="container">
            <TfsPageHeading text="Enter new person's organisation name" resourceId="Add an applicant" />
            <Input name="orgName" label="Organisation name" />
            <Input name="orgCity" label="Town or city" />
            <Input name="orgCountry" label="Country" />
            <Input name="orgWebAddress" label="Website address (optional)" />

            <WarningText iconFallbackText="Warning">
                Check all of these details are correct. If we cannot identify the organisation, it may cause delays to
                your application.
            </WarningText>
        </div>
        <div className="container">
            <Button>Continue</Button>
        </div>
        <div className="container">
            <GdsLinkButton href="#" text="Return to search" ariaLabel=""></GdsLinkButton>
        </div>
    </>
));
