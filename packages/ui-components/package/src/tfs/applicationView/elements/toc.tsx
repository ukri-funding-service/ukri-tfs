import React from 'react';
import cx from 'classnames';
import { TfsApplicationViewContent, TfsApplicationSection } from '../types/applicationViewContent';
import { isBrowser } from '../../../helpers';

type getSectionLinkId = (section: TfsApplicationSection) => string;

export interface TfsApplicationViewToCProps {
    id: string;
    className?: string;
    applicationContent: TfsApplicationViewContent;
    getSectionLinkId: getSectionLinkId;
}

export interface TfsApplicationViewToCState {
    stickNav: boolean;
    sectionScrollCount: number;
}

const getAbsoluteOffsetTop = (element: HTMLDivElement | HTMLElement): number => {
    const getParentOffsets = (el: HTMLDivElement | HTMLElement): number => {
        // getParentOffsets recursively returns the offsetTop of each parent until it reaches the top of the tree
        // Adding this to offsetTop value of an element gives us the absolute offsetTop of an element
        if (el.offsetParent && el.offsetParent instanceof HTMLDivElement) {
            return el.offsetParent.offsetTop + getParentOffsets(el.offsetParent);
        }
        return 0;
    };

    return element.offsetTop + getParentOffsets(element);
};

const printListener = (e: React.MouseEvent) => {
    window.print();
    e.preventDefault();
    return false;
};

export class TfsApplicationViewToC extends React.Component<TfsApplicationViewToCProps, TfsApplicationViewToCState> {
    private tocRef = React.createRef<HTMLDivElement>();
    private stickNavScrollOffset = 0;
    private sectionScrollOffsets: (number | null)[] = [];

    constructor(props: TfsApplicationViewToCProps) {
        super(props);
        this.state = { stickNav: false, sectionScrollCount: 0 };

        this.scrollListener = this.scrollListener.bind(this);
        this.setScrollOffsets = this.setScrollOffsets.bind(this);
    }

    scrollListener(): void {
        this.setScrollOffsets();

        const scrollTop = window.scrollY;

        let stickNav = false;

        if (scrollTop > this.stickNavScrollOffset) {
            stickNav = true;
        }

        // This is reducing the scroll offset numbers to the number of sections that we've scrolled past.
        const sectionScrollCount = this.sectionScrollOffsets.reduce<number>(
            (previousValue: number, currentValue: number | null) => {
                // currentValue is potentially null if the section's element cannot be found on the page.
                if (currentValue && scrollTop > currentValue) {
                    // We've scrolled past this section, so increment the sectionScrollCount so that the ToC can set the relevant number of links to 'active'.
                    return previousValue + 1;
                }
                return previousValue;
            },
            0,
        );

        const stickNavChanged = stickNav !== this.state.stickNav;
        const sectionScrollCountChanged = sectionScrollCount !== this.state.sectionScrollCount;

        if (stickNavChanged || sectionScrollCountChanged) {
            this.setState({ stickNav: stickNav, sectionScrollCount: sectionScrollCount });
        }
    }

    setScrollOffsets(): void {
        const { applicationContent, getSectionLinkId } = this.props;

        const toc = this.tocRef.current;
        if (toc) {
            this.stickNavScrollOffset = getAbsoluteOffsetTop(toc);
        }

        this.sectionScrollOffsets = applicationContent.sections.map(section => {
            const sectionId = getSectionLinkId(section);
            const sectionElement = document.getElementById(sectionId);

            if (sectionElement) {
                return getAbsoluteOffsetTop(sectionElement);
            }

            return null;
        });
    }

    componentDidMount(): void {
        if (isBrowser(process, window)) {
            this.setScrollOffsets();
            window.addEventListener('scroll', this.scrollListener);
        }
    }

    render(): React.ReactNode {
        const { applicationContent, className, id, getSectionLinkId } = this.props;
        const { stickNav, sectionScrollCount } = this.state;

        const formatSectionLink = (section: TfsApplicationSection, index: number) => {
            return (
                <li key={`tableOfContentsElement${index}`} className={cx('sticky-nav__item')}>
                    <a
                        href={`#${getSectionLinkId(section)}`}
                        className={cx('govuk-link', 'sticky-nav__link', {
                            'sticky-nav__link--active': sectionScrollCount > index,
                        })}
                    >
                        {index + 1}. {section.title ? section.title : 'Unknown'}
                    </a>
                </li>
            );
        };

        return (
            <div className={cx(className)} id={id} ref={this.tocRef}>
                <nav className={cx('sticky-nav', { 'sticky-nav--fixed': stickNav })}>
                    <div className={cx({ 'govuk-heading--fixed': stickNav })}>
                        <h2 className={cx('govuk-heading-s', 'govuk-heading--link')}>Contents</h2>
                    </div>
                    <ul className={cx('govuk-list', 'sticky-nav__list')}>
                        <li className={cx('sticky-nav__item')}>
                            <a href="#main-content" className={cx('govuk-link', 'sticky-nav__link')}>
                                Top of page
                            </a>
                        </li>
                        {applicationContent.sections.map((section, index) => formatSectionLink(section, index))}
                    </ul>
                    <div className={cx({ 'nav__link--print': stickNav })}>
                        <a
                            href="#"
                            className={cx('govuk-link', 'js-only', 'print-link')}
                            id="printThis"
                            onClick={printListener}
                        >
                            Print this page
                        </a>
                    </div>
                </nav>
            </div>
        );
    }
}
