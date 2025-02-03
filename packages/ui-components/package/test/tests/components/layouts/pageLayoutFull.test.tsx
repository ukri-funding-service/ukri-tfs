import React from 'react';
import { PageLayoutFull } from '../../../../src';
import * as Mocha from 'mocha';
import { expect } from 'chai';
import { render } from '@testing-library/react';

Mocha.describe('<pageLayoutFull /> component tests', () => {
    const main = <div id="main"></div>;
    const breadCrumbs = <div id="breadcrumbs"></div>;
    const heading = <div id="heading"></div>;

    Mocha.it('Should render the main content', () => {
        const pageLayout = render(<PageLayoutFull main={main} heading={heading} breadcrumbs={breadCrumbs} />);
        expect(pageLayout.container.querySelector('#main')).to.exist;
    });

    Mocha.it('Should render the breadcrumbs content', () => {
        const pageLayout = render(<PageLayoutFull main={main} heading={heading} breadcrumbs={breadCrumbs} />);
        expect(pageLayout.container.querySelector('#breadcrumbs')).to.exist;
    });

    Mocha.it('Should render the heading content', () => {
        const pageLayout = render(<PageLayoutFull main={main} heading={heading} breadcrumbs={breadCrumbs} />);
        expect(pageLayout.container.querySelector('#heading')).to.exist;
    });

    Mocha.it('Should render without optional properties', () => {
        const pageLayout = render(<PageLayoutFull main={main} heading={heading} />);
        expect(pageLayout.container.querySelector('#heading')).to.exist;
    });
});
