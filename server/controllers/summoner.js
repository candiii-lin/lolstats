'use strict';
const helper = require('../helper');
const request = require('request');
const async = require('async');
const format_duration = require('format-duration');
const _ = require('lodash');

const spellKeys = ['spell1Id', 'spell2Id'];
const itemKeys = ['item0', 'item1', 'item2', 'item3', 'item4', 'item5', 'item6'];

exports.getSummonerByName = (req, res) => {
  let summonerURL = helper.generateGetSummonerByName(req.params.name);

  request(summonerURL, (err, resp, body) => {
    let response = JSON.parse(body);
    if ('status' in response) {
      return res.status(response.status.status_code).json(response.status.message);
    }

    response.profileImage = helper.generateProfileIconImage(response.profileIconId);
    return res.json(response);
  });

}

exports.getLatestMatches = (req, res) => {
  let matchesURL = helper.generateLatestMatch(req.params.accountId);
  var accountId = req.params.accountId;

  async.waterfall([
      getStaticFiles,
      getMatchLists,
      getMatchDetails,
  ], function (err, result) {
    if (err) {
      return res.status(err.status_code).json(err.message);
    }

    return res.json(result);
      // result now equals 'done'
  });

  function getStaticFiles(callback) {
    let staticURLS = helper.getStaticURLS();

    async.map(staticURLS, (staticURL, cb) => {
      request(staticURL, (err, resp, body) => {
        if (err) {
          cb(err);
        }
        let response = JSON.parse(body);

        return cb(null, response);
      });
    }, function(err, results) {
      if (err) {
        return callback(err);
      }

      return callback(null, _.mapKeys(results, 'type'));
    });
  }

  function getMatchLists(staticFiles, callback) {
    request(matchesURL, (err, resp, body) => {
      if (err) {
        callback(err);
      }
      let response = JSON.parse(body);
      if ('status' in response) {
        return callback(response.status);
      }

      let matches = response.matches;

      return callback(null, staticFiles, matches);
    });
  }

  function getMatchDetails (staticFiles, matches, callback) {
    async.mapLimit(matches, 5, (match, cb) => {
      let matchDetailURL = helper.generateMatchDetails(match.gameId);
      request(matchDetailURL, (err, resp, body) => {
        if (err) {
          cb(err);
        }
        let details = JSON.parse(body);
        if ('status' in details) {
          return cb(details.status);
        }

        let participantIdentity = _.find(details.participantIdentities, (participant) => {
          return participant.player.accountId == accountId;
        });

        let self = _.find(details.participants, {'participantId': participantIdentity.participantId});

        let team = _.find(details.teams, {'teamId': self.teamId});

        if (team.win == "Win") match.outcome = "Victory"
        else match.outcome = "Defeat";

        match.duration = format_duration(details.gameDuration * 1000);
        match.kills = self.stats.kills;
        match.deaths = self.stats.deaths;
        match.assists = self.stats.assists;
        match.champLevel = self.stats.champLevel;
        match.creepScore = self.stats.neutralMinionsKilled + self.stats.totalMinionsKilled;
        match.cspm = match.creepScore / (details.gameDuration / 60);

        let champion = _.find(staticFiles.champion.data, {"key": String(self.championId)});
        if (champion) {
          match.champion = {
            name: champion.name,
            icon: helper.generateChampionIcon(champion.image.full)
          }
        }
        // match.champion = champion ? champion.name : match.champion;

        match.spells = []

        _.each(spellKeys, (spellKey) => {
          let spell = _.find(staticFiles.summoner.data, {"key": String(self[spellKey])});
          if (spell) {
            match.spells.push(spell.name);
          }
        });

        match.items = []

        _.each(itemKeys, (itemKey) => {
          let item = staticFiles.item.data[self.stats[itemKey]];

          if (item) {
            match.items.push(item.name);
          } else {
            match.items.push("None");
          }
        });

        match.runes = []

        _.each(self.runes, (rune) => {
          let foundRune = staticFiles.rune.data[rune.runeId];

          if (foundRune) {
            rune.name = foundRune.name;
          }

          match.runes.push(rune);
        })

        return cb(null, match);
      });
    }, function(err, results) {
      return callback(null, results);
    });
  }
}
