//u seedu kreiraj tablicu user , samo email , jer ce trebat provjeravat koji mailovi postoje
const {Pool} = require('pg');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Termini',
    password: 'root',
    port: 5432,

});

const sql_create_users = 
`
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ime text NOT NULL , 
    prezime text NOT NULL ,
    email text NOT NULL UNIQUE ,
    brTelefona text NOT NULL UNIQUE,
    datumRod text NOT NULL 

    

);
`;
const sql_create_friendships = 
`
DROP TABLE IF EXISTS friendships;
CREATE TABLE friendships (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id1 int NOT NULL ,
    id2 int NOT NULL,
    status text NOT NULL,
    poslo int NOT NULL
    
    

);
`;

const sql_create_events = 
`
DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tip text NOT NULL ,
    sport text NOT NULL,
    grad text NOT NULL,
    vrijeme time NOT NULL,
    datum date NOT NULL,
    mjesto text NOT NULL,
    kolkoLjudi text NOT NULL,
    status text NOT NULL,
    organizatorId int NOT NULL,
    grupa text,
    opis text,
    datumNastanka text
    
    

);
`;

const sql_create_events_lists = 
`
DROP TABLE IF EXISTS events_lists;
CREATE TABLE events_lists (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idEvent int NOT NULL,
    idUser int NOT NULL
    
    

);
`;

const sql_create_groups = 
`
DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUser int NOT NULL,
    ime text NOT NULL
    
    

);
`;
const sql_create_groups_lists = 
`
DROP TABLE IF EXISTS groups_lists;
CREATE TABLE groups_lists (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idGroup int NOT NULL,
    idUser int NOT NULL
    
    

);
`;
const sql_seed_users = `INSERT INTO users (
    ime, prezime, email,brTelefona,datumRod)
    VALUES 
    ('Filip', 'Penzar', 'nebitno', '0914488418','nebitno'),
    ('Noa', 'Menzar', 'nebitno2', '0955870087','nebitno2'),
    ('David', 'Ljubić', 'nebitno3', '0957371841','nebitno3'),
    ('Nino', 'Vukasovic', 'nebitno4', '0997401051','nebitno4'),
    ('Duje', 'Vukasovic', 'nebitno5', '0997869851','nebitno5'),
    ('Tvrle', 'Balic', 'nebitno6', '0994438112','nebitno6'),
    ('Ivor', 'Baričević', 'ivor.baricevic2@gmail.com', '0988829814','nebitno7')
    
    
    ;
`;

const sql_seed_friendships = `INSERT INTO friendships (
    id1,id2,status,poslo)
    VALUES 
    ('7', '1', 'pending','7'),
    ('7', '2', 'pending','2'),
    ('7', '3', 'potvrdeno','3'),
    ('7', '4', 'potvrdeno','7')
    
    
    ;
`;

const sql_seed_events = `INSERT INTO events (
    tip,sport,grad,mjesto,vrijeme,datum,kolkoLjudi,status,organizatorId,grupa,opis)
    VALUES 
    ('javni', 'NOGOMET', 'Zagreb','Palinovecka 27','18:00:00','2024-02-20','10','ongoing','7','nema','ponesite markere'),
    ('javni', 'RRUKOMET', 'Varazdin','Palinovecka 227','18:00:00','1945-12-05','114','ongoing','7','nema','ponesite markere opet'),
    ('privatni', 'STOLNI TENIS', 'Osijek','Palinovecka 27','18:00:00','2023-02-23','10','ongoing','3','nema','ponesite markere'),
    ('privatni', 'STOLNI TENIS', 'Osijek','Palinovecka 27','18:00:00','2023-02-12','10','ongoing','3','nema','ponesite markere'),
    ('javni', 'NOGOMET', 'Spli   t','Palinovecka 27adadad2d2425e','18:00:00','2145-06-06 ','10','ongoing','2','nema','ponesite markereremfnsubiabfaufbafiubaubfabfiubafbafibaue'),
    ('javni', 'RUKOMET', 'Vukovar','Palinovecka 27','18:00:00','2145-06-06 ','10','ongoing','6','nema','ponesite markerenbaiufafbbfaifabfiafaibfaifafubsidrzbvievsjvbkbdjvbjdajbkvjdjbvdbjvdakkjbvdjbvdajbvkdajbvdajkvdakjbvdajbvdakjbvdajbvdajbvdakjbvdabkjvdjbvdakjbvd'),
    ('privatni', 'STOLNI TENIS', 'Osijek','Palinovecka 27','18:00:00','2023-02-12','10','ongoing','5','nema','ponesite markere')
    
    
    
    ;
`;

const sql_seed_events_lists = `INSERT INTO events_lists (
    idEvent,idUser)
    VALUES 
    ('1', '1'),
    ('2', '1'),
    ('2', '2'),
    ('2', '3'),

    ('3', '7'),
    ('4', '7'),
    ('6', '2'),
    ('6', '3'),
    ('6', '5')
    
    

    
    
    ;
`;



async function seed() {
await pool.query(sql_create_users,[])
await pool.query(sql_create_friendships,[])
await pool.query(sql_create_events,[])
await pool.query(sql_create_events_lists,[])
await pool.query(sql_create_groups,[])
await pool.query(sql_create_groups_lists,[])
await pool.query (sql_seed_users,[])
await pool.query (sql_seed_friendships,[])
await pool.query (sql_seed_events,[])
await pool.query (sql_seed_events_lists,[])
console.log("seed succesfull")




}

const connectToDB = async () => {
    try {
      await pool.connect();
    } catch (err) {
      console.log(err);
    }
  };
  connectToDB().then(seed());
module.exports=pool;