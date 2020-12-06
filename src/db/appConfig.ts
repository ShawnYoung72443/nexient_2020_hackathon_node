class AppConfig {
    constructor(){}

    getCosmosConfig() {
        return {
            cosmosEndpoint: process.env.CONNECTION_COSMOS_ENDPOINT || '',
            cosmosMasterKey: process.env.CONNECTION_COSMOS_AUTH_KEY || '',
        }
    }

    getUsersDbConfig() {
        return {
            database: process.env.EMBRACE_DATABASE || '',
            collection: process.env.USER_CONTAINER || '',
        }
    }
}

const appConfig: AppConfig = new AppConfig

export {
    appConfig
}
