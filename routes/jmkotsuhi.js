const { text } = require('express');
const { response } = require('express');
var express = require('express');
var nodemailer = require('nodemailer');
const { options } = require('.');
var router = express.Router();
var {Client}=require('pg');


//日付け取得　※交通費画面起動の際、〇/21～〇/20分のみ表示するために定義
var date = new Date();
var yyyy = date.getFullYear();
var mm = ("0"+(date.getMonth()+1)).slice(-2);//先月
var nn = ("0"+(date.getMonth()+2)).slice(-2);//今月
var dd = ("0"+date.getDate()).slice(-2);

if (dd<21) { // 例) 5/21~5/31の時→5/21~6/20表示、6/1~6/20の時→5/21~6/20表示
    mm -= 1
    nn -= 1
}
if (mm === 1 && dd<21) {
    yyyy -=1
}

/* ページが読み込まれたとき */
router.get('/', async function(req, res, next) {

  //DBに接続
  var client =new Client({
    user:'postgres',
    host:'localhost',
    database:'itpjph3',
    password:'Psklt@363',
    port:5432,
  });

  nn = nn-1+1;
  mm = mm-1+1;

  //「承認期間中のもの」かつ「社員IDが自分のもの」かつ「JM承認中のステータス」の条件でデータを指定して、ejsに渡す
  // let sql = "SELECT * FROM tedetail WHERE job_manager='111' AND status='11' ORDER BY emp_no ASC,sheet_year ASC,sheet_month ASC,branch_no ASC,job_no ASC";
  let sql = "SELECT * FROM tedetail WHERE job_manager='111' AND (year='"+yyyy+"' AND month='0"+mm+"' AND day BETWEEN '21' AND '31') OR (year='"+yyyy+"' AND month='0"+nn+"' AND day BETWEEN '1' AND '20') AND status='11' ORDER BY emp_no ASC,sheet_year ASC,sheet_month ASC,branch_no ASC,job_no ASC";
  console.log(sql);

  //これは必ず必要
  await client.connect();

  client.query(sql,(err,result)=>{

    //定義
    var emp_no=[];
    var sheet_year=[];
    var sheet_month=[];
    var branch_no=[];
    var year=[];
    var month=[];
    var day=[];
    var trans_type=[];
    var trans_from=[];
    var trans_to=[];
    var trans_waypoint=[];
    var amount=[];
    var count=[];
    var job_no=[];
    var job_manager=[];
    var claim_flag=[];
    var charge_flag=[];
    var ref_no=[];
    var status=[];
    var remarks=[];
    var new0=[];
    var new_date=[];
    var renew=[];
    var renew_date=[];
    var radioname=[];
    var hiddenmonth=[];

    for(var i in result.rows){
    
      status[i]=result.rows[i].status; 
      ref_no[i]=result.rows[i].ref_no;
      trans_type[i]=result.rows[i].trans_type;
      trans_from[i]=result.rows[i].trans_from;
      trans_to[i]=result.rows[i].trans_to;
      day[i]=result.rows[i].month + '/' +result.rows[i].day;
      amount[i]=result.rows[i].amount;
      count[i]=result.rows[i].count;
      claim_flag[i]=result.rows[i].claim_flag;
      charge_flag[i]=result.rows[i].charge_flag;      
      remarks[i]=result.rows[i].remarks;
      radioname[i]='radioname' +[i];
      job_no[i]=result.rows[i].job_no;   
      emp_no[i]=result.rows[i].emp_no;
      
    } //for締める

    client.end();


// for (let i = 0; i < status.length; i++) {
//   console.log(status[i]);

//   if(status==='00'){
//     return status[i] = '未申請';
//   }
//   else if(status==='11'){
//     return status[i] = 'JM申請中';
//   }
//   else if(status==='19'){
//     return status[i] = 'JM却下';
//   }
//   else if(status==='21'){
//     return status[i] = '経理申請中';
//   }
//   else if(status==='29'){
//     return status[i] = '経理却下';
//   }
//   else if(status==='88'){
//     return status[i] = '承認';
//   }

// }

    let opt ={
      title:'JM承認画面',
      h3:nn+'月分の申請データを表示しています',
      day:day,
      trans_type:trans_type,
      trans_from:trans_from,
      trans_to:trans_to,
      amount:amount,
      count:count, 
      subtotal:amount,
      claim_flag:claim_flag,
      charge_flag:charge_flag,
      ref_no:ref_no,
      status:status,
      remarks:remarks,
      radioname:radioname,
      hiddenmonth:nn,
      job_no:job_no,
      emp_no:emp_no,
    }

    //レンダーする
    res.render('jmkotsuhi', opt);

  });//client.connect締める
});//router.get締める




