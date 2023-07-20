const mailoviIkodovi = new Map();
const db = require("./db/db");
const express = require("express");
const app = express();
const port = 3000;
var randomize = require('randomatic');
const nodemailer = require("nodemailer");
var cors = require('cors')
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cors())
var mydate = require('current-date');


const smtpTransport = require('nodemailer-smtp-transport');
const currentDate = require("current-date");


        var transporter = nodemailer.createTransport(smtpTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
        secure: false,
         auth: {
        user: 'ivor.baricevic2@gmail.com',
        pass: "vpdubearagleltos"
    }
 }));

    
 app.get('/books', (req, res) => {
  res.json(books);
  console.log("kurcina")
});
    
//napravi terminihr gmail i napravi korake koji si morao za svoj mail https://miracleio.me/snippets/use-gmail-with-nodemailer/
app.post("/sendEmail", function (req, res) {
  var kod = randomize("0",5)
  var email=req.body.email
  mailoviIkodovi.set(email,kod)
  const mailOptions = {
    from: 'ivor.baricevic2@gmail.com',
    to: email,
    subject: 'Evo kod brate',
    html: "<div>Tvoj kod je </div> <p style='font-weight:bold;font-size:50px'>" +kod+ "</p>"
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
   console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      console.log(mailoviIkodovi)
    }
  });
  console.log(req.body)
});

app.post("/verifyCode", function (req, res) {
  
  var email=req.body.email
  var kod = mailoviIkodovi.get(email)
  var sentKod = req.body.code
  console.log(kod,sentKod,email,req.body)
  console.log("kuracverify")


  if(kod===sentKod) {
    console.log("login succeded")
    res.status(200).send("Success")
    mailoviIkodovi.delete(email);
  }
  else {
    console.log("login failed")
    res.status(401).send("Failed")
  }
  res.end()
 
  
});

async function checkMail(email) {
  var text = "select * from users where email=$1"
  //var text2=" select * from users where brTelefona=$1"
  var values=[email]
  //var values2=[brTelefona]

  var odg=await db.query(text,values)
  //var odg2=db.query(text2,values2)

 

  if(odg.rows.length>0){
    
    return {"err":"Email je vec u uporabi!"}}

  return undefined


}

app.get("/checkMail/:email",(req,res)=> {
  checkMail(req.params.email).then(odg=>{
    if(odg){
      console.log("500")
    res.status(500).end()}
    else{
      console.log("200")
    res.status(200).end()}
  })


})


async function checkBr(brTelefona) {
  
  var text2=" select * from users where brTelefona=$1"
  
  var values2=[brTelefona]

  
  var odg2=await db.query(text2,values2)


  if(odg2.rows.length>0)
    return {"err":"Broj se vec koristi!"}

  return undefined


}

 async function registriraj(body) {
   
  var email=body.email
  var ime = body.ime
  var prezime= body.prezime 
  var brTelefona = body.brTelefona
  var datumRod = body.datumRod
  console.log(email,ime,prezime,datumRod)
 
  const text="INSERT INTO USERS(ime,prezime,email,brTelefona,datumRod) VALUES ($1,$2,$3,$4,$5) RETURNING *"
  const values = [ime,prezime,email,brTelefona,datumRod]
  const odg=await db.query(text,values)
  return odg.rows[0]

}



app.post("/regUser",function(req,res){
  console.log("regUser")
  var emailErr= false;
  var brErr = false
    if(req.body.email===undefined || req.body.ime===undefined || req.body.prezime===undefined || req.body.brTelefona===undefined || req.body.datumRod===undefined){
          res.json({"err":"nista ne smije bit null"})
          console.log("regUser ima null")
          return}
      checkMail(req.body.email).then(err=>{
        if(err){
        console.log("regUser postojeci mail")
        return res.status(500).json(err)}

        else{
          checkBr(req.body.brTelefona).then(err2=>{
            if(err2){
            console.log("regUser postojeci Broj")
            return res.status(500).json(err2)}
            else{
            registriraj(req.body).then(user=>res.json(user))
            console.log("user regged")}
          })

        }
      
      })


      
     
      
    

   





})


