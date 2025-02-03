import React from 'react';

export type TfsStatusType = 'success' | 'cross' | 'info' | 'cancelled';

interface AlertProps {
    text: string;
    statusType?: TfsStatusType;
}
export const TfsStatus = (props: AlertProps): JSX.Element => {
    let className = 'tfs-status';

    if (props.statusType) {
        className += ` tfs-status--${props.statusType}`;
    }
    return <div className={className}>{props.text}</div>;
};
