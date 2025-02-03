import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ResultListProps, resultList } from '../../../../src';
import { Organisation } from '../../../../src/tfs/extendedOrgList/types/organisation';

const defaultProps: ResultListProps = {
    pageInfo: {
        totalRecords: 1,
        totalPages: 1,
        page: 1,
        pageSize: 1,
        startRecord: 1,
        endRecord: 1,
        baseUrl: 'URL',
    },
    organisations: [{ name: 'Ruskin College Oxford', city: 'Oxford', country: 'UK' } as Organisation],
    manualAddOrganisationUrl: 'manual-add-org-url',
    searchTerm: 'wibble',
};

const csrfProps = {
    csrfToken: 'xyz',
};

const notDisplayedProps: ResultListProps = {
    pageInfo: {
        totalRecords: 0,
        totalPages: 1,
        page: 1,
        pageSize: 1,
        startRecord: 1,
        endRecord: 1,
        baseUrl: 'URL',
    },
    organisations: [],
    manualAddOrganisationUrl: 'manual-add-org-url',
    searchTerm: 'wibble',
};

describe('Search Organisation result page', () => {
    it('should display organisations', () => {
        const wrapper = render(<div>{resultList(defaultProps, csrfProps)}</div>);
        const name = wrapper.container.querySelector('strong');
        const place = wrapper.container.querySelector('.meta');
        wrapper.unmount();

        expect(name).to.not.be.null;
        expect(name?.textContent).to.not.be.null;
        expect(name!.textContent!.trim()).to.equal('Ruskin College Oxford');

        expect(place).to.not.be.null;
        expect(place!.textContent).to.equal('Oxford, UK');
    });

    it('should display result count singular', () => {
        const wrapper = render(<div>{resultList(defaultProps, csrfProps)}</div>);

        const resultsTextComponent = wrapper.container.querySelector('#organisation-results-text');
        expect(resultsTextComponent).to.not.be.null;

        expect(resultsTextComponent!.textContent).to.eql("1 result for 'wibble'.");
        wrapper.unmount();
    });

    it('should display footer with correct link text in it', () => {
        const wrapper = render(<div>{resultList(defaultProps, csrfProps)}</div>);

        const newOrganisationComponent = wrapper.container.querySelector('#new-organisation');
        expect(newOrganisationComponent).to.not.be.null;

        expect(newOrganisationComponent!.textContent).to.eql("enter the organisation's details manually");
        wrapper.unmount();
    });

    it('should display result count plural', () => {
        const pluralProps = { ...defaultProps };
        pluralProps.pageInfo = { ...defaultProps.pageInfo };
        pluralProps.pageInfo.totalRecords = 777;
        const wrapper = render(<div>{resultList(pluralProps, csrfProps)}</div>);

        const orgResultsTextComponent = wrapper.container.querySelector('#organisation-results-text');
        expect(orgResultsTextComponent).to.not.be.null;

        expect(orgResultsTextComponent!.textContent).to.eql("777 results for 'wibble'.");
        wrapper.unmount();
    });

    it('should display no results found', () => {
        const wrapper = render(<div>{resultList(notDisplayedProps, csrfProps)}</div>);

        const orgResultsTextComponent = wrapper.container.querySelector('#organisation-results-text');
        expect(orgResultsTextComponent).to.not.be.null;

        expect(orgResultsTextComponent!.textContent).to.eql("There are no results for 'wibble'.");
        wrapper.unmount();
    });

    it('should display only the country when city is not present', () => {
        const props = {
            ...defaultProps,
            organisations: [{ name: 'Ruskin College Oxford', country: 'UK' } as Organisation],
        };
        const wrapper = render(<div>{resultList(props, csrfProps)}</div>);
        const place = wrapper.container.querySelector('.meta');
        wrapper.unmount();
        expect(place).to.not.be.null;
        expect(place!.textContent).to.equal('UK');
    });

    it('should display only city when country is not present', () => {
        const props = {
            ...defaultProps,
            organisations: [{ name: 'Ruskin College Oxford', city: 'Oxford' } as Organisation],
        };
        const wrapper = render(<div>{resultList(props, csrfProps)}</div>);
        const place = wrapper.container.querySelector('.meta');
        wrapper.unmount();
        expect(place).to.not.be.null;
        expect(place!.textContent).to.equal('Oxford');
    });

    it('should display empty string when both city and country are not present', () => {
        const props = {
            ...defaultProps,
            organisations: [{ name: 'Ruskin College Oxford' } as Organisation],
        };
        const wrapper = render(<div>{resultList(props, csrfProps)}</div>);
        const place = wrapper.container.querySelector('.meta');
        wrapper.unmount();
        expect(place).to.not.be.null;
        expect(place!.textContent).to.equal('');
    });
});
