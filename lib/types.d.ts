export type DatabaseInsert<T> = Pick<T, Exclude<keyof T, 'id' | 'lastUpdated'>>;

export interface Connection {
    uri: string;
}

export type Driver = 'SQLite' | 'MySQL';

export interface Drivers<Tables> {
    SQLite: SQLite<Tables>;
    MySQL: MySQL<Tables>;
}
