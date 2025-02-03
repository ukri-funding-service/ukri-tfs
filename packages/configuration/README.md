# Configuration

A package providing configuration

## Configuration

The configuration module is intended to be a dependency injectable module that can provide different services with the configuration that they require. The setup works as follows:

```javascript
const configuration = new Configuration(
    {
        someCanHaveVariable: 'some-variable', //non-critical variables
    },
    {
        someMustHaveVariable: 'some-other-variable', //critical variables
    },
    [dataSource],
);

const environmentVars = configuration.getConfigurationVariables();
//=>
// {
//     someCanHaveVariable: 'some-value',
//     someMustHaveVariable: 'some-other-value',
// };

OR;

const criticalVariable = config.getConfigurationVariable('someMustHaveVariable');
//=> some-other-value

OR;

const nonCriticalVariable = config.getConfigurationVariableOrUndefined('someCanHaveVariable');
//=> some-value || undefined
```

## Non-critical variables

These are variables that do not need to exist for your system to run. If they are not found in the data source then setup will continue successfully.

## Critical variables

These are variables that must exist for your system to run. If they are not found in the data source then setup throw an EnvironmentVariableUndefinedError.

## Data Source

This is any object of key string pairs

```javascript
{
    'some-variable': 'some-value',
    'some-other-variable': 'some-other-value'
}
```

This includes being able to use process.env as a data source.
The first data source is takes priority over any subsequent sources.