router.post('/',async function(req,response,next){


  //先月データボタンを押したとき
  if(req.body.previousmonth){
    nn = nn -1;
    mm = mm -1;

    //DBに接続
    var client =new Client({
      user:'postgres',
      host:'localhost',
      database:'itpjph3',
      password:'Psklt@363',
      port:5432,
    });

    // client.connect();   //これは必ず必要

    //「承認期間中のもの」かつ「社員IDが自分のもの」かつ「JM承認中のステータス」の条件でデータを指定して、ejsに渡す
    // let sql = "SELECT * FROM tedetail WHERE job_manager='111' AND status='11' ORDER BY emp_no ASC,sheet_year ASC,sheet_month ASC,branch_no ASC,job_no ASC";
    let sql = "SELECT * FROM tedetail WHERE job_manager='111' AND (year='"+yyyy+"' AND month='0"+mm+"' AND day BETWEEN '21' AND '31') OR (year='"+yyyy+"' AND month='0"+nn+"' AND day BETWEEN '1' AND '20') AND status='11' ORDER BY emp_no ASC,sheet_year ASC,sheet_month ASC,branch_no ASC,job_no ASC";
    console.log(sql);

    //これは必ず必要
    await client.connect();

    client.query(sql,(err,result)=>{

      //定義
      var emp_no=[];
      var sheet_year=[];
      var sheet_month=[];
      var branch_no=[];
      var year=[];
      var month=[];
      var day=[];
      var trans_type=[];
      var trans_from=[];
      var trans_to=[];
      var trans_waypoint=[];
      var amount=[];
      var count=[];
      var job_no=[];
      var job_manager=[];
      var claim_flag=[];
      var charge_flag=[];
      var ref_no=[];
      var status=[];
      var remarks=[];
      var new0=[];
      var new_date=[];
      var renew=[];
      var renew_date=[];
      var radioname=[];
      var hiddenmonth=[];

      for(var i in result.rows){
      
        status[i]=result.rows[i].status; 
        ref_no[i]=result.rows[i].ref_no;
        trans_type[i]=result.rows[i].trans_type;
        trans_from[i]=result.rows[i].trans_from;
        trans_to[i]=result.rows[i].trans_to;
        day[i]=result.rows[i].month + '/' +result.rows[i].day;
        amount[i]=result.rows[i].amount;
        count[i]=result.rows[i].count;
        claim_flag[i]=result.rows[i].claim_flag;
        charge_flag[i]=result.rows[i].charge_flag;      
        remarks[i]=result.rows[i].remarks;
        radioname[i]='radioname' +[i];
        job_no[i]=result.rows[i].job_no;
        emp_no[i]=result.rows[i].emp_no;

      } //for締める

      client.end();

      let opt1 ={
        title:'JM承認画面',
        h3:nn + '月分の申請データを表示しています',
        day:day,
        trans_type:trans_type,
        trans_from:trans_from,
        trans_to:trans_to,
        amount:amount,
        count:count, 
        subtotal:amount*count,
        claim_flag:claim_flag,
        charge_flag:charge_flag,
        ref_no:ref_no,
        status:status,
        remarks:remarks,
        radioname:radioname,
        hiddenmonth:nn,
        job_no:job_no,
        emp_no:emp_no,
      }

      //レンダーする
      response.render('jmkotsuhi', opt1);

    });//client.query締める
  } //req.body.previousmonth締める


  //次月データボタンを押したとき
  else if(req.body.nextmonth){
    nn = nn -1+2;
    mm = mm -1+2;

    //DBに接続
    var client =new Client({
      user:'postgres',
      host:'localhost',
      database:'itpjph3',
      password:'Psklt@363',
      port:5432,
    });

    //「承認期間中のもの」かつ「社員IDが自分のもの」かつ「JM承認中のステータス」の条件でデータを指定して、ejsに渡す
    // let sql = "SELECT * FROM tedetail WHERE job_manager='111' AND status='11' ORDER BY emp_no ASC,sheet_year ASC,sheet_month ASC,branch_no ASC,job_no ASC";
    let sql = "SELECT * FROM tedetail WHERE job_manager='111' AND (year='"+yyyy+"' AND month='0"+mm+"' AND day BETWEEN '21' AND '31') OR (year='"+yyyy+"' AND month='0"+nn+"' AND day BETWEEN '1' AND '20') AND status='11' ORDER BY emp_no ASC,sheet_year ASC,sheet_month ASC,branch_no ASC,job_no ASC";
    console.log(sql);
    
    //これは必ず必要
    await client.connect();

    client.query(sql,(err,result)=>{

      //定義
      var emp_no=[];
      var sheet_year=[];
      var sheet_month=[];
      var branch_no=[];
      var year=[];
      var month=[];
      var day=[];
      var trans_type=[];
      var trans_from=[];
      var trans_to=[];
      var trans_waypoint=[];
      var amount=[];
      var count=[];
      var job_no=[];
      var job_manager=[];
      var claim_flag=[];
      var charge_flag=[];
      var ref_no=[];
      var status=[];
      var remarks=[];
      var new0=[];
      var new_date=[];
      var renew=[];
      var renew_date=[];
      var radioname=[];
      var hiddenmonth=[];
      
      for(var i in result.rows){
      
        status[i]=result.rows[i].status; 
        ref_no[i]=result.rows[i].ref_no;
        trans_type[i]=result.rows[i].trans_type;
        trans_from[i]=result.rows[i].trans_from;
        trans_to[i]=result.rows[i].trans_to;
        day[i]=result.rows[i].month + '/' +result.rows[i].day;
        amount[i]=result.rows[i].amount;
        count[i]=result.rows[i].count;
        claim_flag[i]=result.rows[i].claim_flag;
        charge_flag[i]=result.rows[i].charge_flag;      
        remarks[i]=result.rows[i].remarks;
        radioname[i]='radioname' +[i];
        job_no[i]=result.rows[i].job_no;
        emp_no[i]=result.rows[i].emp_no;

      } //for締める

      client.end();

      let opt2 ={
        title:'JM承認画面',
        h3:nn + '月分の申請データを表示しています',
        day:day,
        trans_type:trans_type,
        trans_from:trans_from,
        trans_to:trans_to,
        amount:amount,
        count:count, 
        subtotal:amount*count,
        claim_flag:claim_flag,
        charge_flag:charge_flag,
        ref_no:ref_no,
        status:status,
        remarks:remarks,
        radioname:radioname,
        hiddenmonth:nn,
        job_no:job_no,
        emp_no:emp_no,
      }

      //レンダーする
      response.render('jmkotsuhi', opt2);
    
    });//client.query締める
  } //req.body.nextmonth締める


  //確定ボタンが押されたとき
  else if(req.body.confirm){

    //メール送信機能
    function mailsend(sub,tex){
      //メール送信者・受信者・PWの設定
      var receiverEmailAddress = 'achijiiwa@skylight.co.jp'
      var senderEmailAddress = 'test.itpj@gmail.com'
      var senderEmailPassword = 'ogrsnpgudnugutav'
    
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
        subject: sub,
        text: tex
      };
    
      // メールの送信
      transporter.sendMail(mailOptions1, function (error, info) {
        if (error) {console.log('失敗');} 
        else {console.log('成功');}
      });

    }//function mail.sendを締める

    //for文で回すために、連想配列(req.body)を配列に変換している
    for(let [key, value] of Object.entries(req.body)){

      //承認にチェックがあるとき
      if(value==='1'){
        mailsend('【EX WEB】承認のお知らせ','交通費申請項目の中に承認されたものがあります（ジョブマネジャーによる承認）。内容をご確認ください。');}
      //却下にチェックがあるとき
      else if(value==='2'){
        mailsend('【EX WEB】却下のお知らせ','交通費申請項目の中に却下されたものがあります（ジョブマネジャーによる却下）。内容をご確認ください。');}

    };//for文を締める

    //DBに接続
    var client =new Client({
      user:'postgres',
      host:'localhost',
      database:'itpjph3',
      password:'Psklt@363',
      port:5432,
    });

    nn = nn-1+1;
    mm = mm-1+1;

    //「承認期間中のもの」かつ「社員IDが自分のもの」かつ「JM承認中のステータス」の条件でデータを指定して、ejsに渡す
    let sql = "SELECT * FROM tedetail WHERE job_manager='111' AND (year='"+yyyy+"' AND month='0"+mm+"' AND day BETWEEN '21' AND '31') OR (year='"+yyyy+"' AND month='0"+nn+"' AND day BETWEEN '1' AND '20') AND status='11' ORDER BY emp_no ASC,sheet_year ASC,sheet_month ASC,branch_no ASC,job_no ASC";
    console.log(sql);

    //これは必ず必要
    await client.connect();

    client.query(sql,(err,result)=>{

      //定義
      var emp_no=[];
      var sheet_year=[];
      var sheet_month=[];
      var branch_no=[];
      var year=[];
      var month=[];
      var day=[];
      var trans_type=[];
      var trans_from=[];
      var trans_to=[];
      var trans_waypoint=[];
      var amount=[];
      var count=[];
      var job_no=[];
      var job_manager=[];
      var claim_flag=[];
      var charge_flag=[];
      var ref_no=[];
      var status=[];
      var remarks=[];
      var new0=[];
      var new_date=[];
      var renew=[];
      var renew_date=[];
      var radioname=[];
      var hiddenmonth=[];

      for(var i in result.rows){
      
        status[i]=result.rows[i].status; 
        ref_no[i]=result.rows[i].ref_no;
        trans_type[i]=result.rows[i].trans_type;
        trans_from[i]=result.rows[i].trans_from;
        trans_to[i]=result.rows[i].trans_to;
        day[i]=result.rows[i].month + '/' +result.rows[i].day;
        amount[i]=result.rows[i].amount;
        count[i]=result.rows[i].count;       
        claim_flag[i]=result.rows[i].claim_flag;
        charge_flag[i]=result.rows[i].charge_flag;      
        remarks[i]=result.rows[i].remarks;
        radioname[i]='radioname' +[i];
        job_no[i]=result.rows[i].job_no;   
        emp_no[i]=result.rows[i].emp_no;

      } //for締める

      client.end();

      let opt ={
        title:'JM承認画面',
        h3:nn+'月分の申請データを表示しています',
        day:day,
        trans_type:trans_type,
        trans_from:trans_from,
        trans_to:trans_to,
        amount:amount,
        count:count, 
        subtotal:amount*count,
        claim_flag:claim_flag,
        charge_flag:charge_flag,
        ref_no:ref_no,
        status:status,
        remarks:remarks,
        radioname:radioname,
        hiddenmonth:nn,
        job_no:job_no,
        emp_no:emp_no,
      }

      //レンダーする
      response.render('jmkotsuhi', opt);

    });//client.connect締める
 } //if(req.body.confirm)を締める
}) //router.post締める










