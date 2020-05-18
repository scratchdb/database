# Database

## Usage

1. Install
    ```bash
    npm i @scratchdb/database
    ```

2. Import in module
    ```ts
    import { createDatabase } from '@scratchdb/database';
    ```

3. Setup driver
    ```ts
    interface Episode {
        title: string;
    }

    interface User {
        name: string;
        alive: boolean;
        password: string;
    }

    interface Tables {
        episodes: Episode
        users: User
    }
    type ExtendPrototype<Prototype, NewFields> = NewFields & Omit<Prototype, keyof NewFields>;
    // This is the actual data stored in the table
    // Note: Booleans need to be set to numbers
    type SerialisedTables = {
        episodes: ExtendPrototype<Episode, {}>;
        users: ExtendPrototype<User, {
            alive: number;
            // Dead users will have their passwords stripped
            password: string | null;
        }>;
    };

    const db = createDatabase<SerialisedTables, Tables>('SQLite', {
        connections: [{
            uri: '/tmp/my-database-file.db'
        }]
    });
    ```

4. Profit?
    ```ts
    const episode = await db.findOne('episodes', 1);
    // {
    //     id: 1,
    //     lastUpdated: '2020-05-17T04:12:11.201Z',
    //     title: 'A happy day'
    // }

    const users = await db.find('users');
    // [{
    //     id: 1,
    //     lastUpdated: '2020-05-17T04:12:11.201Z',
    //     name: 'Alexis',
    //     alive: 1,
    //     password: 'a-secret-password'
    // }, {
    //     id: 2,
    //     lastUpdated: '2020-05-15T04:12:11.201Z',
    //     name: 'Ella',
    //     alive: 1,
    //     password: 'another-secret-password'
    // }, {
    //     id: 3,
    //     lastUpdated: '2020-05-15T04:12:11.201Z',
    //     name: 'Elvis',
    //     alive: 0,
    //     password: null
    // }]
    ```
```