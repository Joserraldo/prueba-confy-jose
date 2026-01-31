const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas - IMPORTANTE: el prefijo /clientes
app.use('/clientes', require('./routes'));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
    console.log(` API disponible en: http://localhost:${PORT}/clientes`);
});