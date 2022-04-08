const mongoose = require('mongoose');
const { connect,  } = require('./connect');
const { Schema } = mongoose

async function run() {
    await connect();
    const usersSchema = new Schema({
        serialNumber: { type: String, immutable: true },
        firstname: { type: String },
    });
    const User = mongoose.model('User', usersSchema);

    await User.deleteMany({})

    mongoose.set('debug', true)
    await User.create({
        serialNumber: 'Hello'
    })
    const user = await User.findOne({})
    user.serialNumber = 'new SN'
    user.firstname = 'Gérard'
    await user.save()

    await User.updateOne({

    }, {
        serialNumber: 'new SN',
        firstname: 'Mensoif'
    })

    await User.updateOne({

    }, {
        serialNumber: 'new SN',
    })


    mongoose.disconnect()
}

run().catch(console.error);