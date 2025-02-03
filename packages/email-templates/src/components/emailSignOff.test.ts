import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { generateEmailSignOffHtml, generateEmailSignOffText } from './emailSignOff';
import * as generateEmailParagraphMock from './emailParagraph';

describe('Email components - emailSignOff', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('generateEmailSignOffHtml', () => {
        it('should generate a HTML sign off', async () => {
            const generateEmailParagraphSpy = jest
                .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
                .mockReturnValue('');

            generateEmailSignOffHtml();

            expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(5);
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(1, 'Yours sincerely,');
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(2, 'The UKRI Funding Service', 'noMargin');
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                3,
                'Email: support@funding-service.ukri.org',
                'noMargin',
            );
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(4, 'Telephone: +44 (0)1793 547 490', 'noMargin');
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                5,
                'This is an automated message – do not reply.',
            );
        });

        it('should generate a HTML sign off using specific sign off', async () => {
            const generateEmailParagraphSpy = jest
                .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
                .mockReturnValue('');

            generateEmailSignOffHtml({ signOffText: 'Kind regards' });

            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(1, 'Kind regards,');
        });

        it('should generate a HTML sign off using specific email section', async () => {
            const generateEmailParagraphSpy = jest
                .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
                .mockReturnValue('');

            generateEmailSignOffHtml({ email: 'Email: EMAIL@ADDRESS.COM' });

            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(3, 'Email: EMAIL@ADDRESS.COM', 'noMargin');
        });

        it('should generate a HTML sign off using specific telephone section', async () => {
            const generateEmailParagraphSpy = jest
                .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
                .mockReturnValue('');

            generateEmailSignOffHtml({ telephone: 'Telephone: 123-456-7890' });

            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(4, 'Telephone: 123-456-7890', 'noMargin');
        });
    });

    describe('generateEmailSignOffText', () => {
        it('should generate a text sign off', async () => {
            const signOffHtml = generateEmailSignOffText();

            expect(signOffHtml).toContain('Yours sincerely,');
            expect(signOffHtml).toContain('The UKRI Funding Service');
            expect(signOffHtml).toContain('Email: support@funding-service.ukri.org');
            expect(signOffHtml).toContain('Telephone: +44 (0)1793 547 490');
            expect(signOffHtml).toContain('This is an automated message – do not reply.');
        });

        it('should generate a text sign off using specific sign off', async () => {
            const signOffHtml = generateEmailSignOffText({ signOffText: 'Kind regards' });

            expect(signOffHtml).toContain('Kind regards,');
        });

        it('should generate a text sign off using specific email section', async () => {
            const signOffHtml = generateEmailSignOffText({ email: 'Email: EMAIL@ADDRESS.COM' });

            expect(signOffHtml).toContain('Email: EMAIL@ADDRESS.COM');
        });

        it('should generate a text sign off using specific telephone section', async () => {
            const signOffHtml = generateEmailSignOffText({ telephone: 'Telephone: 123-456-7890' });

            expect(signOffHtml).toContain('Telephone: 123-456-7890');
        });
    });
});
