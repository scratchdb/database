import { Driver, DriverOptions } from './driver';

interface Options extends DriverOptions {}

export class MySQL<Tables> extends Driver {
    constructor(options: Options) {
        super(options);

        throw new Error('Not implemented');
    }
};