import React from 'react';

export const FileUpload: React.FunctionComponent<{ button?: boolean }> = (props: { button?: boolean }) => {
    return (
        <div id="file-upload" className="files">
            <div className="files__item">
                <div className="govuk-form-group u-space-b0">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <label className="govuk-label govuk-visually-hidden" htmlFor="fileUpload">
                                Upload a file
                            </label>
                            <input className="govuk-file-upload" id="fileUpload" name="fileUpload" type="file" />
                        </div>
                        {props.button && (
                            <div className="govuk-grid-column-one-third u-align-right">
                                <input
                                    className="govuk-button--link govuk-!-margin-top-2 govuk-!-margin-bottom-2"
                                    type="submit"
                                    name="upload"
                                    value="Upload"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
