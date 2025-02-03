import React from 'react';

export type ListProps = {
    extraSpacing?: boolean;
};

const spaceList = (props: ListProps) => {
    if (props.extraSpacing) {
        return ' govuk-list--spaced';
    }
    return '';
};

export const UL: React.FunctionComponent<ListProps> = props => {
    return <ul className={'govuk-list govuk-list--bullet' + spaceList(props)}>{props.children}</ul>;
};

export const OL: React.FunctionComponent<ListProps> = props => {
    return <ol className={'govuk-list govuk-list--number' + spaceList(props)}>{props.children}</ol>;
};

export const PlainList: React.FunctionComponent<ListProps> = props => {
    return <ul className={'govuk-list' + spaceList(props)}>{props.children}</ul>;
};
