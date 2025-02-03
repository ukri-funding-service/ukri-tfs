import React from 'react';
import { defaultFooterSections } from '../defaults/footerLayout';
import { FooterLogos } from '../defaults/footerLogos';
import cx from 'classnames';

export interface FooterLinkProps {
    id: string;
    text: string;
    url: string;
    isActive: boolean;
    opensInNewTab: boolean;
    logo?: FooterLogos;
}

export interface FooterSectionProps {
    heading: string;
    widthClass: string;
    footerLinks: FooterLinkProps[];
}

export interface FooterProps {
    footerSections?: FooterSectionProps[];
}

export const FooterLink: React.FunctionComponent<FooterLinkProps> = ({
    id,
    text,
    url,
    isActive,
    opensInNewTab,
    logo,
}: FooterLinkProps): JSX.Element => {
    const svgClass = logo ? `govuk-footer__link--logo` : '';
    const backgroundImageStyle = logo ? { backgroundImage: `url(${logo})` } : {};
    const linkClass = cx('govuk-footer__link', svgClass);
    return isActive ? (
        <li className="govuk-footer__list-item">
            {opensInNewTab ? (
                <a
                    id={id}
                    className={linkClass}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={backgroundImageStyle}
                >
                    {text}
                </a>
            ) : (
                <a id={id} className={linkClass} href={url} style={backgroundImageStyle}>
                    {text}
                </a>
            )}
        </li>
    ) : (
        <React.Fragment />
    );
};

export const FooterSection: React.FunctionComponent<FooterSectionProps> = ({
    heading,
    widthClass,
    footerLinks,
}: FooterSectionProps): JSX.Element => {
    return (
        <div className={cx('column', widthClass)}>
            <h2 className="govuk-heading-m">{heading}</h2>
            <ul className="govuk-footer__list">
                {footerLinks.map((footerLink, idx) => {
                    return <FooterLink key={`footerLink_${idx}`} {...footerLink} />;
                })}
            </ul>
        </div>
    );
};

export const Footer: React.FunctionComponent<FooterProps> = ({
    footerSections = defaultFooterSections,
}): JSX.Element => {
    return (
        <footer className="govuk-footer tfs-footer" role="contentinfo">
            <div className="container">
                <div className="columns">
                    {footerSections.map((footerSection, idx) => {
                        return <FooterSection key={`footerSection_${idx}`} {...footerSection} />;
                    })}
                </div>
            </div>
            <div className="container">
                <div className="columns">
                    <div className="column">
                        <hr className="govuk-footer__section-break" />
                        <p className="govuk-body govuk-body-xs">Copyright UKRI 2020 ©</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
