class creatError {
  constructor(code, data, msg) { 
    this.code = code
    this.data = data
    this.msg = msg
  }
  
}

const createRes = (code, data, msg) => {
  return {
    code: code || 200,
    data: data,
    msg: msg
  }
}
module.exports = createRes