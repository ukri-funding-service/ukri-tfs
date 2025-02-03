import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DashboardResourceItem, DashboardResourceItemProps } from '../../../src';

const item: DashboardResourceItemProps = {
    ariaLabel: 'Go to Application',
    link: 'https://www.test.com',
    title: 'Applications',
    footer: 'In progress',
};

describe('<DashboardResourceItem /> tests', () => {
    it('should render a dashboard resource item', () => {
        const { container } = render(<DashboardResourceItem items={[{ ...item, numberOfItems: 3 }]} />);
        expect(container.getElementsByClassName('dashboard-resource-item__heading')[0].textContent).to.equal(
            'Applications',
        );
        expect(container.getElementsByClassName('dashboard-resource-item__number')[0].textContent).to.equal('3');
        expect(container.getElementsByClassName('dashboard-resource-item__progress')[0].textContent).to.equal(
            'In progress',
        );
        expect(container.getElementsByTagName('a')[0].getAttribute('href')).to.equal('https://www.test.com');
    });

    it('should render a dashboard resource item without a count', () => {
        const { container } = render(<DashboardResourceItem items={[item]} />);
        expect(container.getElementsByClassName('dashboard-resource-item__heading')[0].textContent).to.equal(
            'Applications',
        );
        expect(container.getElementsByClassName('dashboard-resource-item__number').length).to.equal(0);
        expect(container.getElementsByClassName('dashboard-resource-item__progress')[0].textContent).to.equal(
            'In progress',
        );
        expect(container.getElementsByTagName('a')[0].getAttribute('href')).to.equal('https://www.test.com');
    });
});
