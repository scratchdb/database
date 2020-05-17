import test from 'ava';
import tempy from 'tempy';
import { createDatabase } from '..';
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
        /**
         * The unique ID.
         */
        id: string;
    }

    interface Episode extends Row {
        showId: string;
        /**
         * Where this episode can be found.
         */
        location: string;
        /**
         * Which episode this is.
         */
        episodeNumber: number;
        /**
         * Which season this episode is in.
         * Season "0" is used for specials in "western" mode.
         */
        seasonNumber: number;
        videoCodec: string;
        videoContainer: string;
        releaseGroup: string;
        mimeType: string;
        format: string;
    }

    // Database
    type Tables = {
        episodes: Episode;
    };

    t.notThrows(() => {
        const database = createDatabase<Tables>('SQLite', {
            connections: [{
                uri: tempy.file()
            }]
        });
    });
})