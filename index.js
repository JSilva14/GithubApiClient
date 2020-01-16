const express = require('express');
const repoRoutes = require('./routes/repositoryRoutes');
const config = require('./config/config');

const app = express();

app.use(express.json());
app.use('/api', repoRoutes);

app.listen(3000, () => console.log(`Listening on port ${config.api.PORT}`));