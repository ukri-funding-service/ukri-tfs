# TFS Strings Management Library (@ukri-tfs/strings)

The @ukri-tfs/strings library decouples management of site
string content such as common page title elements, headings, button
text, etc. from application code. It is the interface through which
application code fetches site string content from an external source
that provides these.

## API

The library exports the following for use in application code:

```
    export interface StringComponent {
        tfsModule: 'GLOBAL' |
        'OPP' | 'FRD' | 'APM' | 'AAD' |
        'APS' | 'PRE' | 'MAE' | 'PMN';
        id: string;
        value: string;
        pageId?: string;
        description?: string;
    }

    export type StringContent = Array<StringComponent>;

    export async function getStringContent(remoteUrl: string): Promise<StringContent>;
```

## PUBLISHING

The package is published to the private npm registry https://devops.innovateuk.org/binaries/repository/npm-private/

The package is published when a change is committed to the master branch, the versioning scheme we follow is Major.Minor.build_numberMajor version is 1, minor version is 1 and patch is dynamic as defined above.
