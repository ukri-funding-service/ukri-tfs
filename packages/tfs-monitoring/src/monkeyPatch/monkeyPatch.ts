import newrelic from 'newrelic';

/**
 * Instrument a particular async method to improve visibility into a transaction
 *
 * THIS PATCH SHOULD BE REMOVED AS SOON AS THE PROBLEM AREA HAS BEEN RECTIFIED
 *
 * description defines a name for the segment. This name will be visible in transaction traces
 * in the New Relic UI.
 *
 * fn is the function you want to track as a segment.
 *
 * The agent begins timing the segment when startSegment is called.
 * The segment's ending will be tied to that promise resolving or rejecting.
 */
export const patchAsyncFunction = <T>(patchName: string, functionToBePatched: () => Promise<T>): Promise<T> => {
    return newrelic.startSegment(patchName, false, functionToBePatched);
};
