// Layout
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutBasic from "../layouts/LayoutBasic";

// Admin Pages
import AdminHome from "../pages/Admin/Home";
import AdminSignIn from "../pages/Admin/SignIn";
import AdminRealTime from "../pages/Admin/RealTime";
import AdminUsers from "../pages/Admin/Users";
import AdminEvents from "../pages/Admin/Events";
import AdminHistory from "../pages/Admin/History";
import AdminQuestion from "../pages/Admin/Question";
import AdminAgenda from "../pages/Admin/Agenda";
import AdminOptions from "../pages/Admin/Options";

// Basic Pages
import SignIn from "../pages/Basic/Auth/SignIn/SignIn";
import SignUp from "../pages/Basic/Auth/SignUp/SignUp";
import SignUpPay from "../pages/Basic/Auth/SignUpPay/SignUpPay";
import Confirm from "../pages/Basic/Confirm/Confirm";
import WaitingRoom from "../pages/Basic/WaitingRoom/WaitingRoom";
import Asynchronous from "../pages/Basic/Asynchronous/Asynchronous";
import Streaming from "../pages/Basic/Streaming/Streaming";
// import Perfil from "../pages/Basic/Perfil/Perfil";

// Other
import Error404 from "../pages/Error404";

const routes = [
	{
		path: "/dashboard",
		component: LayoutAdmin,
		exact: false,
		routes: [
			{
				path: "/dashboard",
				component: AdminHome,
				exact: true,
			},
			{
				path: "/dashboard/iniciarsesion",
				component: AdminSignIn,
				exact: true,
			},
			{
				path: "/dashboard/tiemporeal",
				component: AdminRealTime,
				exact: true,
			},
			{
				path: "/dashboard/historial",
				component: AdminHistory,
				exact: true,
			},
			{
				path: "/dashboard/usuarios",
				component: AdminUsers,
				exact: true,
			},
			{
				path: "/dashboard/preguntas",
				component: AdminQuestion,
				exact: true,
			},
			{
				path: "/dashboard/eventos",
				component: AdminEvents,
				exact: true,
			},
			{
				path: "/dashboard/agenda",
				component: AdminAgenda,
				exact: true,
			},
			{
				path: "/dashboard/opciones",
				component: AdminOptions,
				exact: true,
			},
			{
				component: Error404,
			},
		],
	},
	{
		path: "/",
		component: LayoutBasic,
		exact: false,
		routes: [
			{
				path: "/",
				component: SignIn,
				exact: true,
			},
			{
				path: "/iniciarsesion",
				component: SignIn,
				exact: true,
			},
			// {
			// 	path: "/registro",
			// 	component: SignUp,
			// 	exact: true,
			// },
			// {
			// 	path: "/registro-pago",
			// 	component: SignUpPay,
			// 	exact: true,
			// },
			// {
			// 	path: "/confirmacion",
			// 	component: Confirm,
			// 	exact: true,
			// },
			// {
			// 	path: "/salaespera",
			// 	component: WaitingRoom,
			// 	exact: true,
			// },
			// {
			// 	path: "/asincrono",
			// 	component: Asynchronous,
			// 	exact: true,
			// },
			{
			 	path: "/streaming",
			 	component: Streaming,
				exact: true,
			},
			// {
			// 	path: "/perfil",
			// 	component: Perfil,
			// 	exact: true,
			// },
			{
				component: Error404,
			},
		],
	},
];

export default routes;
