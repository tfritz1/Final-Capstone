import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {today} from "../utils/date-time";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationNew from "../reservations/ReservationNew";
import ReservationEdit from "../reservations/ReservationEdit";
import Search from "../search/Search";
import TablesForm from "../tables/TablesForm";
import ReservationSeat from "../reservations/ReservationSeat";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
	return (
		<Switch>
			<Route exact = {true} path = "/">
				<Redirect to = {"/dashboard"}/>
			</Route>
			<Route exact = {true} path = "/reservations">
				<Redirect to = {"/dashboard"}/>
			</Route>
			<Route path = "/dashboard/">
				<Dashboard date = {today()}/>
			</Route>
			<Route path = "/search">
				<Search/>
			</Route>
			<Route path = "/reservations/:reservation_id/seat">
				<ReservationSeat/>
			</Route>
			<Route path = "/reservations/new">
				<ReservationNew/>
			</Route>
			<Route path = "/reservations/:reservation_id/edit">
				<ReservationEdit/>
			</Route>
			<Route path = "/tables/new">
				<TablesForm date = {today()}/>
			</Route>
			<Route>
				<NotFound/>
			</Route>
		</Switch>
	);
}

export default Routes;