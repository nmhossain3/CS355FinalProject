const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3001;
const uri = 'mongodb+srv://shamsi:test@cluster0.ujxal.mongodb.net/?retryWrites=true&w=majority';

// Models
const Transaction = require('./models/Transaction');

// Connecting to MongoDB via mlab
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
  if (err) throw err;
  else console.log('Successfully connected to MongoDB via mLab');
});

// Body Parser
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  try {
      const transactions = await Transaction.find();
      if (transactions) {
          res.status(200);
          res.send(transactions);
      }
  } catch (err) {
      res.send(err);
  }
});

app.get('/statistics', async (req, res) => {
  try {
      const transactions = await Transaction.find();
      if (transactions) {
          let income = expenses = balance = 0;

          for (const transaction of transactions) {
            if (transaction.type === 'Income') {
              income += transaction.amount
            } else if (transaction.type === 'Expense') {
              expenses += transaction.amount
            }

            balance = income - expenses
          }

          res.status(200);
          res.send({ income, expenses, balance });
      }
  } catch (err) {
      res.send(err);
  }
});

app.post('/create', async (req, res) => {
  const { date, description, type, amount } = req.body;
  const transaction = new Transaction({
      date,
      description,
      type,
      amount
  });

  try {
      const saved = await transaction.save()
      res.status(200);
      res.json({ message: 'Transaction was created!', transaction: saved });
  } catch (err) {
      res.send(err);
  }
});

app.delete('/transaction/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const deleted = await Transaction.deleteOne({ _id: id })
      res.status(200);
      res.json({ message: 'Transaction was deleted!' });
  } catch (err) {
      res.send(err);
  }
});

app.use(express.static(__dirname + '/public'));

// Server Listening
app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
})