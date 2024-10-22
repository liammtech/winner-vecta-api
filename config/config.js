require('dotenv').config()

module.exports = {
    winner: {
        apiUrl: process.env.WINNER_BASE_URL,
        apiKey: process.env.WINNER_API_KEY
    },
    winnerShops: {
        kitchenKitId: process.env.WINNER_SHOP_KITCHEN_KIT_ID,
        blossomAvenueId: process.env.WINNER_SHOP_BLOSSOM_AVENUE_ID,
        pimlicoId: process.env.WINNER_SHOP_PIMLICO_ID,
        testShopId: process.env.WINNER_SHOP_TEST_SHOP_ID
    },
    winnerCompetitors: {
        bandqId: process.env.WINNER_COMPETITOR_BANDQ_ID,
        benchmarxId: process.env.WINNER_COMPETITOR_BENCHMARX_ID,
        homebaseId: process.env.WINNER_COMPETITOR_HOMEBASE_ID,
        howdensId: process.env.WINNER_COMPETITOR_HOWDENS_ID,
        selcoId: process.env.WINNER_COMPETITOR_SELCO_ID,
        wickesId: process.env.WINNER_COMPETITOR_WICKES_ID,
        wrenID: process.env.WINNER_COMPETITOR_WREN_ID
    },
    vecta: {
        apiUrl: process.env.VECTA_BASE_URL,
        apiKey: process.env.VECTA_API_KEY,
        auth: {
            company: process.env.VECTA_COMPANY,
            username: process.env.VECTA_USERNAME,
            password: process.env.VECTA_PASSWORD
        },
        itUserId: process.env.VECTA_IT_USER_ID,
        designWorkflowId: process.env.VECTA_DESIGN_WORKFLOW_ID
    },
    vectaUdValues: {
        flexContactName: process.env.VECTA_UD_FLEX_CONTACT_NAME_ID,
        flexContactNo: process.env.VECTA_UD_FLEX_CONTACT_NO_ID,
        flexProjectNoId: process.env.VECTA_UD_FLEX_PROJECT_NO_ID,
        routeToMarketId: process.env.VECTA_UD_ROUTE_TO_MARKET_ID,
        lostToCompetitorId: process.env.VECTA_UD_LOST_TO_COMPETITOR_ID
    },
    port: 3000
};
