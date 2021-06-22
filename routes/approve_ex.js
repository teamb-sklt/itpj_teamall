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

  client.query("SELECT * from ExDetail where sheet_year='"+year+"' and sheet_month= '"+tmonth+"'", function(err, result){
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
      title:'経費承認',
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
      title:'経費承認',
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
      title:'経費承認',
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
    await client.connect()
    console.log(client)
    //approve
    if(req.body.approve.length===1){
      var app=req.body.approve;
      client.query("UPDATE ExDetail set status='88' where "+app, function(err, result){
        if (err){
          console.log(err) //show error infomation
        }
      });
    }else if(req.body.approve.length>1){
      var app=[];
      for(let i in req.body.approve){
        app.push(req.body.approve[i]);
      }
      var app2=app.join(" or ");
        client.query("UPDATE ExDetail set status='88' where "+app2, function(err, result){
          if (err){
            console.log(err) //show error infomation
          }
        });
    }
    //deny
    if(req.body.deny!==undefined){
      if(req.body.deny.length===1){
        var den=req.body.deny;
        client.query("UPDATE ExDetail set status='29' where "+den, function(err, result){
          if (err){
            console.log(err) //show error infomation
          }
        });
      }else if(req.body.deny.length>1){
        var den=[];
        for(let i in req.body.deny){
          app.push(req.body.deny[i]);
        }
        var den2=den.join(" or ");
          client.query("UPDATE ExDetail set status='29' where "+den2, function(err, result){
            if (err){
              console.log(err) //show error infomation
            }
          });
      }

      }
    // //コメント(コメントテーブルにinsert,詳細テーブル備考をアップデート)
    // for(let i=0;i<req.body.length;i++){
    //   client.query("UPDATE ExComments set comment=comment+'経理:'+'"+req.body.comment[i]+"',app_class='2' where "+req.body.approve[i], function(err, result){
    //     if (err){
    //       console.log(err) //show error infomation
    //     }
    //   });
  
    // }

    client.end();
    res.redirect('/approve_ex');

  }

});


module.exports = router;
