import React from 'react';

export interface FormProps {
    id?: string;
    className?: string;
    name?: string;
    action?: string;
    method?: string;
    csrfToken?: string;
    children?: React.ReactNode;
    noValidate?: boolean;
    encType?: string;
}

export const Form = (props: FormProps): JSX.Element => {
    if (!props.csrfToken) {
        throw new Error('csrfToken prop is missing or empty');
    }
    const formProps: FormProps = {};
    if (props.id) {
        formProps.id = props.id;
    }
    if (props.className) {
        formProps.className = props.className;
    }
    if (props.name) {
        formProps.name = props.name;
    }
    if (props.encType) {
        formProps.encType = props.encType;
    }
    formProps.action = props.action || '';
    formProps.method = props.method || 'post';
    return (
        <form {...formProps} noValidate={props.noValidate ?? true}>
            <input type="hidden" name="csrfToken" value={props.csrfToken} />
            {props.children}
        </form>
    );
};
