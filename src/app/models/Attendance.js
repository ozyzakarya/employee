const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttedanceSchema = mongoose.Schema({
  employe: {
    type: Schema.Types.ObjectId,
    ref: "Employe",
    required: true,
  },
  isLate: {
    type: Boolean,
    default: false,
  },
  isLeave: {
    type: Boolean,
    default: false,
  },
  isAttend: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attedance", AttedanceSchema);
