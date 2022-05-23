const mongoose = require('mongoose');
const { Schema } = mongoose;

const Transaction = Schema({
    date: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
});

module.exports = mongoose.model('Transaction', Transaction);