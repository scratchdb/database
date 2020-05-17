export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);

        this.name = 'DatabaseError';

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
};

export class ValidationError extends DatabaseError {
    constructor(message: string) {
        super(message);

        this.name = 'ValidationError';

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
};
export class InvalidOptionsError extends DatabaseError {
    constructor(message: string) {
        super(message);

        this.name = 'InvalidOptionsError';

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidOptionsError.prototype);
    }
};