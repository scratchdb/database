import { InvalidOptionsError } from '../errors';

export interface DriverConnection {
    uri: string
};

export interface DriverOptions {
    connections: DriverConnection[]
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