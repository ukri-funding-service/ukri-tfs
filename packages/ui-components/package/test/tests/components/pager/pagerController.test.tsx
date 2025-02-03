import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { TfsPagerController } from '../../../../src/components/pager';

describe('<TfsPagerController /> component tests', () => {
    it('should return a pager controller with 15 pages from 5 to 10 with complete aria lables', () => {
        // given
        const props = {
            id: 'foo',
            currentPage: 7,
            totalPages: 15,
            pagesToShow: 7,
            getLink: (val: number) => `link?page=${val}`,
        };

        // when
        const component = render(<TfsPagerController {...props} />);
        // < 1 ... 6 [7] 8 ... 15 >

        // then
        // current page
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('7');
        expect(component.container.querySelector('.pager__list-current-link')?.getAttribute('aria-current')).to.equal(
            'page',
        );
        expect(component.container.querySelector('.pager__list-current-link')?.getAttribute('aria-label')).to.equal(
            'Page 7',
        );

        // prev button
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(1);
        expect(component.container.querySelector('.pager__prev')?.getAttribute('aria-label')).to.equal('Previous page');

        // next button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(1);
        expect(component.container.querySelector('.pager__next')?.getAttribute('aria-label')).to.equal('Next page');

        // ellipses
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(2);
        expect(
            component.container.querySelector('.pager__list-ellipses')?.closest('li')?.getAttribute('aria-hidden'),
        ).to.equal('true');
        expect(
            component.container.querySelector('.pager__list-ellipses')?.closest('li')?.getAttribute('role'),
        ).to.equal('presentation');
    });

    it('should return a pager controller with 5 pages from 1 to 5', () => {
        // given
        const props = {
            id: 'foo',
            currentPage: 2,
            totalPages: 5,
            pagesToShow: 5,
            getLink: (val: number) => `link?page=${val}`,
        };

        // when
        const component = render(<TfsPagerController {...props} />);
        // < 1 [2] 3 4 5 >

        // then
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('2'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(6); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(1); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(1); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(0); // ellipses
    });

    it('should return a pager controller with 10 pages from 1 to 10', () => {
        // given
        const props = {
            id: 'foo',
            currentPage: 5,
            totalPages: 10,
            pagesToShow: 10,
            getLink: (val: number) => `link?page=${val}`,
        };

        // when
        const component = render(<TfsPagerController {...props} />);
        // < 1 2 3 4 [5] 6 7 8 9 10 >

        // then
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('5'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(11); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(1); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(1); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(0); // ellipses
    });

    it('should return a pager controller with 5 pages from 1 to 10 with an ellipsis', () => {
        // given
        const props = {
            id: 'foo',
            currentPage: 5,
            totalPages: 10,
            pagesToShow: 5,
            getLink: (val: number) => `link?page=${val}`,
        };

        // when
        const component = render(<TfsPagerController {...props} />);
        // < 1 ... [5] ... 10 >

        // then
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('5'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(4); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(1); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(1); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(2); // ellipses
    });

    it('should return a pager controller with 10 pages from 1 to 50 with an ellipsis', () => {
        // given
        const props = {
            id: 'foo',
            currentPage: 50,
            totalPages: 50,
            pagesToShow: 10,
            getLink: (val: number) => `link?page=${val}`,
        };

        // when
        const component = render(<TfsPagerController {...props} />);
        // < 1 ... 43 44 45 46 47 48 49 [50]

        // then
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('50'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(9); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(1); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(0); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(1); // ellipses
    });

    it('should return a pager controller with 1 pages from 1 to 1', () => {
        // given
        const props = {
            id: 'foo',
            currentPage: 1,
            totalPages: 1,
            pagesToShow: 10,
            getLink: (val: number) => `link?page=${val}`,
        };

        // when
        const component = render(<TfsPagerController {...props} />);
        // [1]

        // then
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('1'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(0); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(0); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(0); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(0); // ellipses
    });

    it('should return a pager controller with 7 pages from 1 to 20 with an ellipsis', () => {
        // given
        const props = {
            id: 'foo',
            currentPage: 1,
            totalPages: 20,
            pagesToShow: 7,
            getLink: (val: number) => `link?page=${val}`,
        };

        // when
        const component = render(<TfsPagerController {...props} />);
        // [1] 2 3 4 5 ... 20 >

        // then
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('1'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(6); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(0); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(1); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(1); // ellipses
    });

    it('should return a pager controller with optional classes', () => {
        const props = {
            id: 'foo',
            currentPage: 1,
            totalPages: 20,
            pagesToShow: 7,
            getLink: (val: number) => `link?page=${val}`,
            className: 'test-class',
        };

        const component = render(<TfsPagerController {...props} />);

        expect(component.container.querySelector('.pager__controls.test-class')).to.not.be.null;
        expect(component.container.querySelector('.pager__list.test-class')).to.not.be.null;
    });
});
