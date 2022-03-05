import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router";
import {listTables, updateSeat, readReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
	const { reservation_id } = useParams();
	const history = useHistory();
	const [reservation, setReservation] = useState([]);
	const [tables, setTables] = useState([]);
	const [seatError, setSeatError] = useState({message: "Select a table."});

	const initialState = {
		table_id: "x",
	};
	const [formData, setFormData] = useState({ ...initialState });

	useEffect(loadResAndTables, [reservation_id]);

	function loadResAndTables() {
		const abortController = new AbortController();
		readReservation(reservation_id, abortController.signal).then(
			setReservation
		);
		listTables(abortController.signal).then(setTables);
		return () => abortController.abort();
	}

	const submitHandler = (e) => {
		e.preventDefault();
		const abortController = new AbortController();
		if (seatError === null) {
			async function updateData() {
				try {
					await updateSeat(
						formData.table_id,
						reservation_id,
						abortController.signal
					);
					history.push(`/dashboard`);
				} catch (error) {
					if (error.name === "AbortError") {
						console.log("Aborted");
					} else {
						throw error;
					}
				}
			}
			updateData();
			return () => {
				abortController.abort();
			};
		}
	};

	const changeHandler = ({ target }) => {
		let value = target.value;
		let foundTable = tables.filter((table) => table.table_id === Number(value));
		if (value === "x") {
			setSeatError({ message: "Please select a table" });
		} else {
			if (reservation.people > foundTable[0].capacity) {
				setSeatError({ message: "That table does not have enough room." });
			} else {
				setSeatError(null);
			}
		}
		setFormData({ ...formData, [target.name]: value });
	};

	return (
		<main>
			<h1>Seat Party</h1>
			<ErrorAlert error = {seatError}/>
			<div className = "d-md-flex mb-3">
				<div className = "col-sm-6">
					<div className = "card text-white bg-dark mb-3">
						<div className = "card-header">
							<h4>
								{reservation.first_name} {reservation.last_name}
							</h4>
						</div>
						<div className = "card-body">
							<h5 className = "card-title">Party Size: {reservation.people} </h5>
						</div>
					</div>
				</div>
				<div className = "col-sm-6">
					<div className = "card text-white bg-dark mb-3">
						<div className = "card-header">
							<h4>Select a Table</h4>
						</div>
						<div className = "card-body">
							<form onSubmit = {(e) => submitHandler(e)}>
								<select
									name = "table_id"
									onChange = {changeHandler}
									className = "form-control form-control-lg"
									value = {formData.table_id}>
									<option value="x">Select A Table</option>
									{tables.map((table) => (
										<option key = {table.table_id} value = {table.table_id}>
											{table.table_name} - {table.capacity}
										</option>
									))}
								</select>
								<br/>
								<br/>
								<button
									className = "btn btn-secondary"
									type = "button"
									onClick = {() => history.goBack()}>
									Cancel
								</button>{" "}
								&nbsp; &nbsp;
								<button type = "submit" className = "btn btn-primary">
									Submit
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<br/>
		</main>
	);
}

export default ReservationSeat;