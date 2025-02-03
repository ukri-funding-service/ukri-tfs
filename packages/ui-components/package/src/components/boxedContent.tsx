import React from 'react';

export const BoxedContent = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return <div className="boxed-content">{children}</div>;
};
