import MongoConnection from '../domain/MongoConnection.mjs'
import bcrypt from 'bcrypt'
import { Faker, en } from '@faker-js/faker';
const customFaker = new Faker({
    locale: [en],
});

export default class UserService {
    #collection
    constructor(connection_string, dbName, nUsers) {
        const connection = new MongoConnection(connection_string, dbName);
        this.#collection = connection.getCollection('accounts');
        if (nUsers > 0) {
            this.generateRandomUsersDB(nUsers);
       }
    }
    async addAccount(account) {
       const accountDB = await toAccountDB(account);
       let isExist = [];
       isExist = await this.#collection.find({"_id": accountDB._id}).toArray();
       if (isExist.length == 0) {
       await this.#collection.insertOne(accountDB);
        }
       return account;

    }
    toAccount(accountDB) {
        const res = {...accountDB, username:accountDB._id};
        delete res._id;
        return res;
    }
    async generateRandomUsersDB(nUsers){
        for (let i = 0; i < nUsers; i++){
            const randomUser = generateRandomUser();
            await this.addAccount(randomUser);
        }
    }
    
}
async function toAccountDB(account) {
    const passwordHash = await bcrypt.hash(account.password, 10); 
    const res = {_id: account.username, passwordHash, roles:account.roles}
      return res;
}
function generateRandomUser() {
    const username = customFaker.person.firstName();
    const password = "12345@com";
    const roles = customFaker.helpers.arrayElement(['ADMIN', 'USER', ['ADMIN','USER']]);
    return {
        username: username,
        password: password,
        roles: roles
    };
}