import React from 'react';

interface FormGroupProps {
    id?: string;
    isError?: boolean;
    className?: string;
    children: React.ReactNode;
}

const formGroupClassName = 'govuk-form-group';
const formGroupErrorClassName = 'govuk-form-group--error';

export const GdsFormGroup = (props: FormGroupProps): JSX.Element => {
    const idProp = props.id ? { id: props.id } : {};
    const classNames = [formGroupClassName];
    if (props.isError) {
        classNames.push(formGroupErrorClassName);
    }
    if (props.className) {
        classNames.push(props.className);
    }
    return (
        <div {...idProp} className={classNames.join(' ')}>
            {props.children}
        </div>
    );
};
