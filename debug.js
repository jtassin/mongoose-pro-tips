const mongoose = require('mongoose');
const { connect,  } = require('./connect');
const { usersSchema } = require('./users')

async function run() {
    await connect();
    const User = mongoose.model('User', usersSchema);

    mongoose.set('debug', true)
    await User.deleteMany({})
    await User.create({
        firstname: 'John',
        email: 'john@doe.com',
        hidden: false,
    })
    await User.findOne({ firstname: 'John' })



    mongoose.disconnect()
}

run().catch(console.error);