class AppConfig {
    public readonly port = 4003;
    public readonly mongodbConnectionString = "mongodb://127.0.0.1:27017/fitness-tracker";
}

const appConfig = new AppConfig();

export default appConfig;
