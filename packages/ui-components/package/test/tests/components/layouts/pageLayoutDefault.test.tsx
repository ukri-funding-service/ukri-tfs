import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { PageLayoutDefault } from '../../../../src';

describe('<pageLayoutDefault /> component tests', () => {
    const main = <div id="main"></div>;
    const breadcrumbs = <div id="breadcrumbs"></div>;
    const heading = <div id="heading"></div>;
    const sideBar = <div id="sidebar"></div>;
    const banner = <div id="banner"></div>;
    const headerSidebar = <div id="headerSidebar"></div>;

    it('Should render the main content', () => {
        const pageLayout = render(
            <PageLayoutDefault
                main={main}
                heading={heading}
                breadcrumbs={breadcrumbs}
                sideBar={sideBar}
                banner={banner}
            />,
        );
        expect(pageLayout.container.querySelector('#main')).to.exist;
    });

    it('Should render the side bar content', () => {
        const pageLayout = render(
            <PageLayoutDefault
                main={main}
                heading={heading}
                breadcrumbs={breadcrumbs}
                sideBar={sideBar}
                banner={banner}
            />,
        );
        expect(pageLayout.container.querySelector('#sidebar')).to.exist;
    });

    it('Should render the header side bar content ', () => {
        const pageLayout = render(
            <PageLayoutDefault
                main={main}
                heading={heading}
                breadcrumbs={breadcrumbs}
                sideBar={sideBar}
                banner={banner}
                headerSidebar={headerSidebar}
            />,
        );
        expect(pageLayout.container.querySelector('#headerSidebar')).to.exist;
    });

    it('Should render the breadcrumbs content', () => {
        const pageLayout = render(
            <PageLayoutDefault
                main={main}
                heading={heading}
                breadcrumbs={breadcrumbs}
                sideBar={sideBar}
                banner={banner}
            />,
        );
        expect(pageLayout.container.querySelector('#breadcrumbs')).to.exist;
    });

    it('Should render the heading content', () => {
        const pageLayout = render(
            <PageLayoutDefault
                main={main}
                heading={heading}
                breadcrumbs={breadcrumbs}
                sideBar={sideBar}
                banner={banner}
            />,
        );
        expect(pageLayout.container.querySelector('#heading')).to.exist;
    });

    it('Should render the banner content', () => {
        const pageLayout = render(
            <PageLayoutDefault
                main={main}
                heading={heading}
                breadcrumbs={breadcrumbs}
                sideBar={sideBar}
                banner={banner}
            />,
        );
        expect(pageLayout.container.querySelector('#banner')).to.exist;
    });

    it('Should render without optional properties', () => {
        const pageLayout = render(<PageLayoutDefault main={main} heading={heading} />);
        expect(pageLayout.container.querySelector('#heading')).to.exist;
    });
});
