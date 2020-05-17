import { InvalidOptionsError } from '../errors';

interface Connection {
    uri: string
};

export interface DriverOptions {
    log?: typeof console;
    initialise: (connection: any) => void;
    connections: Connection[]
};

export class Driver {
    protected log: typeof console;

    constructor(options: DriverOptions) {
        if (!options) {
            throw new InvalidOptionsError('"options" is required.');
        }

        this.log = console;
    }
};