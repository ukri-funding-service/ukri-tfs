import React from 'react';
import { render } from '@testing-library/react';
import { SupportingFiles, SupportingFilesTableRow } from '../../src';
import { expect } from 'chai';

describe('supportingFiles', () => {
    const supportingFile: SupportingFilesTableRow = {
        file: {
            size: 23,
            fileName: 'some-supporting-file-name',
            id: 'some-id',
            fileType: 'some-filetype',
            status: 'some-status',
        },
        description: 'some-supporting-file-description',
    };

    it('should render supporting files', () => {
        const result = render(
            <SupportingFiles
                csrfToken="fake"
                allowDownload={true}
                supportingFiles={[supportingFile]}
                showActions={false}
            />,
        );

        expect(result.getByRole('button', { name: 'some-supporting-file-name (23MB)' })).not.to.be.undefined;

        const firstDescription = result.container.querySelector('#notes-for-ukri0');
        expect(firstDescription!.textContent).to.be.equal('some-supporting-file-description');
    });

    it('should not render supporting files download link if allowDownload false', () => {
        const result = render(
            <SupportingFiles
                csrfToken="fake"
                supportingFiles={[supportingFile]}
                allowDownload={false}
                showActions={false}
            />,
        );

        expect(result.queryByRole('button', { name: 'some-supporting-file-name (23MB)' })).to.be.null;

        const firstDescription = result.container.querySelector('#file-name0');
        expect(firstDescription!.textContent).to.be.equal('some-supporting-file-name (23MB)');
    });

    it('should have not be downloadable if file is quarantined', () => {
        const quarantinedFile = {
            ...supportingFile,
            file: {
                ...supportingFile.file,
                status: 'QUARANTINED',
            },
        };
        const result = render(
            <SupportingFiles
                csrfToken="fake"
                supportingFiles={[quarantinedFile]}
                allowDownload={true}
                showActions={false}
            />,
        );

        expect(result.queryByRole('button', { name: 'some-supporting-file-name (23MB)' })).to.be.null;

        const firstDescription = result.container.querySelector('#file-name0');
        expect(firstDescription!.textContent).to.be.equal('some-supporting-file-name (23MB)');
    });

    it('should show actions', () => {
        const result = render(
            <SupportingFiles
                csrfToken="fake"
                allowDownload={true}
                supportingFiles={[supportingFile]}
                showActions={true}
            />,
        );

        expect(result.queryByText('Actions')).not.to.be.null;
    });
    it('should show remove file action link', () => {
        const result = render(
            <SupportingFiles
                csrfToken="fake"
                allowDownload={true}
                supportingFiles={[supportingFile]}
                showActions={true}
            />,
        );

        expect(result.getByRole('button', { name: 'Remove' })).not.to.be.undefined;
    });
    it('should not show actions', () => {
        const result = render(
            <SupportingFiles
                csrfToken="fake"
                allowDownload={true}
                supportingFiles={[supportingFile]}
                showActions={false}
            />,
        );

        expect(result.queryByText('Actions')).to.be.null;
    });
});
