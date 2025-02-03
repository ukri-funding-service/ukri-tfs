import { TfsPagerProps, TfsPager } from '../components';
import React from 'react';

export function withPagination<T>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T & TfsPagerProps> {
    return function ComponentWithPagination(props) {
        return (
            <React.Fragment>
                <WrappedComponent {...props} />
                <TfsPager {...props} />
            </React.Fragment>
        );
    };
}
