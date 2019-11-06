var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var mysql = require('mysql');
var createRes = require('../utils')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'mydb'
})
function sqlErr(res) {
  console.log('数据库连接错误')
  res.json(createRes(201, null, '数据库连接错误'))
}
connection.connect()
/* GET users listing. */
router.post('/login', function(req, res, next) {
  const userInfo = req.body
  console.log(userInfo)
  const sql = `SELECT * FROM mydb.user WHERE username='${userInfo.username}' AND password='${userInfo.password}'`
  connection.query(sql, (err, data) => {
    if (err) {
      console.log(err)
      res.json(createRes(201, null, '账号密码错误'))
    } else {
      console.log(data)
      if (data.length <=0) {
        res.json(createRes(201, null, '账号密码错误'))
      } else {
        var jwtscrect = 'pswpritse'
        var token = jwt.sign({...data[0]}, jwtscrect, {expiresIn: 3600})
        res.json(createRes(200, {username: data[0].username || '', token}, null))
      }
    }
  })
});

router.post('/register', function(req, res, next) {
  
  const username = req.body.username
  const passowrd = req.body.password
  const sql = `SELECT * FROM mydb.user WHERE username='${username}'`
  connection.query(sql, function(err, data) {
    if (err) {
      sqlErr(res)
    } else {
      if (!data) {
        connection.query(`INSERT INTO mydb.user(username, password) VALUES('${username}', '${passowrd}')`, (err, data) => {
          if (err) {
            sqlErr(res)
          }
        })
      } else {
        res.json(createRes(201, null, '账号已存在'))
      }
    }
  })
})

router.post('/queryUser', (req, res, next) => {
  const userId = req.body.userId
  const sql = `SELECT * FROM mydb.user WHER id='${userId}'`
  connection.query(sql, (err, data) => {
    if (err) {
      sqlErr(req)
    } else {
      if (data) {
        res.json({...data[0]})
      } else {
        res.json(createRes(201, null, '用户不存在'))
      }
    }
  })
})

router.post('/delUser', (req, res, next) => {
  const userId = req.body.userId
  const sql = `DELETE * FROM mydb.user WHER id='${userId}'`
  connection.query(sql, (err, data) => {
    if (err) {
      sqlErr(req)
    } else {
      if (data) {
        res.json({...data[0]})
      } else {
        res.json(createRes(201, null, '用户不存在'))
      }
    }
  })
})
module.exports = router;
