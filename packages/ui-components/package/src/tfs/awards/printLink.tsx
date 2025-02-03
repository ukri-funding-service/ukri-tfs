import React, { ReactElement } from 'react';

const printListener = (e: React.MouseEvent) => {
    window.print();
    e.preventDefault();
    return false;
};

interface PrintLinkProps {
    printText: string;
    preLinkText?: string;
}

export const valueOrElseEmptyString = (value: string | undefined): string => {
    if (value === undefined) {
        return '';
    }

    return value;
};

export const PrintLink = (props: PrintLinkProps): ReactElement => {
    return (
        <span className="js-only u-pad-t15">
            {valueOrElseEmptyString(props.preLinkText)}
            <a href="#" className="govuk-link" id="printLink" onClick={printListener}>
                {props.printText}
            </a>
        </span>
    );
};
