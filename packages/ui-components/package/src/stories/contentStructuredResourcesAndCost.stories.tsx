import { storiesOf } from '@storybook/react';
import React from 'react';
import { TfsApplicationStructuredCostsSection } from '../tfs/applicationView/elements/contentStructuredResourcesAndCost';
import { structuredCosts } from './data/structuredCosts';

const stories = storiesOf('TFS Components', module);
stories.add('Structured Costs Read only view', () => {
    return <TfsApplicationStructuredCostsSection id={''} structuredCosts={structuredCosts} />;
});
