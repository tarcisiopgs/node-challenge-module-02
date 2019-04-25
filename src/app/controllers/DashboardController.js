const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class DashboardController {
  async index (req, res) {
    const { provider, id } = req.session.user
    if (!provider) {
      const providers = await User.findAll({ where: { provider: true } })

      return res.render('dashboard', { providers })
    } else {
      const appointments = await Appointment.findAll({
        where: {
          provider_id: id,
          date: {
            [Op.between]: [
              moment()
                .startOf('day')
                .format(),
              moment()
                .endOf('day')
                .format()
            ]
          }
        },
        include: [
          {
            model: User,
            foreignKey: 'user_id'
          }
        ]
      })

      await appointments.map(async (v, i) => {
        appointments[i].dateFormated = await moment(v.date).format('DD/MM/YYYY')
      })
      return res.render('dashboard', { appointments })
    }
  }
}

module.exports = new DashboardController()
