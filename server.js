const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://rashdijabbar:Dumnup-3middu-degfaw@cluster0.klmdea0.mongodb.net/slipdb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Define Slip Schema
const slipSchema = new mongoose.Schema({
  name: String,
  fathername: String,
  seatno: Number,
  pic: String,
  cnic: Number,
  block: Number,
  center: String,
  datentime : String,

});
const Slip = mongoose.model('Slip', slipSchema);

// Create a new Slip
app.post('/slips', (req, res) => {
  const { name, fathername, seatno, pic, cnic } = req.body;
  const slip = new Slip({
    name,
    fathername,
    seatno,
    pic,
    cnic,
    block,
    center,
    datentime,
  });
  slip.save()
    .then(() => {
      res.status(201).json({ message: 'Slip created successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to create slip' });
    });
});

// Get all Slips
app.get('/slips', (req, res) => {
  Slip.find()
    .then((slips) => {
      res.json(slips);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve slips' });
    });
});

// Get Slip by CNIC
app.get('/slips/:cnic', (req, res) => {
  const cnic = req.params.cnic;
  Slip.findOne({ cnic })
    .then((slip) => {
      if (!slip) {
        return res.status(404).json({ error: 'Slip not found' });
      }
      res.json(slip);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve slip' });
    });
});

// Start the server
port = process.env.PORT || 80
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
