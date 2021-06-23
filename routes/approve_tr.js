var express = require('express');
var router = express.Router();
var {Client}=require('pg');

require('dotenv').config();
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
    console.log(result)
    for(var i of result.rows){
      console.log(i)                  
    }
    let shain = result.rows
    for(let i = 0; i <= result.rows; i++){
    shain.push(result.rows[i])
  }

  client.query("SELECT * from TeDetail where sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
    console.log(tmonth);
    if (err){
      console.log(err) //show error infomation
    }
    console.log(result)
    for(var i of result.rows){
      console.log(i)                  
    }
    let rireki = result.rows
    for(let i = 0; i <= result.rows; i++){
    rireki.push(result.rows[i])
  }
  client.end()
  let opt={
    title:'経理承認 - 交通費',
    shain:shain,
    rireki:rireki,
    year:year,
    month:tmonth
  }
  res.render('approve_tr', opt);  
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
  
    client.query("SELECT * from TeDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
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
      title:'経理承認 - 交通費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('approve_tr', opt);  
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
  
    client.query("SELECT * from TeDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month='"+tmonth+"'", function(err, result){
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
      title:'経理承認 - 交通費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('approve_tr', opt);  
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
  
    client.query("SELECT * from TeDetail where "+req.body.employee+" and "+req.body.status+" and sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
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
      title:'経理承認 - 交通費',
      shain:shain,
      rireki:rireki,
      year:year,
      month:tmonth  
    }
    res.render('approve_tr', opt);  
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
    await client.connect()
    console.log(client)
    //approve
    if(req.body.approve.length===1){
      var app=req.body.approve;
      client.query("UPDATE TeDetail set status='88' where "+app, function(err, result){
        if (err){
          console.log(err) //show error infomation
        }
      });
    }else if(req.body.approve.length>1){
      var app=[];
      for(let i in req.body.approve){
        app.push(req.body.approve[i]);
        client.query("UPDATE TeDetail set status='88' where "+app[i], function(err, result){
          if (err){
            console.log(err) //show error infomation
          }
        });
      }
    }
    //deny
    if(req.body.deny!==undefined){
      for(let i of req.body.deny){
        client.query("UPDATE TeDetail set status='29' where "+req.body.deny[i], function(err, result){
          if (err){
            console.log(err) //show error infomation
          }
        });
    
      }  
    }
    //コメント(コメントテーブルにinsert,詳細テーブル備考をアップデート)
    // for(var i;i<req.body.length;i++){
    //   client.query("UPDATE ExDetail set status='88' where "+req.body.approve[i], function(err, result){
    //     if (err){
    //       console.log(err) //show error infomation
    //     }
    //   });
  
    // }

    client.end();
    res.redirect('/approve_tr');

  }

});


module.exports = router;
