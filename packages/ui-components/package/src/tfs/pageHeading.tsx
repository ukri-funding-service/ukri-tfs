import React from 'react';
import { HeadingText } from '../components';

export interface TfsPageHeadingProps {
    text: string;
    resourceId: string;
    resourceName?: string;
    className?: string;
}

export const TfsPageHeading: React.FC<TfsPageHeadingProps> = ({ text, resourceId, resourceName, className }) => {
    const caption = [resourceId, resourceName].filter(item => item && item.length).join(': ');
    return <HeadingText text={text} caption={caption} size="xl" tag="h1" className={className} />;
};
