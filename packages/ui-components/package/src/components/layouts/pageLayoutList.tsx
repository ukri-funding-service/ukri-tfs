import React from 'react';

interface PageLayoutListProps {
    heading: React.ReactNode;
    main: React.ReactNode;
    breadcrumbs?: React.ReactNode;
    errorSummary?: React.ReactNode;
    banner?: React.ReactNode;
    guidance?: React.ReactNode;
    sideBar?: React.ReactNode;
    topContent?: React.ReactNode;
}

export const PageLayoutList = (props: PageLayoutListProps): JSX.Element => {
    return (
        <React.Fragment>
            {props.breadcrumbs && (
                <div className="columns">
                    <section className="column is-full">{props.breadcrumbs}</section>
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
                {props.banner ? (
                    <div className="columns">
                        <div className="column is-full">{props.banner}</div>
                    </div>
                ) : null}
                <div className="columns is-gapless">
                    <div className="column is-full is-9-widescreen" id="heading-section-container">
                        {props.heading}
                    </div>
                </div>
                {props.guidance ?? (
                    <div className="columns">
                        <div className="column is-full govuk-!-margin-left-1" id="guidance-section-container">
                            {props.guidance}
                        </div>
                    </div>
                )}
                {props.topContent ?? (
                    <div className="columns" id="top-content-section-container">
                        {props.topContent}
                    </div>
                )}
                <div className="columns">
                    <div className={'column is-3'} role="complementary" id="sidebar-section-container">
                        {props.sideBar}
                    </div>
                    <div className="column is-9" role="main" id="main-section-container">
                        {props.main}
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
};
