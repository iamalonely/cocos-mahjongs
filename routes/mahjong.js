var express = require('express');
var router = express.Router();
var room = require('../utils/mahjong_rule')
var Room = require('../utils/mahjong_rule')
router.get('/getMajhongs', (req, res, next) => {
  const type = req.body.type
  const room1 = new Room(1, {username: '1'})
  room1.enterRoom({username: '2'})
  room1.enterRoom({username: '3'})
  room1.enterRoom({username: '4'})
  const mahjongs = room1.shuffle()
  room1.getZhuangPlayer()
  room1.fapai()
  res.json({room1: room1.players})
})

module.exports = router;