import { InvalidOptionsError } from '../errors';

interface Connection {
    uri: string
};

export interface DriverOptions {
    log?: typeof console;
    initialise?: (connection: any) => void;
    connections: Connection[]
};

export class Driver {
    protected log: typeof console;

    constructor(options: DriverOptions) {
        if (!options) {
            throw new InvalidOptionsError('"options" is required.');
        }

        if (process.env.NODE_ENV === 'test') {
            this.log = {
                ...console,
                debug(){},
                error(){},
                warn(){},
                info(){}
            }
            return;
        }

        if (process.env.NODE_ENV === 'production') {
            this.log = {
                ...console,
                debug(){}
            }
            return;
        }

        this.log = console;
    }
};