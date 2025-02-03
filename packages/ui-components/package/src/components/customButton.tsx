import React from 'react';
import { Button } from 'govuk-react-jsx';

export const CustomButton: React.FunctionComponent = () => {
    return <Button onClick={() => alert('hello')}> New Button </Button>;
};
