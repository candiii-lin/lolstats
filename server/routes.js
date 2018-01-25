const express = require('express');
const SummonerCtrl = require('./controllers/summoner');

module.exports = function setRoutes(app) {

  const router = express.Router();

  router.route('/summoner/:name').get(SummonerCtrl.getSummonerByName);
  router.route('/latestmatches/:accountId').get(SummonerCtrl.getLatestMatches);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
