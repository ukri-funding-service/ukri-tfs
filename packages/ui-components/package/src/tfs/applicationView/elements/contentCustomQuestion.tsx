import React from 'react';
import { FileDisplay, FileMetadata } from '../../../components';
import { TfsApplicationContentBody } from './contentBody';

interface QuestionDetailsProps {
    questionSubTitleLabel: string;
    questionGuidanceNotesContent: string;
    print: boolean;
}

export const QuestionDetails = (props: QuestionDetailsProps): JSX.Element => {
    const open = props.print ? { open: true } : {};

    return (
        <details
            className={`govuk-details govuk-details--boxed ${props.print ? 'print-show' : 'print-hide'}`}
            {...open}
        >
            <summary className="govuk-details__summary print-hide" role="button" data-module="govuk-details">
                View application question
            </summary>
            <div className="govuk-details__text" aria-hidden="true">
                <h4 className="govuk-heading-s print-show">Application question</h4>
                <div className="govuk-body">
                    <strong>{props.questionSubTitleLabel}</strong>
                </div>
                <div
                    className="govuk-details__text"
                    style={{ padding: 0 }}
                    dangerouslySetInnerHTML={{ __html: props.questionGuidanceNotesContent }}
                />
            </div>
        </details>
    );
};

interface TfsApplicationContentCustomQuestionSectionProps {
    id: string;
    questionSubTitleLabel: string;
    questionGuidanceNotesContent: string;
    answer?: string;
    fileMetadata: FileMetadata[];
    csrfToken?: string;
}

export const TfsApplicationContentCustomQuestionSection: React.FunctionComponent<TfsApplicationContentCustomQuestionSectionProps> =
    (props): JSX.Element => (
        <div id={props.id}>
            <QuestionDetails {...props} print={false} />
            <QuestionDetails {...props} print={true} />
            <div className="serif custom-question-scrollable">
                <TfsApplicationContentBody text={props.answer} id={`${props.id}Answer`} />
            </div>
            <FileDisplay pageProps={props} hasRemoveLink={false} items={props.fileMetadata} />
        </div>
    );
