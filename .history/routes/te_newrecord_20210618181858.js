const { response } = require('express');
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
var { Client, Client } = require('pg');
require('dotenv').config();
const user=process.env.USER;
const dbpassword=process.env.PASSWORD;

//ページが読み込まれた際の初期画面
router.get('/',function(req,res,next){

    let opt = {
        title: '（交通費）新規登録ページ',
        message: '各項目を入力してください',
        price: 'placeholder="自動計算（ICカード利用時料金）"',
        moveDate:'placeholder="移動した日付・時刻が自動で追加されます"',
        year: '',
        month:'',
        day:'',
        sStart: '',
        sWaypoint: '',
        sGoal: '',
    };
    res.render('te_newrecord', opt);
});


router.post('/',async function(req,response,next){

    //検索ボタンが押されたら実行
    if(req.body.search){

        //各種API・パラメータの定義
        let baseUrl = 'https://api.ekispert.jp/v1/json/';   //すべてのベースURL
        let seachUrl = 'search/course/extreme?';//単価調べる用の部品URL
        //let codeURl = 'station?';   //駅名を駅コードに変換する用の部品URL
        let accessKey = 'key=test_VtL3kuyWkrB'; //アクセスキーの定義  
        let ic = 'toolbox/course/condition?ticketSystemType=ic&' //ICカード検索の条件を生成

        //フォームの入力内容を定義
        let stationStart = req.body.routeStart;
        let stationWaypoint = req.body.routeWaypoint;
        let stationGoal = req.body.routeGoal;

        //ICカード条件生成のための完成URL（エンコード済み）
        let icUrl = encodeURI(`${baseUrl}${ic}${accessKey}`) 

        //ICカードの条件を生成するAPI
        function icCard(){
            return fetch(icUrl)
            .then(res =>res.text()) //データをテキストに変換
            .then(res => JSON.parse(res))   //json形式のテキストをオブジェクトに変換する
            .then(res =>{return icData = '&conditionDetail='+res.ResultSet.Condition;})
            .catch(err =>{console.log('失敗')});
        }
        

        /*
        //駅コード取得のための完成URL（エンコード済み）
        let searchCodeStart = encodeURI(`${baseUrl}${codeURl}${accessKey}${stationStart}`) ;
        let searchCodeWaypoint = encodeURI(`${baseUrl}${codeURl}${accessKey}${stationWaypoint}`) ;
        let searchCodeGoal = encodeURI(`${baseUrl}${codeURl}${accessKey}${stationGoal}`) ;

        //出発地の駅コードを取得するためのAPI
        function searchCode1(){
            return fetch(searchCodeStart)
            .then(res =>res.text())
            .then(res => JSON.parse(res))
            .then(res1 =>{return codeStart = res1.ResultSet.Point[0].Station.code;})
            .catch(err =>{console.log('失敗1')});
        }
        
        //経由地の駅コードを取得するためのAPI
        function searchCode2(){
            return fetch(searchCodeWaypoint)
            .then(res =>res.text())
            .then(res =>JSON.parse(res))
            .then(res2 =>{return  codeWaypoint = res2.ResultSet.Point[0].Station.code;})
            .catch(err =>{console.log('経由地未入力')});
        }

        //目的地の駅コードを取得するためのAPI
        function searchCode3(){
            return fetch(searchCodeGoal)
            .then(res =>res.text())
            .then(res => JSON.parse(res))
            .then(res3 =>{return codeGoal = res3.ResultSet.Point[0].Station.code;})
            .catch(err =>{console.log('失敗3')});
        }
        */

        //単価を検索するためのAPI
        function searchPrice(){

            //日付・時刻検索の条件を生成
            let date = req.body.year+req.body.month+req.body.day;
            let dateUrl = '&date='+date;
            let timeUrl = '&time='+req.body.time;

            //経由地が未入力の際の条件分岐
            if(req.body.routeWaypoint==''){
                var stationPrice ='&viaList=' +stationStart +':' +stationGoal ;   //取得した駅コードを単価検索用に連結
            }else{ var stationPrice ='&viaList=' +stationStart +':' +stationWaypoint +':' +stationGoal}; //取得した駅コードを単価検索用に連結

            //単価検索用の完成URL
            let searchPrice = encodeURI(`${baseUrl}${seachUrl}${accessKey}${stationPrice}${dateUrl}${timeUrl}${icData}`);
            
            console.log(searchPrice);

            //APIの呼び出しをして、返り値をte_newrecord.ejsにrender
            fetch(searchPrice)
            .then(res =>res.text()) //データをテキストに変換
            .then(res => JSON.parse(res))   //json形式のテキストをオブジェクトに変換する
            .then(res =>{     
                
                let  priceData  = res.ResultSet.Course[0].Price; //様々な運賃情報が入っている配列

                theaterID = 'FareSummary'  // FareSummaryに合致する配列を探すための値を定義

                target = priceData.filter(function(object) {
                    return object.kind == theaterID // kindが「FareSummary」の配列のみ返す。
                })
                .shift() //これはよくわかりません。調べたら書いてありました。

                //renderする際のオプションを定義
                let opt = {
                    title: '運賃が計算できました！',
                    message: '続けて各項目を記入し、保存してください',
                    price: 'value=' +'"' +target.Oneway +'円' +'"',
                    moveDate: 'value='+'"'+date.substring(4)+'"', //データベースの値+この式でいけそう
                    date: date,
                    sStart: req.body.routeStart,
                    sWaypoint: req.body.routeWaypoint,
                    sGoal: req.body.routeGoal
                };

                //renderする
                response.render('te_newrecord',opt);
            })
            .catch(err =>{

                //renderする際のオプションを定義
                let opt = {
                    title: 'Error',
                    message: "運賃が計算できませんでした<br>日付・時刻は半角数字、駅名は正しい名前を入力してください",
                    price: 'placeholder="自動計算（ICカード利用時料金）"',
                    moveDate: 'placeholder="移動した日付・時刻が自動で追加されます"', 
                    date: '',
                    sStart: '',
                    sWaypoint: '',
                    sGoal: ''
                };

                //renderする
                response.render('te_newrecord',opt);
            });
        }
        
        //すべてのAPI関数を呼び出して関数に定義（非同期を同期のように処理）
        async function chijiiwa(){
            await icCard();
            searchPrice();
        }

        //関数の呼び出し
        chijiiwa();
    }
    
    //保存ボタンが押されたときに実行
    else if(req.body.save){
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
    // console.log(client)
    // client.query('SELECT * from memo', function(err, result){
    //   if (err){
    //     console.log(err)
    //   }
    //   console.log(result)
    // })
    
    //フォームに入力された値を定義
    let dYear = req.body.year;
    let dMonth = req.body.month;
    let dDay = req.body.day;
    let dStart = req.body.routeStart;
    let dGoal = req.body.routeGoal;
    let dWaypoint = req.body.routeWaypoint;
    let dWay = req.body.way;
    let dPrice =target.Oneway;
    let dTimes = req.body.times;
    let dMemo = req.body.memo;
    let dShinsei =1;
    let dMovedate = date;
    let dUpdate = date;

    //インサートコマンドを定義
    const sql = "INSERT INTO tedetail (emp_no, sheet_year, sheet_month, branch_no, year, month, day, trans_type, trans_from, trans_to, trans_waypoint, amount, count, job_no, job_manager, claim_flag, charge_flag, ref_no, status, remarks, new, new_date, renew, renew_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)";
    const values = ['001','2021','06','1', '2021','06','10','1','赤坂','東京','大手町','168','1','SKLOTH0306','111','0','1','1','88', '備考'];

    client.query('SELECT * from tedetail',function(err,result){
      console.log(result)
      for(var i of result.rows){
        console.log(i)
        // id[i]=result.rows[i].id;
        // name[i]=result.rows[i].name;
        // mail[i]=result.rows[i].mail;
        // console.log(id[i]+name[i]+mail[i]);              
      }
      client.end()
    });
    let opt={
        title: '保存できました！',
        message: '続けて検索する場合はそのまま各項目を入力してください',
        price: 'placeholder="自動計算（ICカード利用時料金）"',
        moveDate:'placeholder="移動した日付・時刻が自動で追加されます"',
        date:'',
        sStart: '',
        sWaypoint: '',
        sGoal: '',
    }
    res.render('te_newrecord',opt);
    }
    //削除ボタンが押された時に実行
    // else if(req.body.delete){
    //     const client = (process.env.ENVIRONMENT == "LIVE") ? new Client({
    //       connectionString: process.env.DATABASE_URL,
    //       ssl: {
    //           rejectUnauthorized: false
    //       }
    //     }) : new Client({
    //       user: 'postgres',
    //       host: 'localhost',
    //       database: 'itpjph3',
    //       password: dbpassword,
    //       port: 5432
    //     })
    //     await client.connect()
    //     // console.log(client)
    //     // client.query('SELECT * from memo', function(err, result){
    //     //   if (err){
    //     //     console.log(err)
    //     //   }
    //     //   console.log(result)
    //     // })

    //         //フォームに入力された値を定義
    //         let dDate = req.body.date;
    //         let dStart = req.body.routeStart;
    //         let dGoal = req.body.routeGoal;
    //         let dWaypoint = req.body.routeWaypoint;
    //         let dWay = req.body.way;
    //         let dPrice =target.Oneway;
    //         let dTimes = req.body.times;
    //         let dMemo = req.body.memo;
    //         let dPattern = req.body.regularly;
    //         let dShinsei =1;
    //         let dMovedate = req.body.date;
    //         let dUpdate =req.body.date;

    // client.query('SELECT * from tedetail',function(err,result){
    //   console.log(result)
    //   for(var i of result.rows){
    //     console.log(i)
    //     // id[i]=result.rows[i].id;
    //     // name[i]=result.rows[i].name;
    //     // mail[i]=result.rows[i].mail;
    //     // console.log(id[i]+name[i]+mail[i]);              
    //   }
    // client.end()
    // });
    //     //renderする際のオプションを定義
    //     let opt = {
    //         title: '削除できました！',
    //         message: '続けて検索する場合はそのまま各項目を入力してください',
    //         price: 'placeholder="自動計算（ICカード利用時料金）"',
    //         moveDate:'placeholder="移動した日付・時刻が自動で追加されます"',
    //         date:'',
    //         sStart: '',
    //         sWaypoint: '',
    //         sGoal: ''
    //     };
    //     response.render('te_newrecord', opt);
    // };
});

module.exports = router;