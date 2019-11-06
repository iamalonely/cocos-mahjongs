var express = require('express');
var router = express.Router();

var request = require('superagent')

var createRes = require('../utils')


/* GET home page. */
router.post('/login', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  const userInfo = req.body
  console.log(userInfo)
  const sql = `SELECT * FROM sys.user WHERE userName='${userInfo.username}' AND password='${userInfo.password}'`
  connection.query(sql, (err, data) => {
    if (err) {
      console.log(err)
      res.json(createRes(201, null, '账号密码错误'))
    } else {
      console.log(data.length)
      if (data.length <=0) {
        res.json(createRes(201, null, '账号密码错误'))
      } else {
        var jwtscrect = 'pswpritse'
        var token = jwt.sign({...data[0]}, jwtscrect, {expiresIn: 3600})
        res.json(createRes(200, {username: data[0].userName, token}, null))
      }
    }
  })
});
router.get('/userList', function(req, res, next) {
  var sql = "SELECT * FROM user"
  connection.query(sql, function(err, result) {
    if (err) {
      console.log(err)
      return 
    }
    request.get('www.baidu.com').end( (err,resp) => {
      res.send({result: result, html: resp.text})
    })
    console.log(result)
  })
})
router.all('/addUser', (req, res ,next) => {
  var sql = "INSERT INTO user (name, sex, tel, birthday) VALUES ()"
})
module.exports = router;
