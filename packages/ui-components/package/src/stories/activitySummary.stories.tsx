import React from 'react';
import { storiesOf } from '@storybook/react';
import { ActivitySummary, ActivitySummaryCount } from '../components';

const stories = storiesOf('Components - ActivitySummary', module);
const subCounts = [{ count: 1, text: 'overdue invites' }];

stories.add('ActivitySummaryCount', () => (
    <>
        <ActivitySummaryCount count={0} text={'reviews in progress'} />
        <ActivitySummaryCount count={2} text={'reviews complete'} />
        <ActivitySummaryCount count={0} text={'invites pending'} subCounts={subCounts} />
    </>
));
stories.add('ActivitySummary', () => (
    <>
        <ActivitySummary
            id="an-id"
            columns={[
                {
                    title: 'A column title',
                    rows: [
                        {
                            count: 5,
                            text: 'A row count',
                        },
                        {
                            count: 2,
                            text: 'A row count with a link',
                            href: '#',
                        },
                        {
                            count: 7,
                            text: 'A row count',
                        },
                    ],
                },
                {
                    title: 'A second column title',
                    rows: [
                        {
                            count: 5,
                            text: 'A row count',
                        },
                        {
                            count: 2,
                            text: 'A row count',
                        },
                        {
                            count: 7,
                            text: 'A row count',
                            subCounts: [
                                {
                                    count: 5,
                                    text: 'A sub count',
                                },
                                {
                                    count: 2,
                                    text: 'A sub count',
                                },
                            ],
                        },
                        {
                            count: 7,
                            text: 'A row count',
                        },
                    ],
                },
            ]}
        />
    </>
));

stories.add('Reviews and Invites ActivitySummary', () => (
    <div style={{ maxWidth: '1500px' }}>
        <ActivitySummary
            id="an-id"
            columns={[
                {
                    title: 'No response',
                    rows: [
                        {
                            count: 1,
                            text: 'invite sent',
                        },
                        {
                            count: 1,
                            text: 'invite re-sent',
                        },
                    ],
                },
                {
                    title: 'Pending reviews',
                    rows: [
                        {
                            count: 0,
                            text: 'invites accepted',
                        },
                        {
                            count: 2,
                            text: 'incomplete reviews',
                            subCounts: [
                                {
                                    count: 1,
                                    text: 'reviews overdue',
                                },
                            ],
                        },
                    ],
                },
                {
                    title: 'Submitted reviews',
                    rows: [
                        {
                            count: 1,
                            text: 'usable review',
                        },
                        {
                            count: 1,
                            text: 'review to check',
                        },
                        {
                            count: 1,
                            text: 'unusable review',
                        },
                    ],
                },
                {
                    rows: [
                        {
                            count: 1,
                            text: 'cancelled review',
                        },
                        {
                            count: 1,
                            text: 'cancelled invite',
                        },
                        {
                            count: 1,
                            text: 'declined invite',
                        },
                        {
                            count: 1,
                            text: 'reviewer on blocklist',
                            href: '#',
                        },
                        {
                            count: 3,
                            text: 'reviewers in reserve',
                            href: '#',
                        },
                    ],
                },
            ]}
        />
    </div>
));
