import type { Datasource } from './datasource';

export type OptionalConfiguration<O> = { readonly [key in keyof O]?: string };
export type RequiredConfiguration<R> = { readonly [key in keyof R]: string };

export type CombinedConfiguration<Optional, Required> = OptionalConfiguration<Optional> &
    RequiredConfiguration<Required>;

export type VariableSet<T> = {
    [key in keyof T]: string;
};

export interface IConfiguration<Optional, Required> {
    getConfigurationVariables: () => CombinedConfiguration<Optional, Required>;
    getConfigurationVariable: <Variable extends keyof Required>(
        variableName: Variable,
    ) => CombinedConfiguration<Optional, Required>[Variable];
    getConfigurationVariableOrUndefined: <Variable extends keyof Optional>(
        variableName: Variable,
    ) => CombinedConfiguration<Optional, Required>[Variable];
}

export class Configuration<Optional, Required> implements IConfiguration<Optional, Required> {
    private readonly combinedConfiguration: CombinedConfiguration<Optional, Required>;

    /**
     *
     * @param optionalVariables
     * @param requiredVariables
     * @param dataSource
     * @throws EnvironmentVariableUndefinedError
     * @throws DuplicateConfigKeyError
     */
    constructor(
        readonly optionalVariables: VariableSet<Optional>,
        readonly requiredVariables: VariableSet<Required>,
        readonly dataSource: Datasource,
    ) {
        detectDuplicates(requiredVariables, optionalVariables);
        ensureRequiredEnvironmentVariablesExist(requiredVariables, dataSource);

        this.combinedConfiguration = {
            ...buildConfiguration(optionalVariables, dataSource),
            ...buildConfiguration(requiredVariables, dataSource),
        };
    }

    getConfigurationVariables(): CombinedConfiguration<Optional, Required> {
        return this.combinedConfiguration;
    }

    getConfigurationVariable<Variable extends keyof Required>(
        variableName: Variable,
    ): CombinedConfiguration<Optional, Required>[Variable] {
        return this.combinedConfiguration[variableName];
    }

    getConfigurationVariableOrUndefined<Variable extends keyof Optional>(
        variableName: Variable,
    ): CombinedConfiguration<Optional, Required>[Variable] {
        return this.combinedConfiguration[variableName];
    }
}

/**
 *
 * @param requiredVariables
 * @param datasource
 * @throws {@link EnvironmentVariableUndefinedError}
 */
export const ensureRequiredEnvironmentVariablesExist = <Required>(
    requiredVariables: VariableSet<Required>,
    datasource: Datasource,
): void => {
    const missingVariables: string[] = [];

    for (const objectValue of Object.values(requiredVariables)) {
        const criticalEntry = objectValue as string;

        if (!datasource.has(criticalEntry)) {
            missingVariables.push(criticalEntry);
        }
    }

    const totalErrors = missingVariables.length;

    if (totalErrors === 1) {
        throw new EnvironmentVariableUndefinedError(`The environment variable ${missingVariables[0]} was undefined`);
    }

    if (totalErrors > 0) {
        const lastName = missingVariables.pop();
        const errorString = missingVariables.join(', ') + ` and ${lastName}`;
        throw new EnvironmentVariableUndefinedError(`The environment variables ${errorString} were undefined`);
    }
};

/**
 *
 * @param requiredVars
 * @param optionalVars
 * @throws {@link DuplicateConfigKeyError}
 */
export const detectDuplicates = <Required, Optional>(
    requiredVars: VariableSet<Required>,
    optionalVars: VariableSet<Optional>,
): void => {
    const requiredKeys = Object.keys(requiredVars);
    const optionalKeys = Object.keys(optionalVars);

    const totalSize = requiredKeys.length + optionalKeys.length;
    const deduplicatedSize = new Set([...requiredKeys, ...optionalKeys]).size;

    if (deduplicatedSize !== totalSize) {
        throw new DuplicateConfigKeyError('Two or more variables have been defined with the same name.');
    }
};

export const buildConfiguration = <T, ConfigType extends OptionalConfiguration<T> | RequiredConfiguration<T>>(
    variables: VariableSet<T>,
    datasource: Datasource,
): ConfigType => {
    let built: ConfigType = {} as ConfigType;

    Object.entries(variables).forEach(([userGivenName, entry]) => {
        const variableName = entry as string;

        built = {
            ...built,
            [userGivenName]: datasource.get(variableName),
        };
    });

    return built;
};

export class EnvironmentVariableUndefinedError extends Error {}
export class DuplicateConfigKeyError extends Error {}
