import {
    DuplicateConfigKeyError,
    EnvironmentVariableUndefinedError,
    type ConfigurationProvider,
    type ConfigurationValues,
    type Datasource,
    type OptionalConfiguration,
    type RequiredConfiguration,
    type Schema,
    type SchemaKeys,
    type SchemaSpecification,
    OptionalSchemaKeys,
} from '..';

export class DatasourceConfigurationProvider<S extends Schema> implements ConfigurationProvider<S> {
    /**
     *
     * @param optionalVariables
     * @param requiredVariables
     * @param dataSource
     * @throws EnvironmentVariableUndefinedError
     * @throws DuplicateConfigKeyError
     */
    constructor(private readonly schema: SchemaSpecification<S>, private readonly dataSource: Datasource) {
        ensureRequiredEnvironmentVariablesExist2(this.schema, dataSource);
    }

    getConfigurationVariables(): ConfigurationValues<S> {
        const result = new Map<string, string | undefined>();

        for (const key of Object.keys(this.schema)) {
            if (this.dataSource.has(key)) {
                result.set(key, this.dataSource.get(key)!);
            }
        }

        return Object.fromEntries(result) as ConfigurationValues<S>;
    }

    getConfigurationVariable(variableName: SchemaKeys<S>): string {
        if (!this.dataSource.has(variableName)) {
            throw new EnvironmentVariableUndefinedError(`No value could be resolved for ${variableName}`);
        }

        return this.dataSource.get(variableName)!;
    }

    getConfigurationVariableOrUndefined(variableName: OptionalSchemaKeys<S>): string | undefined {
        return this.dataSource.get(variableName);
    }
}

/**
 *
 * @param requiredVariables
 * @param datasource
 * @throws {@link EnvironmentVariableUndefinedError}
 */
export const ensureRequiredEnvironmentVariablesExist2 = <S extends Schema>(
    spec: SchemaSpecification<S>,
    datasource: Datasource,
): void => {
    const missingVariables: string[] = [];

    for (const [key, value] of Object.entries(spec)) {
        if (value.isRequired && !datasource.has(key)) {
            missingVariables.push(key);
        }
    }

    const totalErrors = missingVariables.length;

    if (totalErrors === 1) {
        throw new EnvironmentVariableUndefinedError(`The configuration item ${missingVariables[0]} was undefined`);
    }

    if (totalErrors > 0) {
        const lastName = missingVariables.pop();
        const errorString = missingVariables.join(', ') + ` and ${lastName}`;
        throw new EnvironmentVariableUndefinedError(`The configuration items ${errorString} were undefined`);
    }
};

/**
 *
 * @param requiredVars
 * @param optionalVars
 * @throws {@link DuplicateConfigKeyError}
 */
export const detectDuplicates2 = (requiredKeys: Set<string>, optionalKeys: Set<string>): void => {
    const totalSize = requiredKeys.size + optionalKeys.size;
    const deduplicatedSize = new Set([...requiredKeys, ...optionalKeys]).size;

    if (deduplicatedSize !== totalSize) {
        throw new DuplicateConfigKeyError('Two or more variables have been defined with the same name.');
    }
};

export const buildRequiredConfiguration2 = <Required>(
    requiredKeys: Set<string>,
    datasource: Datasource,
): RequiredConfiguration<Required> => {
    let built: RequiredConfiguration<Required> = {} as RequiredConfiguration<Required>;

    requiredKeys.forEach(key => {
        built = {
            ...built,
            [key]: datasource.get(key),
        };
    });

    return built;
};

export const buildOptionalConfiguration2 = <Optional>(
    optionalKeys: Set<string>,
    datasource: Datasource,
): OptionalConfiguration<Optional> => {
    let built: OptionalConfiguration<Optional> = {} as OptionalConfiguration<Optional>;

    optionalKeys.forEach(key => {
        built = {
            ...built,
            [key]: datasource.get(key),
        };
    });

    return built;
};
