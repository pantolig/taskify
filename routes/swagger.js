const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const router = express.Router();

// Carica il file swagger.yaml
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger/swagger.yaml'));

// Configura l'endpoint per la documentazione
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;