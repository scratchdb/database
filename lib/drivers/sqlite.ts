import fs from 'fs';
import BetterSqlite3 from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import mapObject from 'map-obj';
import { Driver, DriverOptions } from './driver';
import { InvalidOptionsError } from '../errors';
import { DatabaseInsert } from '../types';

export interface SQLiteOptions extends DriverOptions {
    initialise: (connection: BetterSqlite3.Database) => void;
}

const isObject = (value: unknown): value is { [key: string]: { comparator: string, value: any } } => {
    return typeof value === 'object' && typeof value !== null;
};

export class SQLite<Tables> extends Driver {
    connection: BetterSqlite3.Database;

    constructor(options: SQLiteOptions) {
        super(options);

        if (options.connections.length >= 2) {
            throw new InvalidOptionsError('"options.connections" should only return a single connection.');
        }

        const connection = options.connections[0];

        // If uri is empty
        if ((connection.uri ?? '').trim() === '') {
            throw new InvalidOptionsError('"options.uri" is empty.');
        }

        // Use custom logger
        if (options.log) {
            this.log = options.log;
        }

        // Setup connection
        this.connection = require('better-sqlite3')(connection.uri);

        // File doesn't exist or is empty
        if (!fs.existsSync(connection.uri) || this.connection.prepare(`SELECT name FROM sqlite_master WHERE type='table';`).get() === undefined) {
            this.log.warn('WARNING: Database appears empty; initializing it.');

            // Run initialisation function
            options.initialise(this.connection);
        }
    }

    protected serialiseParams(params: {
        [key: string]: unknown;
    }) {
        return Object.fromEntries(Object.entries(params).map(([key, value]) => {
            // true/false -> 1/0
            if (typeof value === 'boolean') {
                return [key, value === true ? 1 : 0];
            }

            if (isObject(value)) {
                return [key, value.value];
            }

            return [key, value];
        }));
    }

    async insert<T extends keyof Tables>(table: T, params: DatabaseInsert<Tables[T]>): Promise<Tables[T]> {
        // Query
        const queryParams = {
            id: uuid(),
            lastUpdated: new Date().toISOString(),
            ...params
        };
        const sqlQuery = `INSERT INTO ${table} (${Object.keys(queryParams)}) VALUES (${Object.keys(queryParams).map(param => `@${param}`)})`;
        this.log.debug(`QUERY: ${sqlQuery}`);

        // Params
        const sqlParams = this.serialiseParams(queryParams);
        this.log.debug(`PARAMS: ${JSON.stringify(sqlParams)}`);

        // Result
        const result = this.connection.prepare(sqlQuery).run(sqlParams);
        this.log.debug(`RESULT: ${JSON.stringify(result)}`);
        return queryParams as unknown as Tables[T];
    }

    async update<T extends keyof Tables>(table: T, id: string, params: DatabaseInsert<Tables[T]>): Promise<void> {
        // update Foo set Bar = 125
        const query = `UPDATE ${table} set (${Object.keys(params).map(param => `${param} = @${param}`)})`;
        this.log.debug(`QUERY: ${query}`);
        // return database.prepare(query).run(serialiseParams(params)) as T;
    }

    protected async buildSelect<T extends keyof Tables>(table: T, fields?: string[], params: Partial<Tables[T]> = {}) {
        // Query
        const query = `SELECT ${fields ?? '*'} FROM ${table}`;
        const whereClauses = Object.entries(params).map(([key, param]) => {
            if (isObject(param)) {
                return `${key} ${param.comparator} @${key}`;
            }

            return `${key} = @${key}`;
        });
        const whereClause = ` WHERE ${whereClauses.length === 1 ? whereClauses : whereClauses.join(' AND ')}`;
        const sqlQuery = Object.keys(params).length === 0 ? query : `${query}${whereClause}`;
        this.log.debug(`QUERY: ${sqlQuery}`);

        // Params
        const sqlParams = this.serialiseParams(params);
        this.log.debug(`PARAMS: ${JSON.stringify(sqlParams)}`);

        return {
            sqlQuery,
            sqlParams
        };
    }

    async findOne<T extends keyof Tables>(table: T, fields?: string[], params?: Partial<Tables[T]>) {
        const { sqlQuery, sqlParams } = await this.buildSelect(table, fields, params);

        // Result
        const result = this.connection.prepare(sqlQuery).get(sqlParams);
        this.log.debug(`RESULT: ${JSON.stringify(result)}`);
        return result as Tables[T];
    };

    async find<T extends keyof Tables>(table: T, fields?: string[], params?: Partial<Tables[T]>) {
        const { sqlQuery, sqlParams } = await this.buildSelect(table, fields, params);

        // Results
        const results = this.connection.prepare(sqlQuery).all(sqlParams);
        this.log.debug(`RESULT: ${JSON.stringify(results)}`);

        return results.map(result => mapObject(result, (key, value) => [String(key), value ?? undefined])) as Tables[T][];
    };
};