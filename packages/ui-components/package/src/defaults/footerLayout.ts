import { FooterSectionProps } from '../components/footer';
import { FooterLogos } from '../defaults/footerLogos';

export const defaultFooterSections: FooterSectionProps[] = [
    {
        heading: 'Help',
        widthClass: 'is-one-third',
        footerLinks: [
            {
                id: 'accessibilityFooterLink',
                text: 'Accessibility',
                url: 'https://www.ukri.org/accessibility/ukri-funding-service-accessibility-statement/',
                isActive: true,
                opensInNewTab: false,
            },
            {
                id: 'cookiesPolicyFooterLink',
                text: 'Cookies policy',
                url: 'https://www.ukri.org/cookie-policy',
                isActive: true,
                opensInNewTab: false,
            },
            {
                id: 'privacyPolicyFooterLink',
                text: 'Privacy policy',
                url: 'https://www.ukri.org/privacy-notice',
                isActive: true,
                opensInNewTab: false,
            },
            {
                id: 'termsAndConditionsFooterLink',
                text: 'Terms of use',
                url: 'https://www.ukri.org/about-us/terms-of-use/',
                isActive: true,
                opensInNewTab: false,
            },
        ],
    },
    {
        heading: 'About UKRI',
        widthClass: 'is-one-third',
        footerLinks: [
            {
                id: 'whatWeDoFooterLink',
                text: 'What we do',
                url: 'https://www.ukri.org/about-us',
                isActive: true,
                opensInNewTab: false,
            },
            {
                id: 'careersFooterLink',
                text: 'Careers',
                url: 'https://www.ukri.org/who-we-are/work-for-us/',
                isActive: true,
                opensInNewTab: false,
            },
            {
                id: 'contactUsFooterLink',
                text: 'Contact us',
                url: 'https://www.ukri.org/who-we-are/contact-us/',
                isActive: true,
                opensInNewTab: false,
            },
            {
                id: 'newsFooterLink',
                text: 'News',
                url: 'https://www.ukri.org/news',
                isActive: true,
                opensInNewTab: false,
            },
            {
                id: 'freedomOfInformationFooterLink',
                text: 'Freedom of information',
                url: 'https://www.ukri.org/who-we-are/contact-us/freedom-of-information-request/',
                isActive: true,
                opensInNewTab: false,
            },
        ],
    },
    {
        heading: 'Connect with us',
        widthClass: 'is-one-third',
        footerLinks: [
            {
                id: 'twitterFooterLink',
                text: 'UKRI Twitter',
                url: 'https://twitter.com/UKRI_News',
                isActive: true,
                opensInNewTab: false,
                logo: FooterLogos.Twitter,
            },
            {
                id: 'linkedInFooterLink',
                text: 'LinkedIn',
                url: 'https://www.linkedin.com/company/uk-research-and-innovation',
                isActive: true,
                opensInNewTab: false,
                logo: FooterLogos.LinkedIn,
            },
            {
                id: 'youTubeFooterLink',
                text: 'UKRI YouTube',
                url: 'https://www.youtube.com/channel/UCkf0YxotdFTrxDKcfTV5tiA',
                isActive: true,
                opensInNewTab: false,
                logo: FooterLogos.YouTube,
            },
        ],
    },
];
