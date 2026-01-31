const express = require('express');
const router = express.Router();
const clientes = require('./clientes');

// Crear cliente
router.post('/', (req, res) => {
  const {
    Documento,
    Nombres,
    Apellidos,
    Email,
    Telefono,
    Placa1,
    Placa2
  } = req.body;

  // Validación: documento único
  if (clientes.some(c => c.Documento === Documento)) {
    return res.status(400).json({ error: `Documento: ${Documento} — Este documento ya se encuentra registrado.` });
  }

  // Validación: formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({ error: 'Email: Formato de correo electrónico inválido.' });
  }

  // Validación: Placa1 obligatoria
  if (!Placa1 || Placa1.trim() === '') {
    return res.status(400).json({ error: 'Placa1: Este campo es obligatorio.' });
  }

  // Validación: documento solo números y máximo 10 caracteres
  if (!Documento || !/^\d{1,10}$/.test(Documento)) {
    return res.status(400).json({ error: 'Documento: Solo se permiten números, máximo 10 caracteres.' });
  }

  // Validación: nombres solo letras
  if (!Nombres || !/^[a-zA-Z\s]+$/.test(Nombres)) {
    return res.status(400).json({ error: 'Nombres: Solo se permiten letras.' });
  }

  // Validación: apellidos solo letras
  if (!Apellidos || !/^[a-zA-Z\s]+$/.test(Apellidos)) {
    return res.status(400).json({ error: 'Apellidos: Solo se permiten letras.' });
  }

  // Validación: teléfono solo números y máximo 10 caracteres
  if (!Telefono || !/^\d{1,10}$/.test(Telefono)) {
    return res.status(400).json({ error: 'Teléfono: Solo se permiten números, máximo 10 caracteres.' });
  }

  // Validación: Placa1 obligatoria y exactamente 6 caracteres
  if (!Placa1 || Placa1.length !== 6) {
    return res.status(400).json({ error: 'Placa1: Debe tener exactamente 6 caracteres.' });
  }

  // Validación: Placa2 exactamente 6 caracteres si se proporciona
  if (Placa2 && Placa2.length !== 6) {
    return res.status(400).json({ error: 'Placa2: Debe tener exactamente 6 caracteres.' });
  }

  const cliente = {
    Documento,
    Nombres,
    Apellidos,
    Email,
    Telefono,
    Placa1: Placa1.replace(/\s+/g, '').toUpperCase(),
    Placa2: Placa2 ? Placa2.replace(/\s+/g, '').toUpperCase() : null,
    FechaCreacion: new Date().toLocaleString('es-CO', { 
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  clientes.push(cliente);
  res.status(201).json(cliente);
});

// Listar clientes con búsqueda
router.get('/', (req, res) => {
  const search = req.query.search?.toLowerCase();

  if (!search) return res.json(clientes);

  const filtrados = clientes.filter(c =>
    Object.values(c).some(v =>
      String(v).toLowerCase().includes(search)
    )
  );

  res.json(filtrados);
});

module.exports = router;