const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
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

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64)


        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
        await this.writeAll(records);

        return record;
    }

        async comparePasswords(saved,supplied){

            const[hashed,salt] = saved.split('.');
            const hashedSuppliedBuf = await scrypt(supplied,salt,64);

            return hashed === hashedSuppliedBuf.toString('hex');
        }
    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(email) {

        const records = await this.getAll();
        return records.find(x => x.email === email);
    }

    async delete(id) {
        const records = await this.getAll();
        const filtertedData = records.filter(record => record.Id !== id);
        await this.writeAll(filtertedData);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const user = records.find(record => record.Id === id);
        if (!user) {
            throw new Error('Id not found');
        }
        Object.assign(user, attrs);
        await this.writeAll(records);
    }


}
module.exports = new UsersRepository('users.json');