import React from 'react';
import { Form, FormProps } from './form';

export interface FileMetadata {
    id: string;
    fileName: string;
    fileType: string;
    status: string;
    size: number;
    answerId?: number;
}

export interface DisplayFilesProps {
    items: FileMetadata[];
    hasRemoveLink: boolean;
    pageProps: FormProps;
    entityVersion?: string;
}

export const FileDisplay: React.FunctionComponent<DisplayFilesProps> = ({
    items,
    hasRemoveLink,
    pageProps,
    entityVersion,
}) => {
    return (
        <React.Fragment>
            {items.map((i, index) => {
                const tagClassName = getStatusTagClassName(i.status);
                const statusDisplayName = getStatusDisplayName(i.status);
                const canDownload = canDownloadFile(i.status);
                const displayStatusTag = showStatusTag(i.status);
                return (
                    <div className="files" key={index}>
                        <div className="files__item">
                            <div className="files__name">
                                {canDownload ? (
                                    <Form
                                        {...pageProps}
                                        name="downloadFile"
                                        method="POST"
                                        key={`file-download-${i.id}`}
                                    >
                                        <input type="hidden" name="fileId" value={i.id} />
                                        <input type="hidden" name="fileName" value={i.fileName} />
                                        <input type="hidden" name="fileType" value={i.fileType} />
                                        <input type="hidden" name="formType" value="downloadFile" />
                                        <input className="govuk-button--link" type="submit" value={i.fileName} />
                                        {displayStatusTag ? (
                                            <strong className={`u-margin-left-10 govuk-tag ${tagClassName}`}>
                                                {statusDisplayName}
                                            </strong>
                                        ) : (
                                            <React.Fragment />
                                        )}
                                    </Form>
                                ) : (
                                    <>
                                        {i.fileName}
                                        <strong className={`u-margin-left-10 govuk-tag ${tagClassName}`}>
                                            {statusDisplayName}
                                        </strong>
                                    </>
                                )}
                            </div>
                            <div className="files__meta">
                                <span className="files__size">{i.size}MB</span>
                                <span className="files__action">
                                    {hasRemoveLink ? (
                                        <Form
                                            {...pageProps}
                                            className="files__action"
                                            name="removeFile"
                                            method="POST"
                                            key={`file-remove-${i.id}`}
                                        >
                                            {entityVersion && (
                                                <input type="hidden" name="entityVersion" value={entityVersion} />
                                            )}
                                            <input type="hidden" name="fileId" value={i.id} />
                                            <input type="hidden" name="formType" value="removeFile" />
                                            <input
                                                className="files__action govuk-button--link"
                                                type="submit"
                                                value="Remove"
                                            />
                                        </Form>
                                    ) : (
                                        <React.Fragment />
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
    );
};
function getStatusTagClassName(status: string) {
    switch (status.toUpperCase()) {
        case 'QUARANTINED': {
            return 'govuk-tag--red';
        }
        default:
            return 'govuk-tag--yellow';
    }
}

function getStatusDisplayName(status: string) {
    switch (status.toUpperCase()) {
        case 'QUARANTINED': {
            return 'REJECTED';
        }
        default:
            return 'PENDING';
    }
}

function canDownloadFile(status: string) {
    return status.toUpperCase() === 'CLEAN' ? true : false;
}

function showStatusTag(status: string) {
    return status.toUpperCase() === 'CLEAN' ? false : true;
}
