import Constants from "expo-constants";

const ENV = {
  ENV: Constants.expoConfig?.extra?.env ?? "development",
  API_URL: Constants.expoConfig?.extra?.apiUrl ?? "",
};

export default ENV;