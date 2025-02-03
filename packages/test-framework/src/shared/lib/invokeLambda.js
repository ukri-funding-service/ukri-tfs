'use strict';

const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const lambda = new LambdaClient({ region: 'eu-west-2' });

const lambdaList = require('../data/serviceLambdas.json');

export const invokeLambda = async (lambdaCleanName) => {
    let lambdaToUse = lambdaList.find((l) => l.cleanName === lambdaCleanName);

    if (!lambdaToUse) {
        throw new Error('Lambda not found in list');
    }

    let env = process.env.TEST_ENV || 'test-1';

    lambdaToUse.realName = env.toLowerCase().concat('_', lambdaToUse.realName);

    try {
        await lambda.send(
            new InvokeCommand({
                FunctionName: lambdaToUse.realName,
                InvocationType: 'RequestResponse',
                LogType: 'Tail',
            }),
        );

        // eslint-disable-next-line no-console
        console.log(`${lambdaToUse.realName} Invoked Successfully`);
    } catch (err) {
        const errorString = err.toString();
        const dataString = data.toString();
        console.error('\n\n');
        console.error({ errorString });
        console.error({ dataString });
        console.error('\n\n');
        throw new Error(errorString);
    }
};
