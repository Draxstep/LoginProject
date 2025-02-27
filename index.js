const express = require('express')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const path = require('path')
const pool = require('./databasepg.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'passkeytoken'
const app = express()
const port = process.env.port || 5000;
const userMail = "thedraxstep1@gmail.com";
const appPass = "viik vlrm cvnv lyuh";
const rateLimit = require("express-rate-limit");
const allowedOrigin = `http://localhost:${port}`;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: userMail,
        pass: appPass
    }
})


app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use(express.static(__dirname));
app.use(cookieParser());


app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));


app.get('/api/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'front.html'))
});


app.get('/api/login/home', (req, res) => {
    const token = req.cookies.access_token
    if(!token){
        return res.status(403).send('Acceso no autorizado.')
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ message: "Acceso permitido", user: decoded.username });
    } catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado' });
    }
    
})


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
            text: `Estimado usuario,

Hemos recibido una solicitud para restablecer su contraseña. Su nueva contraseña temporal es: **${newPass}**  

Por razones de seguridad, le recomendamos que inicie sesión lo antes posible y cambie su contraseña.  

Si usted no solicitó este cambio, por favor ignore este mensaje o póngase en contacto con nuestro equipo de soporte.  

Atentamente,  
El equipo de soporte`
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

});

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 5, // intentozs
    message: { message: "Demasiados intentos. Intenta más tarde." },
    Headers:true
});

app.set("trust proxy", 1);

app.post('/api/login', loginLimiter, async (req, res) => {
    console.log("Ruta /api/login llamada");
    console.log(`Intento de login desde: ${req.ip}`);

    let { username, password } = req.body;
    
    try {
        let select = `SELECT * FROM users WHERE username_user = $1`;
        let result = await pool.query(select, [username]);

        if (result.rows.length > 0) {
            let user = result.rows[0];

            if (await bcrypt.compare(password, user.password_user)) {
                const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
                res.cookie('accessToken', token, { httpOnly: true })
                    .status(200)
                    .json({ message: 'Usuario autenticado exitosamente.', token });
            } else {
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        } else {
            res.status(401).json({ error: 'Usuario no existe' });
        }
    } catch (error) {
        console.error("Error en /api/login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/*app.post("/api/login", loginLimiter, (req, res) => {
    console.log("Ruta /api/login llamada");
    console.log(`Intento de login desde: ${req.ip}`);
    res.json({ message: "Procesando login..." });
});*/


app.post('/api/login/createuser', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        let hashPassword = await bcrypt.hash(password, 10);
        
        let insert = `INSERT INTO users(username_user, email_user, password_user) VALUES($1, $2, $3) RETURNING id_user`;
        let result = await pool.query(insert, [name, email, hashPassword]);

        if (result.rows.length > 0) {
            let id_user = result.rows[0].id_user;
            let insertRol = `INSERT INTO users_rol(id_user, id_rol) VALUES($1, '2')`;
            await pool.query(insertRol, [id_user]);

            res.status(201).json({ message: "Usuario creado exitosamente" });
        } else {
            res.status(400).json({ error: "No se pudo crear el usuario" });
        }
    } catch (error) {
        console.error("Error en /api/login/createuser:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

    

