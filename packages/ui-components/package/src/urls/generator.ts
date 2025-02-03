import { OptionalKeyValue, Path } from './urls';

export const generate = <T extends {}>(path: Path<T>, args?: T, queryArgs?: OptionalKeyValue): string => {
    return path.generate(args, queryArgs);
};
