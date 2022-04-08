const mongoose = require('mongoose');
const { connect, } = require('./connect');
const { Schema } = mongoose
const _ = require('lodash');

const RECORDS = 100_000;

mongoose.set('debug', true)

async function run() {
    await connect();

    const usersSchema = new Schema({
        firstname: String,
    });
    const User = mongoose.model('User', usersSchema);

    await User.deleteMany({})
    
    await User.create({
        firstname: 'toto'
    })
    const user = await User.findOne({})
    await User.deleteMany({})
    await user.save()
    
    user.firstname = 'jhgjhg'
    user.firstname = 'toto'
    await user.save()

    mongoose.disconnect()
}

run().catch(console.error);