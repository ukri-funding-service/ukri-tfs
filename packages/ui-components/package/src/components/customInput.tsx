import { Input, InputProps } from 'govuk-react-jsx';
import React from 'react';

export interface CustomInputProps extends InputProps {
    placeholder?: string;
}

export const CustomInput: React.FunctionComponent<CustomInputProps> = props => (
    <Input placeholder="Foo-value" {...props} />
);
