const mongoose = require('mongoose');
const { connect, } = require('./connect');
const { Schema } = mongoose

async function run() {
    await connect();
    const usersSchema = new Schema({
        firstname: String,
    },
        { optimisticConcurrency: true }
    );
    const User = mongoose.model('User', usersSchema);

    await User.deleteMany({})

    mongoose.set('debug', true)
    await User.create({
        firstname: 'Hello'
    })
    const user = await User.findOne({})
    user.firstname = 'World'
    await user.save()

    await User.updateOne({

    }, {
        firstname: 'Wide'
    })

    const user2 = await User.findOne({})
    user.firstname = '1';
    user2.firstname = '2'
    await user.save()
    await user2.save()


    mongoose.disconnect()
}

run().catch(console.error);