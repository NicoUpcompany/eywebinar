import React from "react";
import ReactDOM from "react-dom";
import { CometChat } from "@cometchat-pro/chat";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import "antd/dist/antd.css";
import "./index.scss";

import App from "./App";
import { COMETCHAT_CONSTANTS } from "./consts";
import reportWebVitals from "./reportWebVitals";
import reducer from "./store/reducer";

const store = createStore(reducer, compose(applyMiddleware(thunk)));

const appID = COMETCHAT_CONSTANTS.APP_ID;
const region = COMETCHAT_CONSTANTS.REGION;

const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
CometChat.init(appID, appSetting).then(
	() => {
		if (CometChat.setSource) {
			CometChat.setSource("ui-kit", "web", "reactjs");
		}
		console.log("Initialization completed successfully");
		ReactDOM.render(
			<Provider store={store}>
				<React.StrictMode>
					<App />
				</React.StrictMode>
			</Provider>,
			document.getElementById("root")
		);
	},
	(error) => {
		console.log("Initialization failed with error:", error);
	}
);

reportWebVitals();
