import React from 'react';

export interface DashboardResourceItemProps {
    ariaLabel: string;
    title: string;
    link: string;
    numberOfItems?: number;
    footer: string;
    id?: string;
}

export interface DashboardResourceItemsProps {
    items: DashboardResourceItemProps[];
    className?: string;
}

export const DashboardResourceItem: React.FunctionComponent<DashboardResourceItemsProps> = ({ items, className }) => {
    const classes = 'columns dashboard-resource-items' + (className ? ` ${className}` : '');
    return (
        <div className={classes}>
            {items.map(i => {
                return (
                    <div key={i.title} className="column is-3" id={i.id}>
                        <div className="dashboard-resource-item">
                            <a href={i.link} className="dashboard-resource-item__link">
                                <span className="dashboard-resource-item__heading">{i.title}</span>
                                {i.numberOfItems !== undefined && (
                                    <span className="dashboard-resource-item__number">{i.numberOfItems}</span>
                                )}
                                <span className="dashboard-resource-item__progress">{i.footer}</span>
                            </a>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
