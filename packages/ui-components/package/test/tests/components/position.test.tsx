import React from 'react';
import { expect } from 'chai';
import { Position, PositionSpacing } from '../../../src/components/position';
import { render } from '@testing-library/react';

describe('<Position /> container tests', () => {
    it('Should render all children within container', () => {
        const { container, unmount } = render(
            <Position spacing={PositionSpacing.FULL}>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </Position>,
        );
        expect(container.querySelectorAll('p').length).to.equal(3);
        unmount();
    });

    it('Should render with a is-half class', () => {
        const { container, unmount } = render(
            <Position spacing={PositionSpacing.HALF}>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </Position>,
        );
        expect(container.querySelector('.is-half')).to.not.be.null;
        unmount();
    });

    it('Should render with a is-one-quarter class', () => {
        const { container, unmount } = render(
            <Position spacing={PositionSpacing.ONE_QUARTER}>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </Position>,
        );
        expect(container.querySelector('.is-one-quarter')).to.not.be.null;
        unmount();
    });

    it('Should render with a is-three-quarters class', () => {
        const { container, unmount } = render(
            <Position spacing={PositionSpacing.THREE_QUARTERS}>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </Position>,
        );
        expect(container.querySelector('.is-three-quarters')).to.not.be.null;
        unmount();
    });

    it('Should render with a is-two-thirds class', () => {
        const { container, unmount } = render(
            <Position spacing={PositionSpacing.TWO_THIRDS}>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </Position>,
        );
        expect(container.querySelector('.is-two-thirds')).to.not.be.null;
        unmount();
    });

    it('Should render with a is-one-third class', () => {
        const { container, unmount } = render(
            <Position spacing={PositionSpacing.ONE_THIRD}>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </Position>,
        );
        expect(container.querySelector('.is-one-third')).to.not.be.null;
        unmount();
    });
});
