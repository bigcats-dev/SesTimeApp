import Constants from "expo-constants";

const ENV = {
  ENV: Constants.expoConfig?.extra?.appEnv ?? "development",
  API_URL: Constants.expoConfig?.extra?.apiUrl ?? "https://siamexpresssurvey.com/timestamp",
};

export default ENV;