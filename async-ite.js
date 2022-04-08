const mongoose = require('mongoose');
const { connect, } = require('./connect');
const { Schema } = mongoose
const _ = require('lodash');

const RECORDS = 100_000;


async function toArray(User) {
    console.log(process.memoryUsage().heapUsed / 1024 / 1024 + 'mb used')
    let users = await User.find({}).lean();
    let res = users.reduce((acc, user) => {
        return acc + user.leftOperand * user.rightOperand
    }, 0)
    console.log(process.memoryUsage().heapUsed / 1024 / 1024 + 'mb used')
}

async function asyncHook(User) {
    let res = 0;
    for await (const user of User.find({}).lean()) {
        res = res + user.leftOperand * user.rightOperand
    }
    console.log(process.memoryUsage().heapUsed / 1024 / 1024 + 'mb used')
}

async function run() {
    await connect();

    const usersSchema = new Schema({
        leftOperand: Number,
        rightOperand: Number,
    });
    const User = mongoose.model('User', usersSchema);

    await User.deleteMany({})

    const documents = _.times(RECORDS, (i) => {
        const toInsert = {
            leftOperand: i,
            rightOperand: 2,
        };
        return toInsert
    })

    await User.insertMany(documents)

    global.gc();
    await toArray(User);
    global.gc();
    await asyncHook(User);

    mongoose.disconnect()
}

run().catch(console.error);