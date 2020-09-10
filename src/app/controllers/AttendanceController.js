const Attendance = require("../models/Attendance");

class AttendanceController {
  async index(req, res) {
    const { count } = req.query;
    if (count) {
      const attendances = await Attendance.find().limit(parseInt(count));
      return res.json(attendances);
    } else {
      const attendances = await Attendance.find();
      return res.json(attendances);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const attendance = await Attendance.findById(id);
    return res.json(attendance);
  }

  async store(req, res) {
    const { body } = req;

    if (body.isAttend == true && body.isLeave == true) {
      return res.status(400).json({
        message: "Impossible to attend but to leave at the same day!",
      });
    }

    if (body.isLate == true && true == body.isLeave) {
      return res
        .status(400)
        .json({ message: "Impossible to late but to leave at the same day!" });
    }

    const attendance = await Attendance.create(body);
    return res.status(200).json(attendance);
  }

  async update(req, res) {
    const { body } = req;
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.json(attendance);
  }

  async destroy(req, res) {
    const { id } = req.params;

    await Attendance.findByIdAndDelete(id);
    return res.status(204).send();
  }
}

module.exports = new AttendanceController();
