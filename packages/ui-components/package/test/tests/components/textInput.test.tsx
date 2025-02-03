import React from 'react';
import { use, expect } from 'chai';
import sinonChai from 'sinon-chai';
import { Input } from '../../../src/components/input';
import { ValidationResult } from '@ukri-tfs/validation';
import sinon from 'sinon';
import { fireEvent, render } from '@testing-library/react';

const validValidation = new ValidationResult(null, true, true, '', '', true, '');
const invalidValidation = new ValidationResult(null, true, false, 'this is not valid', '', true, '');
describe('<Input /> component tests', () => {
    before(() => {
        use(sinonChai);
    });
    it('should not have error classname when validator is not set and isError is set to false and error messages have 0 length', () => {
        const component = render(<Input name="Title" isError={false} errorMessages={[]} />);
        expect(component.container.querySelector('input')!.className).to.not.contain('govuk-input--error');
    });

    it('should have error classname when validator is not set and isError is set to true and error messages have 0 length', () => {
        const component = render(<Input name="Title" isError={true} errorMessages={[]} />);
        expect(component.container.querySelector('input')!.className).to.contain('govuk-input--error');
    });

    it('should not have error classname when validator is not set and isError is set to false', () => {
        const component = render(<Input name="Title" isError={false} />);
        expect(component.container.querySelector('input')!.className).to.not.contain('govuk-input--error');
    });

    it('should  have error classname when validator is not set and isError is set to false', () => {
        const component = render(<Input name="Title" isError={true} />);
        expect(component.container.querySelector('input')!.className).to.contain('govuk-input--error');
    });

    it('Should show validation message by default when validation has not passed', () => {
        const component = render(<Input name="Title" validation={invalidValidation} />);
        expect(component.container.querySelector('span.govuk-error-message')!.textContent).to.contain(
            'this is not valid',
        );
    });

    it('Should show validation message when deprecated error message is used', () => {
        const component = render(<Input name="Title" errorMessages={['this is not valid']} />);
        expect(component.container.querySelector('span.govuk-error-message')!.textContent).to.contain(
            'this is not valid',
        );
    });

    it('should set correct default className', () => {
        const component = render(<Input name="Title" />);
        expect(component.container.querySelector('input')!.className).to.contain('govuk-input');
    });

    it('should set correct className if did not pass validation', () => {
        const component = render(<Input name="Title" validation={invalidValidation} />);
        expect(component.container.querySelector('input')!.className).to.contain('govuk-input--error');
    });

    it('should set correct className if deprecated isError is used', () => {
        const component = render(<Input name="Title" isError={true} />);
        expect(component.container.querySelector('input')!.className).to.contain('govuk-input--error');
    });

    it('should not set error className if did pass validation', () => {
        const component = render(<Input name="Title" validation={validValidation} />);
        expect(component.container.querySelector('input')!.className).to.not.contain('govuk-input--error');
    });

    it('should set correct className if className is set', () => {
        const component = render(<Input name="Title" className="ukri-tfs-custom-field-style" />);
        expect(component.container.querySelector('input')!.className).to.contain('ukri-tfs-custom-field-style');
    });

    it('should set correct name', () => {
        const component = render(<Input name="Title" />);
        expect(component.container.querySelector('input')!.getAttribute('name')).to.equal('Title');
    });

    it('should set correct ID', () => {
        const component = render(<Input name="Title" />);
        expect(component.container.querySelector('input')!.id).to.equal('Title');
    });

    it('should set input type if one is supplied', () => {
        const component = render(<Input name="Title" type="number" />);
        expect(component.container.querySelector('input')!.getAttribute('type')).to.equal('number');
    });

    it('should increment steps if supplied', () => {
        const component = render(<Input name="Title" type="number" disableSteps={true} defaultValue={'1'} />);
        expect(component.container.querySelector('input')!.value).to.equal('1');
        const inputElm = component.container.querySelector('input')!;
        fireEvent.keyDown(inputElm, {
            key: 'ArrowUp',
            keyCode: 38,
            code: 'ArrowUp',
            repeat: false,
        });
        expect(component.container.querySelector('input')!.value).to.equal('1');
    });

    it('should set default input type ("text") if none is supplied', () => {
        const component = render(<Input name="Title" />);
        expect(component.container.querySelector('input')!.getAttribute('type')).to.equal('text');
    });

    it('should set width class if a widthSize is supplied', () => {
        const component = render(<Input name="Title" widthSize="10" />);
        expect(component.container.querySelector('.govuk-input--width-10')).to.exist;
    });

    it('should set placeholder if placeholder is set', () => {
        const component = render(<Input name="Title" placeholder="(place holder)" />);
        expect(component.container.querySelector('input')!.getAttribute('placeholder')).to.equal('(place holder)');
    });

    it('should not set a placeholder if placeholder is not set', () => {
        const component = render(<Input name="Title" />);
        expect(component.container.querySelector('input')!.getAttribute('placeholder')).to.be.null;
    });

    it('should set value if defaultValue is set', () => {
        const component = render(<Input name="Title" defaultValue="Default" />);
        expect(component.container.querySelector('input')!.value).to.equal('Default');
    });

    it('should set value to an empty string if defaultValue is set to an empty string', () => {
        const component = render(<Input name="Title" defaultValue="" />);
        expect(component.container.querySelector('input')!.value).to.equal('');
    });

    it('should set value if value is set', () => {
        const component = render(<Input name="Title" value="Default" />);
        expect(component.container.querySelector('input')!.value).to.equal('Default');
    });

    it('should set value if value is set to an empty string', () => {
        const component = render(<Input name="Title" value="" />);
        expect(component.container.querySelector('input')!.value).to.equal('');
    });

    it('should trigger passed in onFocus', () => {
        const focusSpy = sinon.spy();
        const component = render(<Input name="Title" onFocus={focusSpy} />);
        const input = component.container.querySelector('input')!;
        fireEvent.focus(input);
        expect(focusSpy).to.have.been.calledOnce;
    });

    it('should trigger passed in onChange with new string value', () => {
        const testString = 'something';
        const testArgs = { target: { value: testString } };
        const changeSpy = sinon.spy();
        const component = render(<Input name="Title" onChange={changeSpy} />);
        const input = component.container.querySelector('input')!;
        fireEvent.change(input, testArgs);
        expect(changeSpy).to.have.been.calledOnce;
    });

    it('should trigger passed in onBlur', () => {
        const blurSpy = sinon.spy();
        const component = render(<Input name="Title" onBlur={blurSpy} />);
        component.container.querySelector('input')!.focus();
        component.container.querySelector('input')!.blur();
        expect(blurSpy).to.have.been.calledOnce;
    });
});
