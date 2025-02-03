import React from 'react';
import { storiesOf } from '@storybook/react';

import { GdsTabGroup, GdsTab } from '../components/index';

const stories = storiesOf('Demo', module);

stories.add('TabGroup', () => {
    // this component relies on a class named 'js-enabled' being set,
    // if relevant, on the body or other parent element
    return (
        <div className="js-enabled">
            <GdsTabGroup id="testTabs" heading="Tab Group Test">
                <GdsTab id="tab1" label="Tab 1" selected>
                    <p>Some tab content</p>
                </GdsTab>
                <GdsTab id="tab2" label="Tab 2">
                    <p>Some tab content</p>
                </GdsTab>
            </GdsTabGroup>
        </div>
    );
});

stories.add('TabGroup - no content', () => {
    // this component relies on a class named 'js-enabled' being set,
    // if relevant, on the body or other parent element
    return (
        <div className="js-enabled">
            <GdsTabGroup id="testTabs" heading="Tab Group Test">
                <GdsTab id="tab1" label="Tab 1" selected />
                <GdsTab id="tab2" label="Tab 2" />
            </GdsTabGroup>
        </div>
    );
});
