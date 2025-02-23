const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('./databasepg.js')
const cors = require('cors')
const app = express()
const port = process.env.port || 5000;

app.listen(port, () => console.log('Conectado...'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API Login')
});

app.post('/api/login', async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    let select = `SELECT * FROM users WHERE username_user = '${username}'`;
    let result = await pool.query(select);

    if(result.rows[0]){

        if(await bcrypt.compare(password, result.rows[0].password_user)){

            res.send('Usuario autenticado exitosamente.')

        }else{

            res.status(401).send('Credenciales incorrectas');
        }
        
    }else{

        res.status(401).send('Usuario no existe');
    }

});

app.post('/api/login/createuser', async (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let hashPassword = await bcrypt.hash(password, 10);
    

    let insert = `INSERT INTO users(username_user, email_user, password_user) VALUES('${name}', '${email}', '${hashPassword}')`

    pool.query(insert, (err, result)=>{

        if(!err){

            res.send('Insercion exitosa');

        }
        else{

            console.log(err.message);
            
        }
    })

})
    

