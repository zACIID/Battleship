const myChai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
myChai.use(chaiHttp);

const User = require('../src/models/user');
const Match = require('../src/models/match');
const Chat = require('../src/models/chat');

const importTest = (name, path) => {
    describe(name, () => {
        require(path)
    })
}

const initializeDB = async () => {

    // DB INIZIALIZATION
    Chat.

}


describe('Test', () => {
    // Init Database
    before(async () => {
        await initializeDB()
    })


    importTest(' Chat Endpoints Test', './ChatTest/chat-endpoints')

    // Cleanup
    after(async () => {
        await Chat.deleteMany({})
    })
})
