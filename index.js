const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 5000;

const users = [
    {id: 1, username: 'CamiloR', password: '123456'},
    {id: 2, username: 'MariaH', password: '123456'},
    {id: 3, username: 'JuanM', password: '123456'}
];

app.listen(port, () => console.log('Conectado...'));

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API Login')
});

app.get('/api/login', (req, res) => {
    res.send('Metodo get funcionando.')
});

app.post('/api/login', (req, res) => {

    const { username, password } = req.body; 

    const user = users.find(c => c.username === username && c.password === password);

    if (user) {
        res.send('Usuario autenticado exitosamente.');
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});
    
    //const user = {
        //id: users.length + 1,
        //username: req.body.username,
        //password: req.body.password
    //}

    //users.push(user);

app.delete('/api/login/:id', (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if(!user) return res.send('Usuario no encontrado.')

    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send('Usuario ' + user.username + ' borrado exitosamente.')
});


