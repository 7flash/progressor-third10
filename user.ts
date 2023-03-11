export interface User {
    id?: number;
    chatId?: string;
    language?: string;
    name?: string;
    sex?: string;
    traits?: string[];
    race?: string;
    class?: string;
    job?: string;
    story?: string;
    image?: string;
}

export abstract class AbstractUserStorage {
    abstract createUser(user: User): Promise<User>;
    abstract getUser(id: number): Promise<User | undefined>;
    abstract getUsers(): Promise<User[]>;
    abstract updateUser(user: User): Promise<User | undefined>;
    abstract deleteUser(id: number): Promise<boolean>;
}

export class InMemoryUserStorage extends AbstractUserStorage {
    private users: Map<number, User> = new Map();
    private lastId = 0;

    async createUser(user: User): Promise<User> {
        await Promise.resolve();
        const id = ++this.lastId;
        const newUser = { ...user, id };
        this.users.set(id, user);
        return newUser;
    }

    async getUser(id: number): Promise<User | undefined> {
      await Promise.resolve();
      return this.users.get(id);
    }
  
    async getUsers(): Promise<User[]> {
      await Promise.resolve();
      return [...this.users.values()];
    }
  
    async updateUser(user: User): Promise<User | undefined> {
      await Promise.resolve();
      if (this.users.has(user.id)) {
        this.users.set(user.id, user);
        return user;
      }
    }
  
    async deleteUser(id: number): Promise<boolean> {
      await Promise.resolve();
      return this.users.delete(id);
    }
}

export class RestUserStorage extends AbstractUserStorage {
    private apiUrl: string;

    constructor(apiUrl: string) {
        super();
        this.apiUrl = apiUrl;
    }

    async createUser(user: User): Promise<User> {
        const response = await fetch(`${this.apiUrl}/users`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to create user: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }

    async getUser(id: number): Promise<User | undefined> {
        const response = await fetch(`${this.apiUrl}/users/${id}`);
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();
        return data;
    }

    async getUsers(): Promise<User[]> {
        const response = await fetch(`${this.apiUrl}/users`);
        const data = await response.json();
        return data;
    }

    async updateUser(user: User): Promise<User | undefined> {
        const response = await fetch(`${this.apiUrl}/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            return undefined;
        }
        const data = await response.json();
        return data;
    }

    async deleteUser(id: number): Promise<boolean> {
        const response = await fetch(`${this.apiUrl}/users/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    }
}