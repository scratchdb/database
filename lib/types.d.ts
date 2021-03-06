import { SQLite, MySQL } from './drivers';

export type DatabaseInsert<T> = Pick<T, Exclude<keyof T, 'id' | 'lastUpdated'>>;

export interface Connection {
    uri: string;
}

export type Driver = 'SQLite' | 'MySQL';

export interface Drivers<SerialisedTables, Tables> {
    SQLite: SQLite<SerialisedTables, Tables>;
    MySQL: MySQL<SerialisedTables, Tables>;
}
