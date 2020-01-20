const express = require('express');
const repoRoutes = require('./api/routes/repositoryRoutes');
const config = require('./config/config');

const app = express();

app.use(express.json());
app.use('/api', repoRoutes);

app.listen(config.api.PORT, () => console.log(`Listening on port ${config.api.PORT}`));

//export app to perform unit tests over it
module.exports = app; 