import { InvalidOptionsError } from '../errors';

interface Connection {
    uri: string
};

export interface DriverOptions {
    log?: Logger | typeof console;
    initialise: (connection: any) => void;
    connections: Connection[]
};

type Logger = Console;

export class Driver {
    protected log: Logger;

    constructor(options: DriverOptions) {
        if (!options) {
            throw new InvalidOptionsError('"options" is required.');
        }

        this.log = console;
    }
};