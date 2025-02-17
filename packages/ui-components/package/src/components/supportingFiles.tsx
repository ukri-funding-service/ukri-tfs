import React, { ReactElement } from 'react';
import { Column, TypedTable } from './table';
import { Form } from './form';
import { Paragraph } from './paragraph';

export interface SupportingFileMetadata {
    id: string;
    size: number;
    status: string;
    fileType: string;
    fileName: string;
}

export interface SupportingFilesTableRow {
    description: string;
    file: SupportingFileMetadata;
    rowError?: string;
}

export interface SupportingFilesProps {
    supportingFiles: SupportingFilesTableRow[];
    allowDownload: boolean;
    showActions: boolean;
    csrfToken?: string;
}

const SupportingFilesTable = TypedTable<SupportingFilesTableRow>();

export const SupportingFiles = (props: SupportingFilesProps): ReactElement => {
    const fileText = (file: SupportingFileMetadata): string => `${file.fileName} (${file.size}MB)`;

    const FileDownload = (file: SupportingFileMetadata) => (
        <Form csrfToken={props.csrfToken} name="downloadFile" method="POST" key={`file-download-${file.id}`}>
            <input type="hidden" name="fileId" value={file.id} />
            <input type="hidden" name="fileName" value={file.fileName} />
            <input type="hidden" name="fileType" value={file.fileType} />
            <input type="hidden" name="formType" value="downloadFile" />
            <input className="govuk-button--link" type="submit" value={fileText(file)} />
        </Form>
    );

    const FileRemove = (file: SupportingFileMetadata) => (
        <Form csrfToken={props.csrfToken} name="removeFile" method="POST" key={`file-download-${file.id}`}>
            <input type="hidden" name="fileId" value={file.id} />
            <input type="hidden" name="formType" value="removeFile" />
            <input className="govuk-button--link" type="submit" value={'Remove'} />
        </Form>
    );

    return (
        <>
            <SupportingFilesTable data={props.supportingFiles}>
                <Column
                    idPrefix="file-name"
                    header="File"
                    value={(row: SupportingFilesTableRow) =>
                        props.allowDownload && row.file.status !== 'QUARANTINED' ? (
                            <FileDownload {...row.file} />
                        ) : (
                            <Paragraph className="govuk-!-display-inline govuk-!-font-size-16">
                                {fileText(row.file)}
                            </Paragraph>
                        )
                    }
                    ariaLabel="File"
                    width={30}
                />
                <Column
                    idPrefix="notes-for-ukri"
                    header="Notes for UKRI"
                    value={(row: SupportingFilesTableRow) => row.description}
                    ariaLabel="File"
                    width={60}
                />
                {props.showActions ? (
                    <Column header="Actions" value={(row: SupportingFilesTableRow) => <FileRemove {...row.file} />} />
                ) : (
                    <></>
                )}
            </SupportingFilesTable>
        </>
    );
};
