import React from 'react';

interface PageLayoutFullWidthProps {
    breadcrumbs?: React.ReactNode;
    errorSummary?: React.ReactNode;
    heading: React.ReactNode;
    banner?: React.ReactNode;
    main: React.ReactNode;
}

export const PageLayoutFullWidth = (props: PageLayoutFullWidthProps): React.ReactElement => {
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
                <div className="columns">
                    <div className="column is-full">
                        {props.banner ? <React.Fragment>{props.banner}</React.Fragment> : null}
                    </div>
                </div>
                <div className="columns is-gapless">
                    <div className="column is-full is-12-widescreen" id="heading-section-container">
                        {props.heading}
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-full is-12-desktop is-12-widescreen" id="main-section-container">
                        {props.main}
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
};
