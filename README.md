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
        password: string;
    }

    interface Tables {
        episodes: Episode
        users: User
    }

    const db = createDatabase<Tables>('SQLite', {
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
    //     password: 'a-secret-password'
    // }, {
    //     id: 2,
    //     lastUpdated: '2020-05-15T04:12:11.201Z',
    //     name: 'Ella',
    //     password: 'another-secret-password'
    // }]
    ```
```