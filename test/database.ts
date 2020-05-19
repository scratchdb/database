import test from 'ava';
import tempy from 'tempy';
import { createDatabase } from '../index';
import { InvalidOptionsError } from '../lib/errors';

test('invalid options', t => {
    t.throws(() => {
        // @ts-expect-error
        const database = createDatabase();
    }, {
        instanceOf: InvalidOptionsError,
        message: '"options" is required.',
        name: 'InvalidOptionsError'
    });

    t.throws(() => {
        // @ts-expect-error
        const database = createDatabase('SQLite', {});
    }, {
        instanceOf: InvalidOptionsError,
        message: '"options.connections" requires at least one connection.',
        name: 'InvalidOptionsError'
    });

    t.throws(() => {
        const database = createDatabase('SQLite', {
            connections: [{
                uri: ''
            }]
        });
    }, {
        instanceOf: InvalidOptionsError,
        message: '"options.uri" is empty.',
        name: 'InvalidOptionsError'
    });
});

test('valid options', t => {
    t.notThrows(() => {
        const database = createDatabase('SQLite', {
            connections: [{
                uri: tempy.writeSync('')
            }]
        });
    });

    t.notThrows(() => {
        const database = createDatabase('SQLite', {
            connections: [{
                uri: tempy.file()
            }]
        });
    });
});

test('accepts types', t => {
    type Row = {
        id: string;
    }

    interface Episode extends Row {
        paused: boolean;
    }

    interface Tables {
        episodes: Episode;
    }

    type ExtendPrototype<Prototype, NewFields> = NewFields & Omit<Prototype, keyof NewFields>;

    interface SerialisedTables {
        episodes: ExtendPrototype<Episode, {
            paused: number;
        }>;
    };

    t.notThrows(() => {
        const database = createDatabase<SerialisedTables, Tables>('SQLite', {
            connections: [{
                uri: tempy.file()
            }]
        });
    });
});