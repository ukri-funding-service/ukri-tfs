import React from 'react';

interface TfsApplicationSectionHeadingProps {
    id: string;
    sectionNumber: number;
    sectionHeading: string;
    showEditLink?: boolean;
    editLinkUrl?: string;
}

export const TfsApplicationSectionHeading: React.FunctionComponent<TfsApplicationSectionHeadingProps> = ({
    id,
    sectionNumber,
    sectionHeading,
    showEditLink,
    editLinkUrl,
}: TfsApplicationSectionHeadingProps): JSX.Element => {
    return (
        <h3 className="govuk-heading-m serif govuk-heading--link" id={id}>
            {sectionNumber}. {sectionHeading}
            {showEditLink && (
                <span className="govuk-heading_additional-link">
                    <a href={editLinkUrl || '#'} className="govuk-link">
                        Edit <span className="govuk-visually-hidden">{sectionHeading}</span>
                    </a>
                </span>
            )}
        </h3>
    );
};
