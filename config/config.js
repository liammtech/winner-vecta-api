// config/config.js
require('dotenv').config()

module.exports = {
    winner: {
        apiUrl: process.env.WINNER_BASE_URL,
        apiKey: process.env.WINNER_API_KEY
    },
    vecta: {
        apiUrl: process.env.VECTA_BASE_URL,
        apiKey: process.env.VECTA_API_KEY,
        auth: {
            company: process.env.VECTA_COMPANY,
            username: process.env.VECTA_USERNAME,
            password: process.env.VECTA_PASSWORD
        }
    },
    port: 3000
};
