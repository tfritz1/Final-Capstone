import {useState} from "react";
import {useHistory} from "react-router-dom";
import {listReservations} from "../utils/api";
import ReservationList from "../reservations/ReservationList";

function Search() {
	const [reservations, setReservations] = useState([]);
	const [mobileNumber, setMobileNumber] = useState("");
	const history = useHistory();
	const cancelHandler = () => history.goBack();

	const changeHandler = ({ target }) => {
		let value = target.value;
		setMobileNumber(value);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		const abortController = new AbortController();
		async function updateData() {
			try {
				const output = await listReservations(
					{ mobile_number: mobileNumber },
					abortController.signal
				);
				setReservations(output);
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
	};

	return (
		<main>
			<h1>Search</h1>
			<div className = "d-md-flex mb-3">
				<h4 className = "mb-0">Search for a reservation by mobile number:</h4>
			</div>
			<div>
				<form onSubmit = {submitHandler}>
					<input
						id = "mobile_number"
						type = "text"
						name = "mobile_number"
						onChange = {changeHandler}
						style = {{ width: "270px" }}
						placeholder = "Enter a customer's phone number"
						required/>{" "}
					&nbsp; &nbsp;
					<button type = "submit" className = "btn btn-success">
						Find
					</button>
					<button
						type = "button"
						className = "btn btn-dark mx-3"
						onClick = {cancelHandler}>
						Cancel
					</button>
				</form>
			</div>
			{reservations.length < 1 ? (
				<div className = "d-md-flex mb-3">
					<h4 className = "my-3">No reservations found</h4>
				</div>
				) : (
				<div>
					<ReservationList reservations={reservations} />
				</div>
			)}
		</main>
	);
}

export default Search;