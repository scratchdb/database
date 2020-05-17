import { InvalidOptionsError } from '../errors';

interface Connection {
    uri: string
};

interface Logger {
    info(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    warning(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

export interface DriverOptions {
    log?: Logger | typeof console;
    initialise: (connection: any) => void;
    connections: Connection[]
};

export class Driver {
    protected log: Logger | typeof console;

    constructor(options: DriverOptions) {
        if (!options) {
            throw new InvalidOptionsError('"options" is required.');
        }

        this.log = console;
    }
};