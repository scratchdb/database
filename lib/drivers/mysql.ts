import { Driver, DriverOptions } from './driver';

export interface MySQLOptions extends DriverOptions {}

export class MySQL<Tables> extends Driver {
    constructor(options: MySQLOptions) {
        super(options);

        throw new Error('Not implemented');
    }
};