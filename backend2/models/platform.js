const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  url: String,
  allowedDuration: Number, // en minutes
  allowedDays: [String],   // par exemple ["Monday", "Wednesday"]
});

module.exports = mongoose.model('Platform', platformSchema);
