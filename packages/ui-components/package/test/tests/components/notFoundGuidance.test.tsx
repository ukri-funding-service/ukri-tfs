import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { expect } from 'chai';
import { NotFoundGuidance } from '../../../src/components/notFoundGuidance';

describe('NotFoundGuidance', () => {
    const summaryLine = 'I need help finding an organisation';
    const itemType = 'organisation';
    const itemListDescription = 'co-funders';
    const linkName = 'support-email';

    const renderComponent = (options: {
        summaryLine?: string;
        itemType?: string;
        itemListDescription?: string;
        mailToConfig?: {
            subject?: string;
            body?: string;
            recipientAddress?: string;
        };
        jsEnabled?: boolean;
    }) => {
        return render(
            <NotFoundGuidance
                jsEnabled={options.jsEnabled ?? true}
                summaryLine={options.summaryLine ?? 'TEST_SUMMARY_LINE'}
                itemType={options.itemType ?? 'TEST_ITEM_TYPE'}
                itemListDescription={options.itemListDescription ?? 'TEST_ITEM_LIST_DESCRIPTION'}
                mailToConfig={{
                    subject: options.mailToConfig?.subject,
                    body: options.mailToConfig?.body,
                    recipientAddress: options.mailToConfig?.recipientAddress,
                }}
            />,
        );
    };

    [true, false].forEach(jsEnabled => {
        it(`should render component with provided props when js is ${jsEnabled ? 'enabled' : 'disabled'}`, () => {
            const defaultRecipientAddress = 'support@funding-service.ukri.org';

            const { container } = renderComponent({
                jsEnabled: jsEnabled,
                summaryLine: summaryLine,
                itemType: itemType,
                itemListDescription: itemListDescription,
            });

            screen.getByText(summaryLine);

            const paragraphs = container.getElementsByClassName('govuk-body');
            expect(paragraphs.length).to.equal(2);

            const leadParagraph = paragraphs[0] as HTMLElement;
            const linkParagraph = paragraphs[1] as HTMLElement;

            within(leadParagraph).getByText(itemType, { exact: false });
            within(linkParagraph).getByText(itemType, { exact: false });
            within(linkParagraph).getByText(itemListDescription, { exact: false });

            const link = screen.getByRole('link', { name: linkName });
            expect(link?.textContent).to.equal(defaultRecipientAddress);
            expect(link?.getAttribute('href')).to.equal(`mailto:${defaultRecipientAddress}`);
        });
    });

    it('should set subject on mailto link if provided', () => {
        const subject = 'test subject';
        const encodedSubject = 'test%20subject';

        renderComponent({
            mailToConfig: { subject },
        });

        const mailToLink = screen.getByRole('link', { name: linkName });
        expect(mailToLink.getAttribute('href')).to.contains(`subject=${encodedSubject}`);
    });

    it('should set body on mailto link if provided', () => {
        const body = `first line
second line`;

        const encodedBody = 'first%20line%0Asecond%20line';

        renderComponent({
            mailToConfig: { body },
        });

        const mailToLink = screen.getByRole('link', { name: linkName });
        expect(mailToLink.getAttribute('href')).to.contains(`body=${encodedBody}`);
    });

    it('should override the recipient email address', () => {
        const recipientAddress = 'example@example.com';

        renderComponent({
            mailToConfig: { recipientAddress },
        });

        const mailToLink = screen.getByRole('link', { name: linkName });
        expect(mailToLink.getAttribute('href')).to.match(/^mailto:example@example.com/);
    });
});
