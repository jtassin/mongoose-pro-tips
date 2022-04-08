const mongoose = require('mongoose');
const { connect,  } = require('./connect');
const { Schema } = mongoose

async function run() {
    await connect();
    const usersSchema = new Schema({
        notes: [{ text: String, date: Date, _id: false }],
      });
    const User = mongoose.model('User', usersSchema);

    await User.deleteMany({})

    mongoose.set('debug', true)
    await User.create({
        notes: [{ date: new Date(), text: 'Hello' }],
    })
    const user = await User.findOne({})
    user.notes.push({ date: new Date(), text: 'World' })
    await user.save()

    await User.updateOne({

    }, {
        $push: { notes: { text: 'Wide', date: new Date() } }
    })


    mongoose.disconnect()
}

run().catch(console.error);