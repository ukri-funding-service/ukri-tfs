import { storiesOf } from '@storybook/react';
import { FileDisplay, FileMetadata } from '../components';
import React from 'react';

import '../styles.scss';

const stories = storiesOf('Components', module);

const items: FileMetadata[] = [
    { fileName: 'My House Papers', fileType: 'application/pdf', id: '1', size: 1.1, status: 'CLEAN' },
];

stories.add('FileDisplay', () => (
    <FileDisplay hasRemoveLink={true} items={items} pageProps={{ csrfToken: 'hee' }} entityVersion="my-version" />
));
