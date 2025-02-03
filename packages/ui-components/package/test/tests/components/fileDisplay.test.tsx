import 'mocha';
import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { FileDisplay } from '../../../src/components/fileDisplay';

describe('<FileDisplay /> component tests', () => {
    it('it should not display a file status tag when the file status is clean', () => {
        const items = [
            {
                id: '1',
                fileName: 'name',
                fileType: 'application/pdf',
                status: 'clean',
                size: 1.0,
            },
        ];

        const component = render(
            <FileDisplay pageProps={{ csrfToken: 'csrfToken' }} hasRemoveLink={false} items={items} />,
        );
        expect(component.container.querySelector('strong')).to.equal(null);
        expect(component.container.querySelectorAll('.files').length).eq(1);
    });

    it('should display the file with red tag when file is quarantined', () => {
        const items = [
            {
                id: '1',
                fileName: 'name',
                status: 'QUARANTINED',
                fileType: 'application/pdf',
                size: 1.0,
            },
        ];

        const component = render(<FileDisplay pageProps={{}} hasRemoveLink={false} items={items} />);
        expect(component.container.querySelector('strong')!.classList.contains('govuk-tag--red')).to.be.true;
        expect(component.container.querySelectorAll('.files').length).eq(1);
    });

    it('should display the file with yellow tag while the file is pending', () => {
        const items = [
            {
                id: '1',
                fileName: 'name',
                fileType: 'application/pdf',
                status: 'pending',
                size: 1.0,
            },
        ];

        const component = render(<FileDisplay pageProps={{}} hasRemoveLink={false} items={items} />);
        expect(component.container.querySelector('strong')!.classList.contains('govuk-tag--yellow')).to.be.true;
        expect(component.container.querySelectorAll('.files').length).eq(1);
    });

    it('should display the file with yellow tag by default', () => {
        const items = [
            {
                id: '1',
                fileName: 'name',
                fileType: 'application/pdf',
                status: 'anything',
                size: 1.0,
            },
        ];

        const component = render(<FileDisplay pageProps={{}} hasRemoveLink={false} items={items} />);
        expect(component.container.querySelector('strong')!.classList.contains('govuk-tag--yellow')).to.be.true;
        expect(component.container.querySelectorAll('.files').length).eq(1);
    });

    it('should render download form', () => {
        const items = [
            {
                id: '1',
                fileName: 'mypdffile',
                fileType: 'application/pdf',
                status: 'clean',
                size: 1.0,
            },
        ];

        const component = render(<FileDisplay pageProps={{ csrfToken: 'hee' }} hasRemoveLink={false} items={items} />);
        expect(component.container.querySelectorAll('.files__name').length).eq(1);
        expect(component.container.querySelector('.govuk-button--link')!.outerHTML).contains('value="mypdffile"');
    });

    it('should not render download form if status is not clean', () => {
        const items = [
            {
                id: '1',
                fileName: 'mypdffile',
                fileType: 'application/pdf',
                status: 'staged',
                size: 1.0,
            },
        ];

        const component = render(<FileDisplay pageProps={{ csrfToken: 'hee' }} hasRemoveLink={false} items={items} />);
        expect(component.container.querySelectorAll('.files__name').length).eq(1);
        expect(component.container.querySelectorAll('.govuk-button--link').length).to.eq(0);
    });

    describe('should render the remove form', () => {
        const defaultProps = {
            pageProps: { csrfToken: '123' },
            hasRemoveLink: true,
            items: [
                {
                    id: '1',
                    fileName: 'name',
                    fileType: 'application/pdf',
                    status: 'clean',
                    size: 1.0,
                },
            ],
        };

        it('with a hidden entityVersion field when entityVersion is provided', () => {
            const props = { ...defaultProps, entityVersion: 'my-version' };
            const component = render(<FileDisplay {...props} />);

            const entityVersion = component.container.querySelector('input[name="entityVersion"]');

            expect(entityVersion).not.to.be.null;
            expect(entityVersion!.getAttribute('value')).eq('my-version');
        });

        it('without a hidden entityVersion field when entityVersion is not provided', () => {
            const component = render(<FileDisplay {...defaultProps} />);

            const entityVersion = component.container.querySelector('input[name="entityVersion"]');

            expect(entityVersion).to.be.null;
        });
    });
});
