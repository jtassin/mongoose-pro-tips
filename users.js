const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersSchema = new Schema({
  firstname:  String,
  email: String,
  notes: [{ text: String, date: Date }],
  birthDate: { type: Date, default: Date.now },
  hidden: Boolean
});


module.exports.usersSchema = usersSchema;