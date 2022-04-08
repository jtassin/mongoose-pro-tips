const mongoose = require('mongoose');
const { connect, } = require('./connect');
const { Schema } = mongoose

async function run() {
    await connect();
    const usersSchema = new Schema({
        firstname: String,
    });
    usersSchema.index('firstname', { name: 'first' });
    usersSchema.index('firstname', { name: 'second' });
    const User = mongoose.model('User', usersSchema);
    User.on('index', function (err) {
        if (err) {
            console.error(err);
        }
    });

    setTimeout(() => mongoose.disconnect(), 1_000)
}

run().catch(console.error);

