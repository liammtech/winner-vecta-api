const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webhookRoutes = require('./routes/webhookRoutes');

app.use(bodyParser.json());

app.use('/webhook', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
