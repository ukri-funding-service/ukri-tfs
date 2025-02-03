export type SchemaItem = { isRequired: boolean };

export type Schema = { [k: string]: string | undefined };
export type SchemaSpecification<S extends Schema> = { [x in keyof S]: SchemaItem };

export type OptionalPropertyOf<T extends Schema> = Exclude<
    {
        [K in keyof T]: T extends Record<K, T[K]> ? never : K;
    }[keyof T],
    undefined
>;

export type RequiredPropertyOf<T extends Schema> = Exclude<
    {
        [K in keyof T]: T extends Record<K, T[K]> ? K : never;
    }[keyof T],
    undefined
>;

export type Optional<S extends Schema> = Pick<S, OptionalPropertyOf<S>>;
export type Required<S extends Schema> = Pick<S, RequiredPropertyOf<S>>;

export type ConfigurationValues<S extends Schema> = Optional<S> & Required<S>;

export type SchemaKeys<S extends Schema> = Exclude<keyof S, number | symbol>;
export type OptionalSchemaKeys<S extends Schema> = Exclude<OptionalPropertyOf<S>, number | symbol>;
