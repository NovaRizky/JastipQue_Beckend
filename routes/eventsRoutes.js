const eventsRoutes = require('express').Router()
const eventsController = require('../controllers/eventsControllers')

eventsRoutes.get('/', eventsController.getEvents)
eventsRoutes.post('/', eventsController.createEvents)
eventsRoutes.delete('/:eventId', eventsController.deleteEvents)
eventsRoutes.put('/:eventId', eventsController.updateEvents)

module.exports = eventsRoutes