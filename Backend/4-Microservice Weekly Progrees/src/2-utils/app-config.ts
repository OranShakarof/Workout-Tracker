class AppConfig {
    public readonly port = 4004;
    public readonly mongodbConnectionString = "mongodb://127.0.0.1:27017/fitness-tracker";
    public readonly prodDomain = "http://localhost:4000";
}

const appConfig = new AppConfig();

export default appConfig;
