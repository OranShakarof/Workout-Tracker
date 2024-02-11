abstract class AppConfig {
    public registerUrl = this.baseUrl + "/api/auth/register/";
    public loginUrl = this.baseUrl + "/api/auth/login/";
    public profileUrl = this.baseUrl + "/api/profile/";
    public weeklyProgressesUrl = this.baseUrl + "/api/weekly-progresses/";
    public workoutsUrl = this.baseUrl + "/api/workouts/";
    public constructor (private baseUrl: string) { }
}

class DevelopmentConfig extends AppConfig{
    public constructor(){
        super("http://localhost:4000"); // Development backend address.
    }
}

class ProductionConfig extends AppConfig{
    public constructor(){
        super(""); // Production backend address.
    }
}

// const appConfig = new DevelopmentConfig();
const appConfig = new DevelopmentConfig();

export default appConfig;
