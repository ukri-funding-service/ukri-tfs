import React from 'react';

export interface CustomPanelProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children?: React.ReactNode;
}

export const CustomPanel: React.FunctionComponent<CustomPanelProps> = ({ children }) => {
    return (
        <div className="application-item">
            <div className="application-item__contents govuk-clearfix">
                {!!children && <div className="application-item">{children}</div>}
            </div>
        </div>
    );
};
