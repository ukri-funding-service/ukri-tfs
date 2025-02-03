import cx from 'classnames';
import React from 'react';
import { Input, InputProps } from './input';

interface PasswordInputWithToggleState {
    showPassword: boolean;
    jsEnabled: boolean;
}

export class PasswordInputWithToggle extends React.Component<InputProps, PasswordInputWithToggleState> {
    ref: React.RefObject<HTMLDivElement>;

    constructor(props: InputProps) {
        super(props);
        this.state = { showPassword: false, jsEnabled: false };
        this.toggle = this.toggle.bind(this);
        this.ref = React.createRef();
    }

    componentDidMount(): void {
        this.setState({ jsEnabled: true });
        const div = this.ref.current?.firstElementChild as HTMLDivElement;
        div.style.display = 'inline-block';
        div.style.width = '100%';
    }

    toggle(): void {
        const value = !this.state.showPassword;
        this.setState({ showPassword: value });
    }

    render(): JSX.Element {
        const { showPassword } = this.state;
        const { jsEnabled } = this.state;

        const showHideText = showPassword ? 'Hide' : 'Show';

        const classNames = cx({ 'js-enabled': jsEnabled }, 'password-toggle__link');

        return (
            <div ref={this.ref} className="password-field">
                <Input
                    {...this.props}
                    type={showPassword ? 'text' : 'password'}
                    className={`${this.props.className} ${jsEnabled ? ' password-input js-enabled' : ''}`}
                />
                <a
                    href="#"
                    className={classNames}
                    onClick={e => {
                        this.toggle();
                        e.preventDefault();
                    }}
                >
                    {showHideText}
                    <span className="govuk-visually-hidden"> password</span>
                </a>
            </div>
        );
    }
}
