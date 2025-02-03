import { ConfigurationValues, OptionalSchemaKeys, Schema, SchemaKeys } from '.';

export interface ConfigurationProvider<S extends Schema> {
    getConfigurationVariables: () => ConfigurationValues<S>;
    getConfigurationVariable: (variableName: SchemaKeys<S>) => string | undefined;
    getConfigurationVariableOrUndefined(variableName: OptionalSchemaKeys<S>): string | undefined;
}
