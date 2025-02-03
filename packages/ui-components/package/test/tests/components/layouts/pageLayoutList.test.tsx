import React from 'react';
import { PageLayoutList } from '../../../../src';
import * as Mocha from 'mocha';
import { expect } from 'chai';
import { render } from '@testing-library/react';

Mocha.describe('<pageLayoutList /> component tests', () => {
    const main = <div id="main"></div>;
    const breadCrumbs = <div id="breadcrumbs"></div>;
    const heading = <div id="heading"></div>;
    const sideBar = <div id="sidebar"></div>;
    const guidance = <div id="guidance"></div>;
    const topContent = <div id="top-content"></div>;

    Mocha.it('Should render the main content', () => {
        const pageLayout = render(
            <PageLayoutList
                main={main}
                heading={heading}
                guidance={guidance}
                breadcrumbs={breadCrumbs}
                sideBar={sideBar}
            />,
        );
        expect(pageLayout.container.querySelector('#main')).to.exist;
    });

    Mocha.it('Should render the side bar content', () => {
        const pageLayout = render(
            <PageLayoutList
                main={main}
                heading={heading}
                guidance={guidance}
                breadcrumbs={breadCrumbs}
                sideBar={sideBar}
            />,
        );
        expect(pageLayout.container.querySelector('#sidebar')).to.exist;
    });

    Mocha.it('Should render the breadcrumbs content', () => {
        const pageLayout = render(
            <PageLayoutList
                main={main}
                heading={heading}
                guidance={guidance}
                breadcrumbs={breadCrumbs}
                sideBar={sideBar}
            />,
        );
        expect(pageLayout.container.querySelector('#breadcrumbs')).to.exist;
    });

    Mocha.it('Should render the heading content', () => {
        const pageLayout = render(
            <PageLayoutList
                main={main}
                heading={heading}
                guidance={guidance}
                breadcrumbs={breadCrumbs}
                sideBar={sideBar}
            />,
        );
        expect(pageLayout.container.querySelector('#heading')).to.exist;
    });

    Mocha.it('Should render the guidance content', () => {
        const pageLayout = render(
            <PageLayoutList
                main={main}
                heading={heading}
                guidance={guidance}
                breadcrumbs={breadCrumbs}
                sideBar={sideBar}
            />,
        );
        expect(pageLayout.container.querySelector('#guidance')).to.exist;
    });

    Mocha.it('Should render the top content', () => {
        const pageLayout = render(
            <PageLayoutList
                main={main}
                heading={heading}
                guidance={guidance}
                breadcrumbs={breadCrumbs}
                sideBar={sideBar}
                topContent={topContent}
            />,
        );
        expect(pageLayout.container.querySelector('#top-content')).to.exist;
    });

    Mocha.it('Should render without optional properties', () => {
        const pageLayout = render(<PageLayoutList main={main} heading={heading} />);
        expect(pageLayout.container.querySelector('#heading')).to.exist;
    });
});