//const user=process.env.USER;
//const dbpassword=process.env.PASSWORD;
// console.log(dbpassword);


/* Heroku・Postgres接続*/
 /*router.get('/', function(req, res, next) {
  const client =
   (process.env.ENVIRONMENT == "LIVE") ? new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
  }) :
    new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'TeDetail',
    password: dbpassword,
    port: 5432
})
 client.conect()　*/

//  router.get('/',async function(req, res, next) { 


  //交通費画面起動時 
  // client.connect(async function(err, client) {
  //   if (err) {
  //     console.log(err); 
  //   } else {
  //     client.query("SELECT * FROM tedetail WHERE job_manager='1' AND (year="+yyyy+" AND month="+mm+" AND day BETWEEN '21' AND '31') OR (year="+yyyy+" AND month="+nn+" AND day BETWEEN '1' AND '20') AND status='11' ORDER BY emp_no ASC,sheet_year ASC,sheet_month ASC,branch_no ASC,job_no ASC", function (err, result) {  //第１引数にSQL
  //      for(var i in result.rows){
  //           emp_no[i]=result.rows[i].emp_no;
  //           sheet_year[i]=result.rows[i].sheet_year;
  //           sheet_month[i]=result.rows[i].sheet_month;
  //           branch_no[i]=result.rows[i].branch_no;
  //           year[i]=result.rows[i].year;
  //           month[i]=result.rows[i].month;
  //           day[i]=result.rows[i].day;
  //           trans_type[i]=result.rows[i].trans_type;
  //           trans_from[i]=result.rows[i].trans_from;
  //           trans_to[i]=result.rows[i].trans_to;
  //           trans_waypoint[i]=result.rows[i].trans_waypoint
  //           amount[i]=result.rows[i].amount;
  //           count[i]=result.rows[i].count;
  //         　job_no[i]=result.rows[i].job_no;
  //           job_manager[i]=result.rows[i].job_manager;        
  //           claim_flag[i]=result.rows[i].claim_flag;
  //           charge_flag[i]=result.rows[i].charge_flag;
  //         　ref_no[i]=result.rows[i].ref_no;
  //           status[i]=result.rows[i].status;       
  //           remarks[i]=result.rows[i].remarks;
  //           new0[i]=result.rows[i].new;
  //           new_date[i]=result.rows[i].new_date;
  //           renew[i]=result.rows[i].renew;
  //           renew_date[i]=result.rows[i].renew_date;
  //         }
  //       });

  // console.log(amount)
  // console.log(count)

  // total=amount * count;//合計金額を算出する為に記述したがNullで値が返ってくる

  // let opt ={
  //     title:'JM承認画面',
  //     h3:'日付',
  //     emp_no:emp_no,
  //     sheet_year:sheet_year,
  //     sheet_month:sheet_month,
  //     branch_no:branch_no,
  //     year:year,
  //     month:month,
  //     day:day,
  //     trans_type:trans_type,
  //     trans_from:trans_from,
  //     trans_to:trans_to,
  //     trans_waypoint:trans_waypoint,
  //     amoun:amoun,
  //     count:count,
  //     job_no:job_no,
  //     job_manager:job_manager,
  //     claim_flag:claim_flag,
  //     charge_flag:charge_flag,
  //     ref_no:ref_no,
  //     status:status,
  //     remarks:remarks,
  //     new0:new0,
  //     new_date:new_date,
  //     renew:renew,
  //     renew_date:renew_date,
  //       }

  //   res.render('jmkotsuhi',opt);
  // }
  // });

  //確定ボタン押下時にjmkotsuhiから情報取得してtecommentへINSERTする文
  // router.post('/',async function(req,res,next){
  //   let emp_no1=req.body.emp_no;
  //   let sheet_year1=req.body.sheet_year;
  //   let sheet_month1=req.body.sheet_month;
  //   let branch_no1=req.body.branch_no;
  //   let app_class1=req.body.app_class;
  //   let job_manager1=req.body.job_manager;
  //   let app_flag1=req.body.app_flag;
  //   let comment1=req.body.comment;
  //   let new1=req.body.new;
  //   let new_date1=req.body.new_date;
  //   let renew1=req.body.renew;
  //   var renew_date1=req.body.renew_date;
  
  //   const query = {
  //     text: 'INSERT INTO tecomments(emp_no, sheet_year, sheet_month, branch_no, app_class, job_manager, app_flag, comment, new, new_date, renew, renew_date) VALUES($1, $2, $3, $4 ,$5, $6 ,$7 ,$8 ,$9, $10, $11, $12)',
  //     values: [emp_no1, sheet_year1, sheet_month1, branch_no1, app_class1, job_manager1, app_flag1, comment1, new1, new_date1, renew1, renew_date1],
  //   }
 
  //   client.query(query)
  //   .then(res => console.log(res.rows[0]))
  //   .catch(e => console.error(e.stack))
  
  //   response.redirect("/jmkotsuhi");
  // })
// }); 


module.exports = router;