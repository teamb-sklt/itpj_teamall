var express = require('express');
var router = express.Router();
var {Client}=require('pg');

require('dotenv').config();
const nodemailer = require('nodemailer');
const user=process.env.USER;
const dbpassword=process.env.PASSWORD;

//メールアドレス
var receiverEmailAddress = 'rsasaki@skylight.co.jp' //ここは自分のメールアドレスにしてください。じゃないと僕に大量にメールが届くので・・・
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
  year=today.getFullYear();
  date=today.getDate();
  if(date<21){
    tmonth=('00'+month).slice(-2);
  }else{
    tmonth=('00'+(month+1)).slice(-2);
  }  
  const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
  }) : new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'itpjph3',
    password: dbpassword,
    port: 5432
  })
  await client.connect()
  console.log(client)
  client.query('SELECT * from Employee', function(err, result){
    if (err){
      console.log(err) //show error infomation
    }
    // console.log(result)
    // for(var i of result.rows){
    //   console.log(i)                  
    // }
    let shain = result.rows
    for(let i = 0; i <= result.rows; i++){
    shain.push(result.rows[i])
  }

  client.query("SELECT * from ExDetail where sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
    // console.log(tmonth);
    if (err){
      console.log(err) //show error infomation
    }
    // console.log(result)
    // for(var i of result.rows){
    //   console.log(i)                  
    // }
    let rireki = result.rows
    for(let i = 0; i <= result.rows; i++){
    rireki.push(result.rows[i])
  }
  client.end()
  let opt={
    title:'経理承認 - 経費',
    shain:shain,
    rireki:rireki,
    year:year,
    month:tmonth
  }
  res.render('approve_ex', opt);  
  });
  });
});

/* POST home page. */
router.post('/', async function(req, res, next) {
  if(req.body.display){
    year=req.body.year;
    tmonth=req.body.month;
    console.log(req.body);
    const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
    }) : new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'itpjph3',
      password: dbpassword,
      port: 5432
    })
    await client.connect()
    console.log(client)
    client.query("SELECT * from Employee where "+req.body.employee, function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let shain = result.rows
      for(let i = 0; i <= result.rows; i++){
      shain.push(result.rows[i])
    }
    console.log(shain);
  
    client.query("SELECT * from ExDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let rireki = result.rows
      for(let i = 0; i <= result.rows; i++){
      rireki.push(result.rows[i])
    }
    console.log(rireki);
    client.end()
    let opt={
      title:'経理承認 - 経費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('approve_ex', opt);  
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
    console.log(req.body);
    const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
    }) : new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'itpjph3',
      password: dbpassword,
      port: 5432
    })
    await client.connect()
    console.log(client)
    client.query("SELECT * from Employee where "+req.body.employee, function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let shain = result.rows
      for(let i = 0; i <= result.rows; i++){
      shain.push(result.rows[i])
    }
    console.log(shain);
  
    client.query("SELECT * from ExDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month='"+tmonth+"'", function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let rireki = result.rows
      for(let i = 0; i <= result.rows; i++){
      rireki.push(result.rows[i])
    }
    console.log(rireki);
    client.end()
    let opt={
      title:'経理承認 - 経費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('approve_ex', opt);  
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
    console.log(req.body);
    const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
    }) : new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'itpjph3',
      password: dbpassword,
      port: 5432
    })
    await client.connect()
    console.log(client)
    client.query("SELECT * from Employee where "+req.body.employee, function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let shain = result.rows
      for(let i = 0; i <= result.rows; i++){
      shain.push(result.rows[i])
    }
    console.log(shain);
  
    client.query("SELECT * from ExDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      let rireki = result.rows
      for(let i = 0; i <= result.rows; i++){
      rireki.push(result.rows[i])
    }
    console.log(rireki);
    client.end()
    let opt={
      title:'経理承認 - 経費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('approve_ex', opt);  
    });
    });

  }else if(req.body.decide){
      year=req.body.year;
      tmonth=req.body.month;
      console.log(req.body)
    const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
    }) : new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'itpjph3',
      password: dbpassword,
      port: 5432
    })

    var app2;
    var den2;
    //approve
    if(req.body.approve!==undefined){
      if(req.body.approve[0].length===1){
        app2=req.body.approve;
      }else if(req.body.approve.length>1){
        var app=[];
        for(let i in req.body.approve){
          app.push(req.body.approve[i]);
        }
        app2=app.join(" or ");
      }
    }

    //deny
    if(req.body.deny!==undefined){
      if(req.body.deny[0].length===1){
        den2=req.body.deny;
      }else if(req.body.deny.length>1){
        var den=[];
        for(let i in req.body.deny){
          den.push(req.body.deny[i]);
        }
        den2=den.join(" or ");
      }
    }
    
    //comment
    var com2=[];
    var com4=[];
    for(let i=0;i<req.body.comment.length;i++){
      if(req.body.comment[i]!==''){
        var com="WHEN emp_no='"+req.body.emp_no[i]+"' AND sheet_year='"+req.body.year[i]+"' AND sheet_month='"+req.body.month[i]+"' AND branch_no='"+req.body.branch_no[i]+"' THEN CONCAT(comment,'/経理："+req.body.comment[i]+"')";
        var com3="WHEN emp_no='"+req.body.emp_no[i]+"' AND sheet_year='"+req.body.year[i]+"' AND sheet_month='"+req.body.month[i]+"' AND branch_no='"+req.body.branch_no[i]+"' THEN '2'";
        com2.push(com);
        com4.push(com3);
      }
    }
    var com5=com2.join(" ");
    var com6=com4.join(" ");

    await client.connect()
    console.log(client);
    console.log(app2);
    console.log(den2);
    console.log(com5);
    console.log(com6);

    if(app2){
      var appup="UPDATE ExDetail set status='88' where "+app2+";";
    }else{
      var appup="";
    }
    if(den2){
      var denup="UPDATE ExDetail set status='29' where "+den2+";";
    }else{
      var denup="";
    }
    if(com5){
      var comup="UPDATE ExComments SET comment=CASE "+com5+" ELSE comment END, app_class=CASE "+com6+" ELSE app_class END, app_flag=CASE "+com6+" ELSE app_flag END";
    }else{
      var comup="";
    }
    console.log(appup+denup+comup);

    client.query(appup+denup+comup, function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
    });
    client.end();
    res.redirect('/approve_ex');

    /* client.query(appup+denup+comup, function(err, result){
      if (err){
        console.log(err) //show error infomation
      }
      var mailadd=[]
      for(let i in req.body.approve){
        mailadd[i]=str.req.body.approve[i](8,5);
      }
      console.log(mailadd);
        //メール情報の作成
    //   var mailOptions1 = {
    //   from: senderEmailAddress,
    //   to: receiverEmailAddress,
    //   subject: '経理承認のお知らせ',　//件名
    //   text: '申請したレコードが経理によって承認されました'　//本文
    //   };
    //   var mailOptions2 = {
    //     from: senderEmailAddress,
    //     to: receiverEmailAddress,
    //     subject: '経理却下のお知らせ',　//件名
    //     text: '申請したレコードが経理によって却下されました'　//本文
    //     };
  

      //メール情報の作成
      // transporter.sendMail(mailOptions1, function (error, info) {
      //   if (error) {
      //   console.log('失敗');
      //   } else {
      //   console.log('成功');
      // }
      // });

    });
    console.log(1);


    client.end();
    res.redirect('/approve_ex');
 */
  }

});


module.exports = router;
