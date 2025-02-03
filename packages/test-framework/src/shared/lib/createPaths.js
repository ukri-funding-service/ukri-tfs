'use strict';

const path = require('path');

let serviceVariables;
switch (process.env.SERVICE) {
    case 'admin-services':
        serviceVariables = 'AdminServicesRestVariables';
        break;
    case 'application-manager':
        serviceVariables = 'ApplicationManagerRestVariables';
        break;
    case 'conflict-service-api':
        serviceVariables = '';
        break;
    case 'decision-service-api':
        serviceVariables = '';
        break;
    case 'opportunity-manager':
        serviceVariables = 'OpportunityManagerRestVariables';
        break;
    case 'expert-review-manager':
        serviceVariables = 'ExpertReviewManagerRestVariables';
        break;
    case 'invite-service':
        serviceVariables = 'InviteServiceRestVariables';
        break;
    case 'file-management-service':
        serviceVariables = 'FileManagementServiceRestVariables';
        break;
    case 'ui':
        serviceVariables = '';
        break;
    case 'end-to-end-tests':
        serviceVariables = '';
        break;
    default:
        throw new Error(`Unknown service '${process.env.SERVICE}' (from 'SERVICE' env var)`);
}

export const createPaths = () => {
    const root = path.join(__dirname, '../../../../../');
    const frameworkRoot = path.join(__dirname, '../../');
    const serviceRoot = path.join(root, `services/${process.env.SERVICE}`);
    const testRoot = path.join(serviceRoot, 'tests');
    const paths = {
        root,
        allureReport: path.join(testRoot, '_results_/allure-raw'),
        nodeModules: path.join(root, 'node_modules'),
        framework: {
            api: {
                hooks: path.join(frameworkRoot, 'API/support/hooks.js'),
                serviceVariables: path.join(frameworkRoot, `API/support/queries/${serviceVariables}`),
                steps:
                    process.env.SERVICE === 'opportunity-manager' ? undefined : path.join(frameworkRoot, 'API/steps'),
            },
            data: path.join(frameworkRoot, 'shared/data'),
            nodeModules: path.join(frameworkRoot, '../node_modules'),
            root: frameworkRoot,
            scripts: path.join(frameworkRoot, 'scripts'),
            ui: {
                config: path.join(frameworkRoot, 'UI/config'),
                hooks: path.join(frameworkRoot, 'UI/support/hooks.js'),
                locators: path.join(frameworkRoot, 'UI/helpers/locators'),
                steps: `${path.join(frameworkRoot, 'UI/steps')}/**/*.js`,
            },
        },
        service: {
            nodeModules: path.join(serviceRoot, 'node_modules'),
            api: {
                env: path.join(serviceRoot, 'api/.env'),
            },
            app: {
                env: path.join(serviceRoot, 'app/.env'),
            },
        },
        test: {
            root: testRoot,
            api: {
                features: path.join(testRoot, 'API/features'),
                output: {
                    logs: path.join(testRoot, 'API/output/logs'),
                    reports: path.join(testRoot, 'API/output/reports'),
                },
                steps: path.join(testRoot, 'API/steps'),
            },
            apiMocks: path.join(testRoot, 'ApiMocks'),
            ui: {
                features: `${path.join(testRoot, 'UI/features')}/**/*.feature`,
                locators: path.join(testRoot, 'UI/helpers/locators'),
                output: {
                    accessibility: path.join(testRoot, 'UI/output/accessibility'),
                    imageComparison: {
                        actual: path.join(testRoot, 'UI/output/imageComparison/actual'),
                        baseline: path.join(testRoot, 'UI/output/imageComparison/baseline'),
                        diff: path.join(testRoot, 'UI/output/imageComparison/diff'),
                        screenshot: path.join(testRoot, 'UI/output/imageComparison'),
                    },
                    junit: path.join(testRoot, 'UI/output/junit'),
                    logs: path.join(testRoot, 'UI/output/logs'),
                    pdf: path.join(testRoot, 'UI/output/pdf'),
                    reports: path.join(testRoot, 'UI/output/reports'),
                    selenium: path.join(testRoot, 'UI/output/selenium'),
                    screenshots: path.join(testRoot, 'UI/output/screenshots'),
                    webdriverio: path.join(testRoot, 'UI/output/webdriverio'),
                },
                steps: `${path.join(testRoot, 'UI/steps')}/*.js`,
                support: {
                    pdf: path.join(testRoot, 'UI/support/pdf'),
                },
            },
        },
    };

    return paths;
};
