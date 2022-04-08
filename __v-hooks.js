const mongoose = require('mongoose');
const { connect, } = require('./connect');
const { Schema } = mongoose

async function run() {
    await connect();
    const usersSchema = new Schema({
        notes: [{ text: String, date: Date, _id: false }],
        firstname: String,
    });
    usersSchema.pre('updateOne', function () {
        const update = this.getUpdate();
        update.$inc = update.$inc || {};
        update.$inc.__v = 1;
    });

    usersSchema.pre('save', function (next) {
        this.__v = (this.__v || 0) + 1;
        next();
    });

    const User = mongoose.model('User', usersSchema);

    // await User.deleteMany({})

    mongoose.set('debug', true)
    await User.create({
        notes: [{ date: new Date(), text: 'Hello' }],
    })
    const user = await User.findOne({})
    user.firstname = 'Will'
    await user.save()

    await User.updateOne({

    }, {
        $push: { notes: { text: 'Wide', date: new Date() } }
    })


    mongoose.disconnect()
}

run().catch(console.error);