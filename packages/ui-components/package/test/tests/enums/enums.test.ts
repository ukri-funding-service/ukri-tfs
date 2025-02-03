import { expect } from 'chai';
import {
    ApplicationDisplayStatus,
    ApplicationFilterStatus,
    ApplicationStatus,
    ApplicationStatusEnum,
    getApplicationDisplayStatusTint,
    mapFilterStatusToDisplayStatus,
} from '../../../src/enums/enums';
import { Colour } from '../../../src';

describe('Enums', () => {
    describe('getApplicationDisplayStatusTint', () => {
        it('Should return yellow when the status is withApplicant', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.withApplicant;
            const expectedColour: Colour = 'YELLOW';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, '' as ApplicationStatus);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return blue when the status is withResearchOffice', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.withResearchOffice;
            const expectedColour: Colour = 'BLUE';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, '' as ApplicationStatus);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return green when the status is submitted', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.submitted;
            const expectedColour: Colour = 'GREEN';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, '' as ApplicationStatus);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return purple when the status is passedChecks', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.passedChecks;
            const expectedColour: Colour = 'PURPLE';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, '' as ApplicationStatus);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return red when the status is failedChecks', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.failedChecks;
            const expectedColour: Colour = 'RED';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, ApplicationStatusEnum.FailedChecks);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return grey when the status is unsuccessfulChecks', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.unsuccessfulChecks;
            const expectedColour: Colour = 'GREY';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, ApplicationStatusEnum.UnsuccessfulChecks);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return blue when the status is pendingChecks', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.pendingChecks;
            const expectedColour: Colour = 'BLUE';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, '' as ApplicationStatus);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return grey when the status is unsubmitted', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.unsubmitted;
            const expectedColour: Colour = 'GREY';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, '' as ApplicationStatus);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return grey when the status is successful', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.successful;
            const expectedColour: Colour = 'GREY';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, '' as ApplicationStatus);

            // then
            expect(result).to.eq(expectedColour);
        });

        it('Should return grey when the status is unsuccessful', () => {
            // given
            const displayStatus = ApplicationDisplayStatus.unsuccessful;
            const expectedColour: Colour = 'GREY';

            // when
            const result = getApplicationDisplayStatusTint(displayStatus, '' as ApplicationStatus);

            // then
            expect(result).to.eq(expectedColour);
        });
    });

    describe('mapFilterStatusToDisplayStatus', () => {
        const displayStatusMappings = [
            {
                from: ApplicationFilterStatus.WithApplicant,
                to: [ApplicationStatusEnum.Draft, ApplicationStatusEnum.ReturnToApplicant],
            },
            {
                from: ApplicationFilterStatus.WithResearchOffice,
                to: [ApplicationStatusEnum.SentToResearchOffice],
            },
            {
                from: ApplicationFilterStatus.Submitted,
                to: [ApplicationStatusEnum.Submitted],
            },
            {
                from: ApplicationFilterStatus.MissedDeadline,
                to: [ApplicationStatusEnum.NotSubmitted],
            },
            {
                from: ApplicationFilterStatus.PendingChecks,
                to: [ApplicationStatusEnum.Submitted],
            },
            {
                from: ApplicationFilterStatus.PassedChecks,
                to: [ApplicationStatusEnum.PassedChecks],
            },
            {
                from: ApplicationFilterStatus.FailedChecks,
                to: [ApplicationStatusEnum.FailedChecks],
            },
            {
                from: ApplicationFilterStatus.UnsuccessfulChecks,
                to: [ApplicationStatusEnum.UnsuccessfulChecks],
            },
            {
                from: ApplicationFilterStatus.AwaitingAssessment,
                to: [ApplicationStatusEnum.AwaitingAssessment],
            },
            {
                from: ApplicationFilterStatus.Unsubmitted,
                to: [ApplicationStatusEnum.NotSubmitted],
            },
            {
                from: ApplicationFilterStatus.Successful,
                to: [ApplicationStatusEnum.Successful],
            },
            {
                from: ApplicationFilterStatus.Unsuccessful,
                to: [ApplicationStatusEnum.Unsuccessful],
            },
        ];

        displayStatusMappings.forEach(({ from, to }) => {
            it(`should map ${from} to [${to}]`, () => {
                expect(mapFilterStatusToDisplayStatus(from)).to.eql(to);
            });
        });
    });
});
