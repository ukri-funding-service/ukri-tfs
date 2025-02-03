import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { Form } from '../../../../src/components/form/form';

describe('<Form /> tests', () => {
    afterEach(sinon.restore);

    it('should throw an error if no props are set', () => {
        sinon.stub(console, 'error');
        const form = () => render(<Form />);
        expect(form).to.throw('csrfToken prop is missing or empty');
    });

    it('should throw an error if csrfToken is not set', () => {
        sinon.stub(console, 'error');
        const form = () => render(<Form id="foo" />);
        expect(form).to.throw('csrfToken prop is missing or empty');
    });

    it('should throw an error if csrfToken is empty', () => {
        sinon.stub(console, 'error');
        const form = () => render(<Form csrfToken="" />);
        expect(form).to.throw('csrfToken prop is missing or empty');
    });

    it('should set the CSRF token if csrfToken is set', () => {
        const form = render(<Form csrfToken="fake" />);
        expect(form.container.querySelector('input[type="hidden"][name="csrfToken"]')?.getAttribute('value')).to.equal(
            'fake',
        );
    });

    it('should not validate in browser by default', () => {
        const form = render(<Form csrfToken="fake" id="validationForm" />);
        expect(form.container.querySelector('#validationForm')?.getAttribute('noValidate')).to.equal('');
    });

    it('should validate in browser if intentionally enabled', () => {
        const form = render(<Form csrfToken="fake" noValidate={false} id="validationForm" />);
        expect(form.container.querySelector('#validationForm')?.getAttribute('noValidate')).to.be.null;
    });

    it('should not set the form name if name is not set', () => {
        const form = render(<Form csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('name')).to.be.null;
    });

    it('should set the form name if name is set', () => {
        const form = render(<Form name="foo" csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('name')).to.equal('foo');
    });

    it('should not set the form class if className is not set', () => {
        const form = render(<Form csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('class')).to.be.null;
    });

    it('should set the form class if className is set', () => {
        const form = render(<Form className="foo" csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('class')).to.equal('foo');
    });

    it('should not set the form ID if className is not set', () => {
        const form = render(<Form csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('id')).to.be.null;
    });

    it('should set the form ID if className is set', () => {
        const form = render(<Form id="foo" csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('id')).to.equal('foo');
    });

    it('should set the form method to "post" if method is not set', () => {
        const form = render(<Form csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('method')).to.equal('post');
    });

    it('should set the form method if method is set', () => {
        const form = render(<Form method="get" csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('method')).to.equal('get');
    });

    it('should set the form action to an empty string if action is not set', () => {
        const form = render(<Form csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('action')).to.equal('');
    });

    it('should set the form action if action is set', () => {
        const form = render(<Form action="/foo" csrfToken="fake" />);
        expect(form.container.querySelector('form')?.getAttribute('action')).to.equal('/foo');
    });
});
