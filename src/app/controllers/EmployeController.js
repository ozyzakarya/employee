const Employe = require("../models/Employe");
const Attendance = require("../models/Attendance");

class EmployeController {
  async index(req, res) {
    const { count } = req.query;
    if (count) {
      const employes = await Employe.find().limit(parseInt(count));
      const results = [];

      for (var i = 0; i < employes.length; i++) {
        const attendances = await Attendance.find({
          employe: employes[i]["_id"],
        });
        let employe = await employes[i].toObject();

        var attend = attendances.filter((val) => {
          return val.isAttend === true;
        });
        var leave = attendances.filter((val) => {
          return val.isLeave === true;
        });
        var late = attendances.filter((val) => {
          return val.isLate === true;
        });

        employe.attendPercentage = (attend.length / attendances.length) * 100;
        employe.leavePercentage = (leave.length / attendances.length) * 100;
        employe.latePercentage = (late.length / attendances.length) * 100;

        results.push(employe);
      }

      return res.json(results);
    } else {
      const employes = await Employe.find();
      return res.json(employes);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const employe = await Employe.findById(id);
    return res.json(employe);
  }

  async store(req, res) {
    const { body } = req;

    const employe = await Employe.create(body);
    return res.status(200).json(employe);
  }

  async update(req, res) {
    const { body } = req;
    const { id } = req.params;

    const employe = await Employe.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.json(employe);
  }

  async destroy(req, res) {
    const { id } = req.params;

    await Employe.findByIdAndDelete(id);
    return res.status(204).send();
  }
}

module.exports = new EmployeController();
