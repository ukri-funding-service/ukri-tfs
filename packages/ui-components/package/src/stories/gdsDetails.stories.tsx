import React from 'react';
import { storiesOf } from '@storybook/react';
import { GdsDetails } from '../components/details';

const stories = storiesOf('Components', module);

stories.add('GdsDetails', () => {
    return (
        <div className={'js-enabled'}>
            <GdsDetails
                title="Show notification"
                altTitle="Hide notification"
                expandedByDefault={true}
                details={
                    <div>
                        Text to hide <a href="http://127.0.0.1">with a link</a>
                    </div>
                }
            ></GdsDetails>
        </div>
    );
});
