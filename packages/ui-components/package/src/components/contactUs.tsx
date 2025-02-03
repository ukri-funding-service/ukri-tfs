import React from 'react';

interface ContactUsProps {
    jsEnabled: boolean;
    phoneNumberLink: string;
    phoneNumberDisplayText: string;
    preLinkText?: string;
    postLinkText?: string;
    linkText?: string;
}

interface ContactUsState {
    expanded: boolean;
}

export class ContactUs extends React.Component<ContactUsProps, ContactUsState> {
    constructor(props: ContactUsProps) {
        super(props);
        this.toggleExpand = this.toggleExpand.bind(this);
        this.state = { expanded: false };
    }

    private toggleExpand() {
        this.setState({ expanded: !this.state.expanded });
    }

    render(): React.ReactElement {
        const jsEnabledClass = this.props.jsEnabled ? 'js-enabled' : '';
        const expanded = this.props.jsEnabled ? this.state.expanded : false;
        const insetDivStyle = expanded ? 'service-help__text' : 'service-help__text js-hidden';

        return (
            <div id="contact-us" className={jsEnabledClass}>
                <div className="service-help u-space-b20 u-space-t30">
                    <h2 id="contact-us-h2" className="govuk-heading-s service-help__heading">
                        <span className="service-help__plain">
                            {this.props.preLinkText ? this.props.preLinkText : `Need help with this service?`}
                        </span>
                        &nbsp;
                        <button
                            id="contact-us-button"
                            className="govuk-button--link contact-us-link service-help__link js-only"
                            onClick={this.toggleExpand}
                            tabIndex={0}
                        >
                            {this.props.linkText ? this.props.linkText : `Contact us`}
                        </button>
                        <span className="service-help__plain">
                            {this.props.postLinkText && ` ${this.props.postLinkText}`}
                        </span>
                    </h2>
                    <div className={insetDivStyle}>
                        <p id="contact-us-email-p" className="govuk-body">
                            You can either email us:{' '}
                            <a href="mailto:support@funding-service.ukri.org" className="govuk-link">
                                support@funding-service.ukri.org
                            </a>
                        </p>
                        <p id="contact-us-phone-p" className="govuk-body">
                            Or call the UKRI Funding Service Helpline:{' '}
                            <a href={`tel: ${this.props.phoneNumberLink}`} className="govuk-link">
                                {this.props.phoneNumberDisplayText}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