async function createEvent(body) {
   
  var tip=body.tip
  var sport=body.sport
  var grad = body.grad
  var mjesto= body.mjesto 
  var vrijeme = body.vrijeme
  var opis=body.opis
  var datum = body.datum
  var kolkoLjudi = body.brojLjudi
  var status = body.status
  var grupa =body.grupa
  var organizerEmail = body.email
  var datumNastanka=mydate()
  console.log(tip,sport,grad,mjesto)
 
  const text1="Select id from  USERS where users.email=$1  "
  const values1 = [organizerEmail]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].id
  const text="INSERT INTO events(tip,grad,mjesto,vrijeme,datum,kolkoLjudi,status,organizatorId,sport,grupa,opis,datumNastanka) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *"
  const values = [tip,grad,mjesto,vrijeme,datum,kolkoLjudi,status,userid,sport,grupa,opis,datumNastanka]
  const odg2=await db.query(text,values)
  return odg2

}

app.post("/createEvent",function(req,res){


  createEvent(req.body).then(odg=>res.json(odg))





})

async function joinEvent(body) {
   
  var email=body.email
  var eventid= body.id
  
  console.log(email,eventid)
 
  const text1="Select id from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].id
  const text2="INSERT INTO events_lists(idEvent,idUser) VALUES($1,$2) RETURNING *"
  const values2 = [eventid,userid]
  await db.query(text2,values2)


}

app.post("/joinEvent",function(req,res){

  joinEvent(req.body)





})

async function unJoinEvent(body) {
   
  var email=body.email
  var eventid= body.id
  
  console.log("remove",email,eventid)
 
  const text1="Select id from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].id
  const text2="DELETE FROM events_lists where idUser=$2 and idEvent = $1"
  const values2 = [eventid,userid]
  await db.query(text2,values2)


}

app.post("/unJoinEvent",function(req,res){
  console.log("hit")

  unJoinEvent(req.body)





})

async function dodajFrenda(body) {
   //POKUSAJ SVE ISPRVE NE OVAK JER NEMA MAILA U BAZI
  var email=body.email
  var idFrend= body.id
  
  console.log(email,idFrend)
 
  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].id
 // console.log(userid)
 const text3="Select * from  FRIENDSHIPS where id1=$1 and id2=$2;"
 const values3 = [userid,idFrend]
 const odg3=await db.query(text3,values3)
 if(odg3.rows.length>0)
     return
  //console.log("userid",userid)
  //console.log("idFrend",idFrend)
  console.log(userid,"je userid")
  const text2="INSERT INTO FRIENDSHIPS(id1,id2,status,poslo) VALUES($1,$2,$3,$1) RETURNING *"
  const text4="INSERT INTO FRIENDSHIPS(id1,id2,status,poslo) VALUES($1,$2,$3,$2) RETURNING *"
  const values2 = [userid,idFrend,"pending"]
  const values2Obrnuto = [idFrend,userid,"pending"]
  await db.query(text2,values2)
  await db.query(text4,values2Obrnuto)


}

app.post("/dodajFrenda",function(req,res){

  
  dodajFrenda(req.body)





})

async function potvrdiFrenda(body) {
   
  var email=body.email
  var idFrend= body.id
  

 
  const text1="Select id from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].id
  console.log(userid,idFrend)

  const text2="UPDATE FRIENDSHIPS  set status='potvrdeno' where id1=$1 and id2=$2;"
  const values2 = [userid,idFrend]
  values2Obrnuto=[idFrend,userid]
  await db.query(text2,values2)
  await db.query(text2,values2Obrnuto)
  console.log("potvrdeno")


}
app.post("/potvrdiFrenda",function(req,res){

  potvrdiFrenda(req.body)
  





})

