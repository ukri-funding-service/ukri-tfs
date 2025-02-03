import React from 'react';
import { expect } from 'chai';
import { MetadataItems, MetadataItem } from '../../../src/components/metadataItems';
import { TfsPanelItem } from '../../../src/components/panelItem';
import { render } from '@testing-library/react';

describe('<TfsPanelItems /> component tests', () => {
    it('should render 4 metadata items within a panel', () => {
        // given
        const leftPanel = (
            <MetadataItems>
                <MetadataItem id="foo1" description="description1" value={1} />
                <MetadataItem id="foo2" description="description2" value={2} />
                <MetadataItem id="foo3" description="description3" value={3} />
                <MetadataItem id="foo4" description="description4" value={4} />
            </MetadataItems>
        );

        // when
        const { container } = render(<TfsPanelItem isComplete={false} leftPanel={leftPanel} />);

        // then
        expect(container.querySelectorAll('.application-item__data-item').length).to.equal(4);
    });

    it('should render 2 metadata items within a panel with correct values', () => {
        // given
        const leftPanel = (
            <MetadataItems>
                <MetadataItem id="foo1" description="description1" value="foo" />
                <MetadataItem id="foo2" description="description2" value="bar" />
            </MetadataItems>
        );

        // when
        const { container } = render(<TfsPanelItem isComplete={false} leftPanel={leftPanel} />);

        // then
        expect(container.querySelectorAll('.application-item__data-item').length).to.equal(2);
        expect(container.querySelectorAll('.application-item__data-text')[0].textContent).to.contain('foo');
        expect(container.querySelectorAll('.application-item__data-text')[1].textContent).to.contain('bar');
    });

    it('should render 2 metadata items within a panel with correct descriptions', () => {
        // given
        const leftPanel = (
            <MetadataItems>
                <MetadataItem id="foo1" description="description1" value="foo" />
                <MetadataItem id="foo2" description="description2" value="bar" />
            </MetadataItems>
        );

        // when
        const { container } = render(<TfsPanelItem isComplete={false} leftPanel={leftPanel} />);

        // then
        expect(container.querySelectorAll('.application-item__data-item').length).to.equal(2);
        expect(container.querySelectorAll('.application-item__data-text')[0].textContent).to.contain('description1');
        expect(container.querySelectorAll('.application-item__data-text')[1].textContent).to.contain('description2');
    });
});
