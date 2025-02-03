import { expect } from 'chai';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { TfsStatus } from '../../../src';
describe('<TfsStatus /> component tests', () => {
    let component: RenderResult;
    afterEach(() => {
        component.unmount();
    });
    it('should render text in component', () => {
        component = render(<TfsStatus text="Text asd"></TfsStatus>);
        expect(component.container.querySelectorAll('.tfs-status').length).to.equal(1);
        const statusComponent = component.container.querySelector('.tfs-status');
        expect(statusComponent).to.not.be.null;
        expect(statusComponent!.textContent).to.contain('Text asd');
    });

    it('should render a success alert', () => {
        component = render(<TfsStatus statusType="success" text="Text asd"></TfsStatus>);
        expect(component.container.querySelectorAll('.tfs-status--success').length).to.equal(1);
    });

    it('should render a cross alert', () => {
        component = render(<TfsStatus statusType="cross" text="Text asd"></TfsStatus>);
        expect(component.container.querySelectorAll('.tfs-status--cross').length).to.equal(1);
    });

    it('should render a info alert', () => {
        component = render(<TfsStatus statusType="info" text="Text asd"></TfsStatus>);
        expect(component.container.querySelectorAll('.tfs-status--info').length).to.equal(1);
    });

    it('should render a cancelled alert', () => {
        component = render(<TfsStatus statusType="cancelled" text="Text asd"></TfsStatus>);
        expect(component.container.querySelectorAll('.tfs-status--cancelled').length).to.equal(1);
    });
});
