import React from 'react';
import { storiesOf } from '@storybook/react';
import { PagesProps, SummaryProps, TfsPager, TfsPagerProps } from '../components/pager/pager';

const stories = storiesOf('Components', module);
const pagesProps: PagesProps = {
    currentPage: 7,
    totalPages: 42,
    pagesToShow: 7,
    getLink: (val: number) => `link?page=${val}`,
};
const props: TfsPagerProps = {
    id: 'foo',
    paginationPages: pagesProps,
};

stories.add('Pager with summary', () => {
    const summaryProps: SummaryProps = {
        startResult: 1,
        endResult: 100,
        totalResults: 1000,
        resultsName: 'results',
    };

    return <TfsPager {...{ ...props, paginationSummary: summaryProps }} />;
});

stories.add('Pager without summary', () => {
    return <TfsPager {...props} />;
});
