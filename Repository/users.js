const { json } = require('body-parser');
const fs = require('fs');
const { test } = require('node:test');
const crypto = require('crypto');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf-8'
        }));
    }
    async create(attrs) {
        attrs.Id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }
    async getOne(id) {

        const records = await this.getAll();
        return records.find(x => x.Id === id);
    }
}

const test1 = async () => {
    const repo = new UsersRepository('users.json');
    const user = await repo.getOne('dd43b20a');
    console.log(user);
};

test1();