'use strict';

const region_url = "https://na1.api.riotgames.com";

exports.generateGetSummonerByName = (name) => {
  return region_url + '/lol/summoner/v3/summoners/by-name/' + name + "?api_key=" + process.env.RG_API_KEY;
}

exports.generateProfileIconImage = (iconID) => {
  return 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/' + iconID + '.png';
}

exports.generateLatestMatch = (accountId) => {
  return region_url + '/lol/match/v3/matchlists/by-account/'+ accountId +'/recent?api_key=' + process.env.RG_API_KEY;
}

exports.generateMatchDetails = (matchId) => {
  return region_url + '/lol/match/v3/matches/' + matchId + "?api_key=" + process.env.RG_API_KEY;
}

exports.getStaticURLS = () => {
  return [
    'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json',
    'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json',
    'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/rune.json',
    'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json'
  ]
}
