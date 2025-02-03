import React from 'react';
import { HeadingText } from './heading';

export interface PageHeadingTextProps {
    globalTitle: string;
    pageTitle: string;
    caption?: string;
    className?: string;
    elementName?: string;
}

export const PageHeadingText: React.FunctionComponent<PageHeadingTextProps> = props => {
    return <HeadingText {...props} text={props.pageTitle} size="xl" tag="h1" />;
};
