const express = require('express')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const path = require('path')
const pool = require('./databasepg.js')
const cors = require('cors')
const app = express()
const port = process.env.port || 5000;
const userMail = "thedraxstep1@gmail.com";
const appPass = "viik vlrm cvnv lyuh";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: userMail,
        pass: appPass
    }
})


app.listen(port, () => console.log('Conectado...'));
app.use(express.json());
app.use(cors());

app.get('/api/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'front.html'))
});

//app.get('/api/home', (req, res) => {
    //res.sendFile(path.join(__dirname, 'home.html'));
//})

app.post('/api/recuperacion', async (req, res) => {

    let email = req.body.email;
    let select = `SELECT * FROM users WHERE email_user = '${email}'`;
    let result = await pool.query(select);

    if(result.rows[0]){

        let newPass = crypto.randomBytes(5).toString('hex');
        let hashPass = await bcrypt.hash(newPass, 10);
        
        await pool.query(`UPDATE users SET password_user = '${hashPass}' WHERE email_user = '${email}'`)

        let mailBody = {
            from: userMail,
            to: email,
            subject: "Recuperacion de contraseña",
            text: `Su nueva contraseña es: '${newPass}'`
        };

        transporter.sendMail(mailBody, (error, info) => {
            if (error){
                console.log(error);
            }
            console.log("Email enviado. ")
            res.send("OK.")
        })

        
        } else{
            res.status(401).send("Correo no registrado.");
        }

        
    

})

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
    

    let insert = `INSERT INTO users(username_user, email_user, password_user) VALUES('${name}', '${email}', '${hashPassword}') RETURNING id_user`
    
    let result = await pool.query(insert);

    if(result.rows.length > 0){

        let id_user = result.rows[0].id_user
        let insertRol = `INSERT INTO users_rol(id_user, id_rol) VALUES('${id_user}','2')`;
        
        await pool.query(insertRol);

        res.send("OK");

    }   else{

        res.status(401);
        
    }
    

})
    

