import { InvalidOptionsError } from './errors';
import * as drivers from './drivers';
import { SQLite, MySQL } from './drivers';
import { Drivers, Connection } from './types';

interface ArrayToHumanStringOptions {
    endingWord?: string;
    shouldWrap?: boolean;
    wrapper?: string;
}

const arrayToHumanString = (array: string[], options?: ArrayToHumanStringOptions) => {
    const items = options?.shouldWrap ? array.map(item => `${options.wrapper}${item}${options.wrapper}`) : array;
    return [items.slice(0, -1).join(', '), items.slice(-1)[0]].join(items.length < 2 ? '' : ` ${options?.endingWord ?? 'and'} `);
};

interface Options {
    connections: Connection[];
}

export function createDatabase<Tables>(driver: 'SQLite', options: Options): Drivers<Tables>['SQLite'];
export function createDatabase<Tables>(driver: 'MySQL', options: Options): Drivers<Tables>['MySQL'];
export function createDatabase<Tables>(driver: keyof Drivers<Tables>, options: Options) {
    if (!options) {
        throw new InvalidOptionsError('"options" is required.');
    }
    if ((options.connections || []).length === 0) {
        throw new InvalidOptionsError('"options.connections" requires at least one connection.');
    }
    if (!(String(driver) || '').trim()) {
        const allowedDrivers = arrayToHumanString(Object.keys(drivers), { endingWord: 'or' });
        throw new InvalidOptionsError(`"driver" needs to be ${allowedDrivers}.`);
    }

    if (driver === 'SQLite') {
        return new SQLite<Tables>(options);
    }

    if (driver === 'MySQL') {
        return new MySQL<Tables>(options);
    }
}