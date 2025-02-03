import cx from 'classnames';
import { InsetText } from 'govuk-react-jsx';
import React from 'react';
import { DictionaryListItems } from '../../components';
import {
    TfsApplicationContentApplicantsSection,
    TfsApplicationContentCustomQuestionSection,
    TfsApplicationContentDetailsSection,
    TfsApplicationContentInfo,
    TfsApplicationContentProjectPartnerSection,
    TfsApplicationContentResourcesAndCostsSection,
    TfsApplicationSectionHeading,
    TfsApplicationViewToC,
    TfsApplicationViewToCProps,
} from './elements';
import { TfsApplicationStructuredCostsSection } from './elements/contentStructuredResourcesAndCost';
import {
    TfsApplicationSection,
    TfsApplicationSectionType,
    TfsApplicationViewContent,
} from './types/applicationViewContent';

export interface TfsApplicationViewProps {
    id: string;
    className?: string;
    alert?: string;
    showTableOfContents?: boolean;
    applicationContent: TfsApplicationViewContent;
    applicationInfo?: DictionaryListItems;
    statusText?: string;
    csrfToken?: string;
    hideApplicantEmails?: boolean;
}

const getSectionId = (section: TfsApplicationSection, contentId: string): string => {
    const sectionId = `${contentId}-${section.type.toLowerCase()}`;

    switch (section.type) {
        case TfsApplicationSectionType.Details:
        case TfsApplicationSectionType.Applicants:
        case TfsApplicationSectionType.Costs:
        case TfsApplicationSectionType.StructuredCosts:
            return sectionId;
        case TfsApplicationSectionType.Custom:
            return `${sectionId}-${section.questionsetId}`;
        case TfsApplicationSectionType.ProjectPartners:
            return `${sectionId}-partners`;
        default:
            throw new Error('Section type not recognised');
    }
};

function renderSections(
    sections: TfsApplicationSection[],
    contentId: string,
    showEditLinks: boolean,
    hideApplicantEmails: boolean,
    csrfToken?: string,
): JSX.Element[] {
    return sections.map((section, idx) => {
        let sectionContent: JSX.Element;
        const sectionId = getSectionId(section, contentId);

        switch (section.type) {
            case TfsApplicationSectionType.Details:
                sectionContent = (
                    <TfsApplicationContentDetailsSection
                        id={sectionId}
                        summaryTitle={section.summaryTitle}
                        applicationSummary={section.summary}
                        displayStartDateAndDuration={section.displayStartDateAndDuration}
                        projectStartDate={section.projectStartDate}
                        projectDuration={section.projectDuration}
                    />
                );
                break;
            case TfsApplicationSectionType.Applicants:
                sectionContent = (
                    <TfsApplicationContentApplicantsSection
                        id={sectionId}
                        className="serif"
                        applicants={section.applicants}
                        hideEmail={hideApplicantEmails}
                    />
                );
                break;
            case TfsApplicationSectionType.Custom:
                sectionContent = (
                    <TfsApplicationContentCustomQuestionSection
                        id={sectionId}
                        questionSubTitleLabel={section.questionSubTitleLabel}
                        questionGuidanceNotesContent={section.questionGuidanceNotesContent}
                        answer={section.answer}
                        fileMetadata={section.fileMetadata}
                        csrfToken={csrfToken}
                    />
                );
                break;
            case TfsApplicationSectionType.Costs:
                sectionContent = (
                    <TfsApplicationContentResourcesAndCostsSection id={sectionId} costPolicy={section.costPolicy} />
                );
                break;
            case TfsApplicationSectionType.StructuredCosts:
                sectionContent = (
                    <TfsApplicationStructuredCostsSection id={sectionId} structuredCosts={section.structuredCosts} />
                );
                break;
            case TfsApplicationSectionType.ProjectPartners:
                sectionContent = (
                    <TfsApplicationContentProjectPartnerSection id={sectionId} partners={section.partners} />
                );
                break;
            default:
                // we don't know how to render this section
                return <React.Fragment />;
        }

        return (
            <React.Fragment key={idx}>
                <TfsApplicationSectionHeading
                    id={`${sectionId}-heading`}
                    sectionNumber={idx + 1}
                    sectionHeading={section.title}
                    showEditLink={showEditLinks}
                    editLinkUrl={section.formUrl}
                />
                {sectionContent}
                <hr className={cx('govuk-section-break', 'govuk-section-break--l', 'govuk-section-break--visible')} />
            </React.Fragment>
        );
    });
}

export const TfsApplicationView: React.FC<TfsApplicationViewProps> = ({
    alert,
    applicationContent,
    showTableOfContents,
    applicationInfo,
    statusText,
    csrfToken,
    hideApplicantEmails = false,
    ...props
}) => {
    const attributes = {
        id: props.id,
        className: cx(props.className, 'container', 'u-space-b30'),
    };

    const contentId = `${props.id}-content`;

    const tableOfContentProps: TfsApplicationViewToCProps = {
        id: `${props.id}-toc`,
        applicationContent,
        className: cx('column', 'is-3'),
        getSectionLinkId: (section: TfsApplicationSection) => `${getSectionId(section, contentId)}-heading`,
    };

    return (
        <div {...attributes}>
            <div className="columns">
                {showTableOfContents && <TfsApplicationViewToC {...tableOfContentProps} />}
                <div
                    id={contentId}
                    className={cx('readonly-view', 'column', {
                        'is-9': showTableOfContents,
                        'is-12': !showTableOfContents,
                    })}
                    style={{ wordBreak: 'break-word' }}
                >
                    {applicationInfo && statusText && (
                        <TfsApplicationContentInfo main={applicationInfo} statusText={statusText} />
                    )}
                    {alert && (
                        <InsetText id="application-view-content-alert" titleId={`${contentId}-alert`}>
                            {alert}
                        </InsetText>
                    )}
                    <h2 id={`${contentId}-heading`} className={cx('govuk-heading-l', 'serif', 'govuk-heading--link')}>
                        {applicationContent.name}
                    </h2>
                    {renderSections(
                        applicationContent.sections,
                        contentId,
                        applicationContent.showEditLinks,
                        hideApplicantEmails,
                        csrfToken,
                    )}
                </div>
            </div>
        </div>
    );
};
