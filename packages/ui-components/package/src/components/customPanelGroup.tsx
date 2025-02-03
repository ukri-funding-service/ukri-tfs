import React from 'react';

interface CustomPanelGroupProps {
    columnClassName?: string;
    children: React.ReactNode;
}

export const CustomPanelGroup: React.FC<CustomPanelGroupProps> = ({ columnClassName, children }) => {
    return <div className={columnClassName || 'govuk-grid-column-two-thirds'}>{children}</div>;
};
