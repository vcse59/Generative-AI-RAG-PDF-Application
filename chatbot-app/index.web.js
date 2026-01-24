import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";


AppRegistry.registerComponent(appName, () => App);

const rootTag = document.getElementById("app");
AppRegistry.runApplication(appName, { initialProps: {}, rootTag });