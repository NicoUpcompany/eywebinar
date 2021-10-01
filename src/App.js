import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { browserName, browserVersion, fullBrowserVersion, osName, osVersion, isMobileOnly, isTablet, isSmartTV } from "react-device-detect";

import { getAccessTokenApi } from "./api/auth";
import { publicIpApi, geoIpApi } from "./api/realtime";
import routes from "./config/routes";
import AuthProvider from "./providers/AuthProvider";
import * as actions from "./store/action";
import Socket from "./utils/socket";

import "./App.scss";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: false,
		};
	}

	componentDidMount() {
		this.getPublicData();
		this.props.getLoggedinUser();
	}

	getPublicData = async () => {
		if (isMobileOnly) {
			window.conectionType = "MOBILE";
		} else if (isTablet) {
			window.conectionType = "TABLET";
		} else if (isSmartTV) {
			window.conectionType = "SMART TV";
		} else {
			window.conectionType = "DESKTOP";
		}
		try {
			const resp = await publicIpApi();
			const response = await geoIpApi(resp.ip);
			window.flagIcon = response.location.country.flag.emojitwo;
			window.city = response.location.city;
			window.postalCode = response.location.postal;
			window.continent = response.location.continent.name;
			window.continentCode = response.location.continent.code;
			window.country = response.location.country.name;
			window.countryIsoCode = response.location.country.code;
			window.locationLatLong = `${response.location.latitude},${response.location.longitude}`;
			window.accuracyRadius = response.location.country.area;
			window.timeZone = response.time_zone.id;
			window.region = response.location.region.name;
			window.regionIsoCode = response.location.region.code;
			window.ipAddress = response.ip;
			window.ipType = response.type;
			window.isp = response.connection.organization;
		} catch (error) {
			console.log(error);
		}
		this.userSocket();
	};

	userSocket = () => {
		const interval = setInterval(() => {
			const token = getAccessTokenApi();
			if (token !== null) {
				const decodedToken = jwtDecode(token);
				if (decodedToken) {
					const newUser = {
						userId: decodedToken.id,
						name: decodedToken.name,
						lastname: decodedToken.lastname,
						email: decodedToken.email,
						phone: decodedToken.phone,
						enterprise: decodedToken.enterprise,
						position: decodedToken.position,
						sector: decodedToken.sector,
						route: window.location.pathname,
						flagIcon: window.flagIcon,
						city: window.city,
						postalCode: window.postalCode,
						continent: window.continent,
						continentCode: window.continentCode,
						country: window.country,
						countryIsoCode: window.countryIsoCode,
						locationLatLong: window.locationLatLong,
						accuracyRadius: window.accuracyRadius,
						timeZone: window.timeZone,
						region: window.region,
						regionIsoCode: window.regionIsoCode,
						ipAddress: window.ipAddress,
						ipType: window.ipType,
						isp: window.isp,
						conectionType: window.conectionType,
						navigatorName: `${browserName} ${browserVersion} (full version. ${fullBrowserVersion})`,
						operatingSystem: `${osName} ${osVersion}`,
					};
					Socket.emit("NEW_USER", newUser);
					clearInterval(interval);
				}
			}
		}, 5000);
	};

	render() {
		return (
			<AuthProvider>
				<Router>
					<Switch>
						{routes.map((route, index) => (
							<RouteWithSubRoutes key={index} {...route} />
						))}
					</Switch>
				</Router>
			</AuthProvider>
		);
	}
}

function RouteWithSubRoutes(route) {
	return <Route path={route.path} exact={route.exact} render={(props) => <route.component routes={route.routes} {...props} />} />;
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getLoggedinUser: () => dispatch(actions.authCheckState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
