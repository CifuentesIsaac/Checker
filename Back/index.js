const express = require ('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Creacion del servidor
const app = express();

//Conexion a la base de datos
conectarDB();

app.use(cors());
app.use(express.json());

//Rutas de la aplicacion
app.use('/', require('./routes/usersRoute'));

//Ruta principal
app.get('/', (req, res) => {
    res.send('Hey server!!')
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('\x1b[1m',`Servidor en el puerto ${PORT}`);
    console.log('\x1b[34m' ,`http://localhost:${PORT}`);
})