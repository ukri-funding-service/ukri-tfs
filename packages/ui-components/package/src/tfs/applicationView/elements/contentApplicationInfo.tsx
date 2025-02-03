import React from 'react';
import { DictionaryList, DictionaryListItems } from '../../../components/dictionaryList';

interface TfsApplicationContentInfoProps {
    main: DictionaryListItems;
    statusText: string;
}

export const TfsApplicationContentInfo: React.FunctionComponent<TfsApplicationContentInfoProps> = (
    props,
): JSX.Element => (
    <div className="print-show">
        <DictionaryList items={props.main} />
        <hr className="section-break section-break--hardcore" />
        <DictionaryList items={[{ key: 'Application status:', value: props.statusText }]} />
        <hr className="section-break section-break--feather" />
    </div>
);
