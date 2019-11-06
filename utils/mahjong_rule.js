
const ACCTION_MOPAI = 1
const ACCTION_CHUPAI = 2
const ACCTION_PENG = 3
const ACCTION_GANG = 4
const ACCTION_TING = 5
const ACCTION_HU = 6

class Mahjong{
  constructor(type, value, code) {
    this.type = type // type 1, 2, 3 筒 条 万
    this.value = value
    this.code = code
  }
}
class Player{
  constructor(user, seatIndex, data) {
    this.user = user
    this.seatIndex = seatIndex
    this.data = data || {} 
    
    //持有的牌
    this.data.holds = [];
    //打出的牌
    this.data.folds = [];
    //暗杠的牌
    this.data.angangs = [];
    //点杠的牌
    this.data.diangangs = [];
    //弯杠的牌
    this.data.wangangs = [];
    //碰了的牌
    this.data.pengs = [];
    //缺一门
    this.data.que = -1;
    //玩家手上的牌的数目，用于快速判定碰杠
    this.data.countMap = {}
    //换3张
    this.data.huanpais = []
    
    this.data.canPeng = false

    this.data.canGang = false

    this.data.canHu = false

    this.data.canMopai = false

    this.data.tingMap = {}
    // 是否作庄
    this.isZhuang = false
  }

  mopai(mahjongs, ) {

  }
  // 摇骰子
  dice() {
    let dice1
    let dice2
    dice1 = Math.ceil(Math.random()*6)
    dice2 = Math.ceil(Math.random()*6)
    let total = dice1 + dice2
    let smaller = dice1 >= dice2 ? dice2 : dice1
    return {
      dice1: dice1,
      dice2: dice2,
      total: total,
      smallDice: smaller
    }
  }
  checkPingFu() {
    let countMap = [].concat(this.data.countMap)
    this.checkHupaiData = {
      kanzi: [],
      holds: [],
      result: [],
      isHu: false,
      countMap: countMap
    }
    this.checkHupaiData.holds.sort((a, b) => a - b) // 从小到大排序
    for(let i = 1; i<=3; i++) {
      this.a(checkHupaiData, i)
      if (checkHupaiData.holds.leng === 0) {
        isHu = true
        break;
      }
    }
    return checkHupaiData.isHu
  }
  a (checkHupaiData, type) {
    let newData = checkHupaiData
    if (newData.holds.length > 0) {
      const val = newData.holds[0]
      const c = countMap[val]
        if (i >=3 && type === 3) {
          newData = record(val, newData)
          newData = record(val, newData)
          newData = record(val, newData)
          a(newData, type)
        } else if (c >= 2 && type ===2) {
          newData = record(val, newData)
          newData = record(val, newData)
          a(newData, type)
        } else if ( c >= 1 && type === 1) {
          if (checkNum(val + 1) > 0 && checkNum(val + 2)) { // y y+1 y+2
            newData = record(val, newData)
            newData = record(val + 1, newData)
            newData = record(val + 2, newData)
            a(newData, type)
          }
        }
      }
      console.log(checkHupaiData)
  }
  record(val, newData) {
    let countMap = newData.countMap
    let holds = newData.holds
    let kanzi = newData.kanzi
    if (countMap[val] && countMap[val] > 0) {
      countMap[val] -= 1
      holds.splice(holds.indexOf(val), 1)
      kanzi.push(val)
      return {
        countMap: countMap,
        holds: holds,
        kanzi: kanzi
      }
    }
  }
  checkNum(val) {
    if (this.data.countMap[val] && this.data.countMap > 0) {
      return this.data.countMap
    } else {
      return 0
    }
  }
}
class Room{
  constructor(roomId, user) {
    this.roomId = roomId
    this.zhuangPlayer = {} // 做庄的玩家
    // 添加玩家
    this.players = []
    // let player = new Player(user, this.players.length)
    // this.players.push(player)
    // 添加108个麻将，
    this.mahjongs = []
    for(let type=1; type<=3; type++) {
      for (let value = 1; value <= 9; value++) {
        for(let c = 1; c<=4; c++) {
          this.mahjongs.push(new Mahjong(type, value, (type * 10 + value)))
        }
      }
    }
    this.enterRoom(user)
  }
  enterRoom(user) {
    let player = new Player(user, this.players.length)
    this.players.push(player)
  }
  getZhuangPlayer() {
    let winner = this.players.filter(play => play.isZhuang)
    if (winner.length === 0) {
      const randomIndex = Math.floor(Math.random()*4)
      this.zhuangPlayer = this.players[randomIndex]
      this.zhuangPlayer.isZhuang = true
    } else {
      this.zhuangPlayer = winner[0]
    }
  }
  beginGame() {
    let seatIndex
    if (this.players.length === 4) {
      this.getZhuangPlayer()
      seatIndex = this.zhuangPlayer.seatIndex
      this.fapai(seatIndex)
    } else {

    }
  }
  // 洗牌
  shuffle() {
    for(let i = 0; i < this.mahjongs.length; i++ ) {
      let lastIndex = this.mahjongs.length - 1 - i
      let index = Math.floor(Math.random() * lastIndex)
      let t = this.mahjongs[index]
      this.mahjongs[index] = this.mahjongs[lastIndex]
      this.mahjongs[lastIndex] = t
    }
    return this.mahjongs
  }

  fapai() { // 庄的座位号
    let dices = this.zhuangPlayer.dice()
    let seatIndex = this.zhuangPlayer.seatIndex
    let startDic = dices.total % 5
    let startIndex = (startDic + seatIndex) * 13 * 2 + dices.smallDice * 2 + 1 
    for (let i = 0; i < 53; i ++) {
      if (i < 48) {
        this.players[(Math.floor(i / 4)+seatIndex) % 4].data.holds.push(this.mahjongs[i + startIndex])
      } else {
        this.players[(i + seatIndex) % 4].data.holds.push(this.mahjongs[i + startIndex])
      }
    }
  }

  
  
  checkCanPingFu(begin, end) {
    for(let i = begin; i <= end; i++) {
      const old = this.data.countMap[i]
      if (old == null) {
        old = 0
        this.data.countMap[i] = 1
      } else {
        this.data.countMap[i]++
      }
    }
  }
  destoryRoom() {

  }
}
module.exports = Room

