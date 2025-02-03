import { expect } from 'chai';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { TfsAlert } from '../../../src/';
describe('<TfsAlert /> component tests', () => {
    let component: RenderResult;
    afterEach(() => {
        component.unmount();
    });
    it('should render text in component', () => {
        component = render(<TfsAlert text="Text asd"></TfsAlert>);
        expect(component.container.querySelectorAll('.alerts').length).to.equal(1);
        expect(component.container.querySelectorAll('.alerts--link').length).to.equal(0);
        expect(component.container.querySelector('.alerts')!.textContent).to.contain('Text asd');
    });

    it('should render with a link in component', () => {
        component = render(<TfsAlert text="Text asd" linkText="A link" href="google.com"></TfsAlert>);
        expect(component.container.querySelectorAll('.alerts').length).to.equal(1);
        expect(component.container.querySelectorAll('.alerts--link').length).to.equal(1);
        expect(component.container.querySelectorAll('.govuk-link').length).to.equal(1);
        expect(component.container.querySelector('.alerts')!.textContent).to.contain('Text asd');
    });

    it('should render a success alert', () => {
        component = render(<TfsAlert alertType="success" text="Text asd"></TfsAlert>);
        expect(component.container.querySelectorAll('.alerts--success').length).to.equal(1);
        expect(component.container.textContent).to.include('success:');
    });

    it('should render a success alert with a link in component', () => {
        component = render(
            <TfsAlert alertType="success" text="Text asd" linkText="A link" href="google.com"></TfsAlert>,
        );
        expect(component.container.querySelectorAll('.alerts').length).to.equal(1);
        expect(component.container.querySelectorAll('.alerts--link').length).to.equal(1);
        expect(component.container.querySelectorAll('.govuk-link').length).to.equal(1);
        expect(component.container.querySelector('.alerts')!.textContent).to.contain('Text asd');
    });

    it('should render a cross alert', () => {
        component = render(<TfsAlert alertType="cross" text="Text asd"></TfsAlert>);
        expect(component.container.querySelectorAll('.alerts--cross').length).to.equal(1);
        expect(component.container.textContent).to.include('error:');
    });

    it('should render a danger alert', () => {
        component = render(<TfsAlert alertType="danger" text="Text asd"></TfsAlert>);
        expect(component.container.querySelectorAll('.alerts--danger').length).to.equal(1);
        expect(component.container.textContent).to.include('warning:');
    });

    it('should render a info alert', () => {
        component = render(<TfsAlert alertType="info" text="Text asd"></TfsAlert>);
        expect(component.container.querySelectorAll('.alerts--info').length).to.equal(1);
        expect(component.container.textContent).to.include('info:');
    });

    it('should render a warning alert', () => {
        component = render(<TfsAlert alertType="warning" text="Text asd"></TfsAlert>);
        expect(component.container.querySelectorAll('.alerts--warning').length).to.equal(1);
    });

    it('should render a mono alert', () => {
        component = render(<TfsAlert alertType="mono" text="Text asd"></TfsAlert>);
        expect(component.container.querySelectorAll('.alerts--mono').length).to.equal(1);
        expect(component.container.textContent).to.include('info:');
    });
});
