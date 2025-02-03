import { HeaderProps, Template } from 'govuk-react-jsx';
import { Helmet } from 'react-helmet';
import React from 'react';

export interface LayoutProps {
    headerProps: HeaderProps;
    children?: string | React.ReactChild | React.ReactChild[];
}

export function Layout({ headerProps, children }: LayoutProps): JSX.Element {
    return (
        <Template header={headerProps}>
            <Helmet>
                <title>ui-components-demo</title>
            </Helmet>
            {children}
        </Template>
    );
}
