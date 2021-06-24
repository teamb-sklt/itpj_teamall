var express = require('express');
var router = express.Router();
var {Client}=require('pg');

require('dotenv').config();
const nodemailer = require('nodemailer');
const user=process.env.USER;
const dbpassword=process.env.PASSWORD;

var today=new Date();
var year=today.getFullYear();
var month=today.getMonth()+1;
var date=today.getDate();
if(date<21){
  tmonth=('00'+month).slice(-2);
}else{
  tmonth=('00'+(month+1)).slice(-2);
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
  }) : new Client({
    user: user,
    host: 'localhost',
    database: 'itpjph3',
    password: dbpassword,
    port: 5432
  })
  await client.connect()
  //console.log(client)
  client.query('SELECT * from Employee', function(err, result){
    if (err){
      console.log(err) //show error infomation
    }
    //console.log(result)
    for(var i of result.rows){
      //console.log(i)                  
    }
    let shain = result.rows
    for(let i = 0; i <= result.rows; i++){
    shain.push(result.rows[i])
  }

  client.query("SELECT * from ExDetail where sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
    //console.log(tmonth);
    if (err){
      console.log(err) //show error infomation
    }
    //console.log(result)
    for(var i of result.rows){
      //console.log(i)                  
    }
    let rireki = result.rows
    for(let i = 0; i <= result.rows; i++){
    rireki.push(result.rows[i])
  }
  client.end()
  let opt={
    title:'リマインド - 経費',
    shain:shain,
    rireki:rireki,
    year:year,
    month:tmonth
  }
  res.render('remind_ex', opt);  
  });
  });
});

/* POST home page. */
router.post('/', async function(req, res, next) {
  if(req.body.display){
    year=req.body.year;
    tmonth=req.body.month;
    //console.log(req.body);
    const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
    }) : new Client({
      user: user,
      host: 'localhost',
      database: 'itpjph3',
      password: dbpassword,
      port: 5432
    })
    await client.connect()
    //console.log(client)
    client.query("SELECT * from Employee where "+req.body.employee, function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let shain = result.rows
      for(let i = 0; i <= result.rows; i++){
      shain.push(result.rows[i])
    }
    //console.log(shain);
  
    client.query("SELECT * from ExDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let rireki = result.rows
      for(let i = 0; i <= result.rows; i++){
      rireki.push(result.rows[i])
    }
    //console.log(rireki);
    client.end()
    let opt={
      title:'リマインド - 経費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('remind_ex', opt);  
    });
    });

  }else if(req.body.last){
    if(req.body.month===1){
      year=req.body.year-1;
    }else{
      year=req.body.year;
    }
    if(req.body.month===1){
      tmonth=12;
    }else{
      tmonth=('00'+(req.body.month-1)).slice(-2);
    }
    //console.log(req.body);
    const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
    }) : new Client({
      user: user,
      host: 'localhost',
      database: 'itpjph3',
      password: dbpassword,
      port: 5432
    })
    await client.connect()
    //console.log(client)
    client.query("SELECT * from Employee where "+req.body.employee, function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let shain = result.rows
      for(let i = 0; i <= result.rows; i++){
      shain.push(result.rows[i])
    }
    //console.log(shain);
  
    client.query("SELECT * from ExDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month='"+tmonth+"'", function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let rireki = result.rows
      for(let i = 0; i <= result.rows; i++){
      rireki.push(result.rows[i])
    }
    //console.log(rireki);
    client.end()
    let opt={
      title:'リマインド - 経費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('remind_ex', opt);  
    });
    });

  }else if(req.body.next){
    if(req.body.month===12){
      year=Number(req.body.year)+1;
    }else{
      year=req.body.year;
    }
    if(req.body.month===12){
      tmonth=01;
    }else{
      tmonth=('00'+(Number(req.body.month)+1)).slice(-2);
    }
    //console.log(req.body);
    const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
    }) : new Client({
      user: user,
      host: 'localhost',
      database: 'itpjph3',
      password: dbpassword,
      port: 5432
    })
    await client.connect()
    //console.log(client)
    client.query("SELECT * from Employee where "+req.body.employee, function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let shain = result.rows
      for(let i = 0; i <= result.rows; i++){
      shain.push(result.rows[i])
    }
    //console.log(shain);
  
    client.query("SELECT * from ExDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let rireki = result.rows
      for(let i = 0; i <= result.rows; i++){
      rireki.push(result.rows[i])
    }
    //console.log(rireki);
    client.end()
    let opt={
      title:'リマインド - 経費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('remind_ex', opt);  
    });
    });

  }else if(req.body.decide){
      year=req.body.year;
      tmonth=req.body.month;
      //console.log(req.body)
    const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
    }) : new Client({
      user: user,
      host: 'localhost',
      database: 'itpjph3',
      password: dbpassword,
      port: 5432
    })
    await client.connect()
    //console.log(client)
    client.query("SELECT * from Employee", function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let shain = result.rows
      for(let i = 0; i <= result.rows; i++){
      shain.push(result.rows[i])
    }
    //console.log(shain);
  
    client.query("SELECT * from ExDetail where sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let rireki = result.rows
      for(let i = 0; i <= result.rows; i++){
      rireki.push(result.rows[i])
    }
    //console.log(rireki);
    client.end()
    let opt={
      title:'リマインド - 経費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('remind_ex', opt);  
    });
    });
  }
});

  router.post('/post', async (req, res, next)=>{
    var address = [req.body.checks];
    console.log(address);
    var text = [req.body.textarea];
    //console.log(text);
    var string= String(text);
    console.log(string);
  
    //var receiverEmailAddress = address //ここは自分のメールアドレスにしてください。じゃないと僕に大量にメールが届くので・・・
    var receiverEmailAddress = address
    var senderEmailAddress = 'test.itpj@gmail.com' //テスト用のアカウント（変更しないでください）
    var senderEmailPassword = 'ogrsnpgudnugutav'　//テスト用のアカウントのアプリPW（変更しないでください）
  
    //SMTPサーバの基本情報設定
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: senderEmailAddress,
        pass: senderEmailPassword
      }
    });
  
    //メール情報の作成
    var mailOptions1 = {
      from: senderEmailAddress,
      to: receiverEmailAddress,
      subject: '【経費申請】未申請のデータがあります',　//件名
      text: string　//本文
    };
  
  　//メール情報の作成
    transporter.sendMail(mailOptions1, function (error, info) {
      if (error) {
        console.log('失敗');
      } else {
        console.log('成功');
      }
      res.redirect('/remind_ex'); 
    });  
  });
  
  module.exports = router;