async function makniReq(body) {
   
  var email=body.email
  var idFrend= body.id
  

 
  const text1="Select id from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].id
  console.log(userid,idFrend)

  const text2="Delete from friendships where id1=$1 and id2=$2;"
  const values2 = [userid,idFrend]
  values2Obrnuto=[idFrend,userid]
  await db.query(text2,values2)
  await db.query(text2,values2Obrnuto)
  console.log("obrisano")


}

app.post("/makniReq",function(req,res){

  makniReq(req.body)
  





})

async function deleteFrend(body) {
   
  var email=body.email
  var idFrend= body.id
  

 
  const text1="Select id from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].id
  console.log(userid,idFrend)

  const text2="Delete from friendships where id1=$1 and id2=$2;"
  const values2 = [userid,idFrend]
  values2Obrnuto=[idFrend,userid]
  await db.query(text2,values2)
  await db.query(text2,values2Obrnuto)
  console.log("obrisano")


}

app.post("/deletefrend",function(req,res){

  deleteFrend(req.body)
  





})


async function nadiPrivatneObjave(id,userid) {
  const text = "Select events.id as eventId,* ,(select count (*) from events_lists where events_lists.idEvent=events.id)as br from events JOIN users on events.organizatorId=users.id where events.organizatorId=$1 and $3 not in (select idUser from events_lists where events_lists.idEvent=events.id) and events.tip=$2"
  const values=[id,"privatni",userid]
  const odg=await db.query(text,values)
  //console.log("privatni",odg.rows)
  return odg.rows;
}

async function nadiJavneObjave(id) { 
  const text = "Select events.id as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.id)as br from events JOIN users on events.organizatorId=users.id where events.tip=$1 and events.organizatorId!=$2 and $2 not in (select idUser from events_lists where events_lists.idEvent=events.id);"
  const values=["javni",id]
  const odg=await db.query(text,values)
 // console.log("javni",odg.rows)
  return odg.rows;
}




async function getFeed(email) {
  const text1="Select id from  USERS where users.email=$1  "
  const values1 = [email]
  const odg=await db.query(text1,values1)
  const userid=odg.rows[0].id
  console.log(userid)
  const text2="Select id2 from FRIENDSHIPS where id1=$1 and status=$2 "
  const values2=[userid,"potvrdeno"]
  const odg2=await db.query(text2,values2)
  
  const frendovi=odg2.rows
  const objave = []
  console.log(frendovi)
for(let i  =0;i<frendovi.length;i++) {
    nadiPrivatneObjave(frendovi[i].id2,userid).then(stupci=>{console.log("privatne",stupci);for(let i = 0;i<stupci.length;i++){objave.push(stupci[i])}})
  }
  await nadiJavneObjave(userid).then(stupci=>{console.log("javni",stupci);for(let i = 0;i<stupci.length;i++){objave.push(stupci[i])}})
  console.log(objave)
  return objave;
}

app.get("/feed/:email",function(req,res) {
  const email=req.params.email
  getFeed(email).then((objave)=>res.json(objave))
  

})

async function getUserSaBrojem(br) {
  const text = "Select * from users where brTelefona=$1"
  const values=[br]
  const odg= await db.query(text,values)
  
  if(odg.rows)
    return odg.rows[0]
    else
    return undefined
}

app.get("/userSaBrojem/:br",function(req,res) {
  const br=req.params.br
  
  getUserSaBrojem(br).then((user)=>{
    if(user)
    res.status(200).json(user)
    else
    res.status(500).json({"err":"nema ga"})
  
  })
  

})

async function getUserFrendovi(email) {
  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].id

  const text="select * from users join friendships on users.id=friendships.id2 where friendships.id1=$1 and friendships.status=$2"
  const values=[userid,"potvrdeno"]
  const frendoviOdg=await db.query(text,values)
  const frendovi=frendoviOdg.rows
  return frendovi
}

