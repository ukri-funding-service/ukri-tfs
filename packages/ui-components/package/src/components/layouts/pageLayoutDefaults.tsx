import React from 'react';

export type PageLayout = 'default' | 'full' | 'fullWidth';

type LayoutProps = {
    layout?: PageLayout;
};

type PageLayoutDefaultProps = {
    breadcrumbs?: React.ReactNode;
    errorSummary?: React.ReactNode;
    heading: React.ReactNode;
    banner?: React.ReactNode;
    fileUploadStatusBanner?: React.ReactNode;
} & LayoutProps &
    WithSidebarProps &
    WithHeaderSidebarProps;

const commonHeadingClassNames = 'column is-full';
const commonMainClassNames = 'column is-full govuk-!-padding-0';

const layoutColumnMap: { [key in PageLayout]: { heading: string; main: string } } = {
    default: { heading: `is-12-widescreen`, main: '' },
    full: {
        heading: `is-9-widescreen is-gapless`,
        main: `is-9-desktop is-9-widescreen`,
    },
    fullWidth: {
        heading: `is-12-widescreen`,
        main: `is-12-desktop is-12-widescreen`,
    },
};

export const PageLayoutDefault = (props: PageLayoutDefaultProps): React.ReactElement => {
    return (
        <React.Fragment>
            {props.breadcrumbs && (
                <div className="columns">
                    <div className="column is-full">{props.breadcrumbs}</div>
                </div>
            )}
            <main id="main-content" className="u-space-t30 u-space-b30">
                {props.errorSummary && (
                    <div className="columns">
                        <div className="column is-full is-12-widescreen" id="error-section-container">
                            {props.errorSummary}
                        </div>
                    </div>
                )}
                <div className="columns">
                    <div className="column is-full">
                        {props.banner ? <React.Fragment>{props.banner}</React.Fragment> : null}
                        {props.fileUploadStatusBanner ? (
                            <React.Fragment>{props.fileUploadStatusBanner}</React.Fragment>
                        ) : null}
                    </div>
                </div>
                <WithHeaderSidebar {...props} />
                <WithSidebar {...props} />
            </main>
        </React.Fragment>
    );
};

type WithSidebarProps = {
    main: React.ReactNode;
    sideBar?: React.ReactNode;
    noSidebar?: boolean;
    mainId?: string;
    sideBarId?: string;
};

type WithHeaderSidebarProps = {
    heading: React.ReactNode;
    headerSidebar?: React.ReactNode | null;
    headerMainId?: string;
    headerSidebarId?: string;
};

export const WithHeaderSidebar = (props: WithHeaderSidebarProps & LayoutProps): React.ReactElement => {
    if (props.headerSidebar === null) {
        return (
            <div className="columns is-gapless">
                <div
                    className={`${commonHeadingClassNames} ${layoutColumnMap[props.layout || 'default'].heading}`}
                    id="heading-section-container"
                >
                    {props.heading}
                </div>
            </div>
        );
    } else {
        const mainId = props.headerMainId ?? 'main-heading-section-container';
        const sideBarId = props.headerSidebarId ?? 'sidebar-heading-section-container';

        return (
            <div className="columns">
                <div className="column is-7" role="main" id={mainId}>
                    {props.heading}
                </div>
                <div className="column is-4 is-offset-1" role="complementary" id={sideBarId}>
                    {props.headerSidebar}
                </div>
            </div>
        );
    }
};

export const WithSidebar = (props: WithSidebarProps & LayoutProps): React.ReactElement => {
    if (props.noSidebar) {
        return (
            <div
                className={`${commonMainClassNames} ${layoutColumnMap[props.layout || 'default'].main}`}
                id="main-section-container"
            >
                {props.main}
            </div>
        );
    } else {
        const mainId = props.mainId ?? 'main-section-container';
        const sideBarId = props.sideBarId ?? 'sidebar-section-container';

        return (
            <div className="columns">
                <div className="column is-7" role="main" id={mainId}>
                    {props.main}
                </div>
                {props.sideBar ? (
                    <div className="column is-4 is-offset-1" role="complementary" id={sideBarId}>
                        {props.sideBar}
                    </div>
                ) : null}
            </div>
        );
    }
};
