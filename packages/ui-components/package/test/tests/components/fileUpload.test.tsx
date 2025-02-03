import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { FileUpload } from '../../../src/components/fileUpload';

describe('<FileUpload /> component tests', () => {
    it('should display file upload', () => {
        const { container } = render(<FileUpload />);
        expect(container.querySelector('.govuk-file-upload')).to.exist;
    });
});
