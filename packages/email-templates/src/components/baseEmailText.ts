export const baseEmailText = {
    telephone: 'Telephone: +44 (0)1793 547 490',
    awardTelephone: 'Telephone: +44 (0)1793 867 121',
    email: 'Email: support@funding-service.ukri.org',
    awardEmail: 'Email: GrantsPostAward@funding.ukri.org',
    valuedSupport: 'We value your continued support.',
    noButton: `If the button does not work, use the link below or copy and paste it into your browser's address bar.`,
    signOff: 'Yours sincerely',
    fundingService: 'The UKRI Funding Service',
    automatedMessage: 'This is an automated message – do not reply.',
    getCouncilList: (councilList: string[]): string => `${councilList.join(', ')}, part of UK Research and Innovation`,
    getDearLine: (firstName: string, lastName: string): string => `Dear ${firstName} ${lastName},`,
};