app.get("/userFrendovi/:email",function(req,res) {
  const email=req.params.email
  
  getUserFrendovi(email).then((frendovi)=>{
    console.log("kurcinaa")
    console.log(frendovi)
   res.status(200).json(frendovi)
  
  })
  

})

async function getUserReqs(email) {
  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].id

  const text="select * from users join friendships on users.id=friendships.id2 where friendships.id1=$1 and friendships.status=$2 and friendships.poslo!=$1"
  const values=[userid,"pending"]
  const frendoviOdg=await db.query(text,values)
  const frendovi=frendoviOdg.rows
  return frendovi
}

app.get("/userReqs/:email",function(req,res) {
  const email=req.params.email
  
  getUserReqs(email).then((frendovi)=>{
    console.log(frendovi)
   res.status(200).json(frendovi)
  
  })
  

})


async function traziUsere(input,email) {
  const text2="Select * from  USERS where users.email=$1;"
  const values2 = [email]
  const odg2=await db.query(text2,values2)

  const userid=odg2.rows[0].id
console.log(email)
  var input2=input.trim()
  if(!input2.includes(" ")){
    var text="Select CASE when users.id in (select id2 from friendships where friendships.id1=$2 and friendships.status=$4) then 'true' else 'false' end as pending ,*,CASE when users.id in (select id2 from friendships where friendships.id1=$2 and friendships.status=$3) then 'true' else 'false' end as friends from USERS where ime LIKE $1 or prezime LIKE $1"
    //or ime LIKE %$1 or ime LIKE %$1% or prezime LIKE $1% or prezimeime LIKE %$1 or prezime LIKE %$1%"
    const values=["%"+input2+"%",userid,"potvrdeno","pending"]
    const odg=await db.query(text,values)
    return odg.rows

  }
  
}

app.get("/traziUsere/:input/:email",function(req,res){

  traziUsere(req.params.input,req.params.email).then((useri)=>{
    console.log(useri)
   res.status(200).json(useri)
  
  })
  





})

app.get("/userReqs/:email",function(req,res) {
  const email=req.params.email
  
  getUserReqs(email).then((frendovi)=>{
    console.log(frendovi)
   res.status(200).json(frendovi)
  
  })
  

})

async function getTerminiUKojimaSudjelujem(email) {

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].id

  const text="Select events.id as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.id)as br from events join events_lists  on events.id=events_lists.idEvent join users on users.id=events.organizatorId where events_lists.idUser=$1 and  (events.datum>CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme>CURRENT_TIME))"
  const values=[userid]
  const terminiOdg=await db.query(text,values)
  const termini=terminiOdg.rows
  return termini
  
}

app.get("/terminiUKojimaSudjelujem/:email",function(req,res){

getTerminiUKojimaSudjelujem(req.params.email).then((termini)=>{
    console.log(termini)
   res.status(200).json(termini)
  
  })
  





})

async function getTerminiKojeOrganiziram(email) {

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].id

  const text="Select events.id as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.id)as br from events join users on events.organizatorId=users.id where events.organizatorId=$1 and  (events.datum>CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme>CURRENT_TIME))"
  const values=[userid]
  const terminiOdg=await db.query(text,values)
  const termini=terminiOdg.rows
  return termini
  
}

app.get("/terminiKojeOrganiziram/:email",function(req,res){

getTerminiKojeOrganiziram(req.params.email).then((termini)=>{
    console.log(termini)
   res.status(200).json(termini)
  
  })
  





})

async function getTerminiKojeOrganiziramProsli(email) {

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  

  const userid=odg.rows[0].id

  const text="Select events.id as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.id)as br from events join users on events.organizatorId=users.id where events.organizatorId=$1 and  (events.datum<CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme<CURRENT_TIME))"
  const values=[userid]
  const terminiOdg=await db.query(text,values)
  const termini=terminiOdg.rows
  return termini
  
}

app.get("/terminiKojeOrganiziramProsli/:email",function(req,res){

getTerminiKojeOrganiziramProsli(req.params.email).then((termini)=>{
    console.log(termini)
   res.status(200).json(termini)
  
  })
  





})

