import React from 'react';

interface ColumnsProps {
    id?: string;
    className?: string;
    children: React.ReactNode;
}

const columnsClassName = 'columns';

export const Columns = (props: ColumnsProps): JSX.Element => {
    const idProp = props.id ? { id: props.id } : {};
    const elementClassName = props.className ? `${columnsClassName} ${props.className}` : columnsClassName;
    return (
        <div {...idProp} className={elementClassName}>
            {props.children}
        </div>
    );
};
