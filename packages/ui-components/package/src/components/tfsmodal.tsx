import React from 'react';
export interface TfsModalProps {
    children: React.ReactNode;
    id?: string;
    onClose?: () => void;
    isVisible: boolean;
    title: string;
}
export const TfsModal: React.FunctionComponent<TfsModalProps> = (props: TfsModalProps): JSX.Element => {
    const titleId = props.id === undefined ? 'tfs-modal-id' : props.id + 'tfs-modal-id';
    return props.isVisible ? (
        <div id={props.id} className="tfsModal" role="dialog" aria-label={titleId} aria-hidden="true">
            <div className="tfsModal--inner">
                <h2 className="govuk-heading-l" id={titleId}>
                    {props.title}
                </h2>
                {props.children}
            </div>
        </div>
    ) : (
        <></>
    );
};
