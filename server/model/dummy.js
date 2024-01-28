const mongoose = require('mongoose');

const dummyContentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const DummyContent = mongoose.model('DummyContent', dummyContentSchema);

module.exports = DummyContent;