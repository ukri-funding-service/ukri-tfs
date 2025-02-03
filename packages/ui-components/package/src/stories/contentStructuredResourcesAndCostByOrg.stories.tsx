import { storiesOf } from '@storybook/react';
import React from 'react';
import { TfsApplicationStructuredCostsByOrgSection } from '../tfs/applicationView/elements/contentStructuredResourcesAndCostByOrg';
import { structuredCosts } from './data/structuredCosts';

const stories = storiesOf('TFS Components', module);
stories.add('Structured Costs By Organisation Read only view', () => {
    return <TfsApplicationStructuredCostsByOrgSection id={''} structuredCosts={structuredCosts} />;
});