async function getTerminiUKojimaSamSudjelovao(email) {

  const text1="Select * from  USERS where users.email=$1;"
  const values1 = [email]
  const odg=await db.query(text1,values1)

  const userid=odg.rows[0].id

  const text="Select events.id as eventId,*,(select count (*) from events_lists where events_lists.idEvent=events.id)as br from events join events_lists  on events.id=events_lists.idEvent join users on users.id=events.organizatorId where events_lists.idUser=$1 and  (events.datum<CURRENT_DATE or (events.datum=CURRENT_DATE and events.vrijeme<CURRENT_TIME))"
  const values=[userid]
  const terminiOdg=await db.query(text,values)
  const termini=terminiOdg.rows
  return termini
  
}

app.get("/terminiUKojimaSamSudjelovao/:email",function(req,res){

getTerminiUKojimaSamSudjelovao(req.params.email).then((termini)=>{
    console.log(termini)
   res.status(200).json(termini)
  
  })
  





})

async function getDetalji(id,email) {
  const text2="Select * from  USERS where users.email=$1;"
  const values2 = [email]
  const odg2=await db.query(text2,values2)

  const userid=odg2.rows[0].id

  const text1="Select events.id as eventid,*,(select count (*) from events_lists where events_lists.idEvent=events.id)as br from  events join users on events.organizatorid=users.id where events.id=$1;"
  const values1 = [id]
  const odg=await db.query(text1,values1)

  const eventInfo=odg.rows[0]

  const text="select *,CASE when exists (select id2 from friendships where friendships.id1=$2 and friendships.id2=users.id and friendships.status=$4) then 'true' else 'false' end as pending ,CASE when exists (select id2 from friendships where friendships.id1=$2 and friendships.id2=users.id and friendships.status=$3) then 'true' else 'false' end as frend from events_lists join users  on events_lists.idUser=users.id  where events_lists.idEvent=$1"
  const values=[id,userid,"potvrdeno","pending"]
  
  const sudioniciOdg=await db.query(text,values)
  const sudionici=sudioniciOdg.rows
  const info={sudionici,eventInfo}
  return info
}

app.get("/detalji/:id/:email",function(req,res){

  getDetalji(req.params.id,req.params.email).then((termini)=>{
      console.log(termini)
     res.status(200).json(termini)
    
    })
    
  
  
  
  
  
  })

  async function editOpis(eventid,opis){
    console.log("editOpis")
    console.log(eventid,opis)
    const text="UPDATE EVENTS  set opis=$2 where id=$1;"
    const values=[eventid,opis]
    
   await db.query(text,values)


  }
  

  app.post("/editOpis",function(req,res){

    editOpis(req.body.eventid,req.body.opis)
      
    
    
    
    
    
    })


    async function editInfo(body){
      console.log(body)

      const text="UPDATE EVENTS  set vrijeme=$2 ,datum=$3,tip=$4,sport=$5,grad=$6 ,mjesto=$7,kolkoLjudi=$8,grupa=$9  where id=$1;"
      const values=[body.eventid,body.vrijeme,body.datum,body.tip,body.sport,body.grad,body.mjesto,body.brojLjudi,body.grupa]
      
     await db.query(text,values)
  
  
    }
    
  
    app.post("/editInfo",function(req,res){
  
      editInfo(req.body)
        
      
      
      
      
      
      })

      async function getBr(eventid) {

       
        const text="select id,(select count (*) from events_lists where events_lists.idEvent=events.id)as br  from events where id=$1"
        const values=[eventid]
        const odg=await db.query(text,values)
      
        const br=odg.rows[0].br

        return br;


      }


      app.get("/getBr/:id",function(req,res){

        getBr(req.params.id).then((br)=>
        { console.log(br)
          res.status(200).json(br)
        })
          
        
        
        
        
        
        })







app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});
