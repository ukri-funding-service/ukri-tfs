import { logScenario } from '../support/logging';

const beforeFunction = function (scenario) {
    this.scenarioFile = scenario.gherkinDocument.uri;
    this.scenarioName = scenario.pickle.name;
    logScenario(this.scenarioFile, this.scenarioName);
};

export { beforeFunction as beforeHook };
