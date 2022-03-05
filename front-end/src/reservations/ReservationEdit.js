import {useState, useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import {readReservation, updateReservation} from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationEdit() {
	const { reservation_id } = useParams();
	const history = useHistory();
	const [error, setError] = useState("");

	const initialState = {
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
	};
	const [formData, setFormData] = useState({ ...initialState });

	useEffect(() => {
		const abortController = new AbortController();
		async function loadReservation() {
			try {
				const data = await readReservation(
					reservation_id,
					abortController.signal
				);
				setFormData(data);
			} catch (error) {
				return <ErrorAlert error={error} />;
			}
		}
		loadReservation();
		return () => abortController.abort();
	}, [reservation_id]);

	async function submitHandler(event) {
		event.preventDefault();
		const abortController = new AbortController();
		const formattedTime = formatTime();
		try {
			formData.reservation_time = formattedTime;
			formData.people = Number(formData.people);
			await updateReservation(formData, abortController.signal);
		} catch (error) {
			setError(error);
			return;
		}
		history.push(`/dashboard?date=${formData.reservation_date}`);
		return () => abortController.abort();
	}

	// For pm time
	function formatTime() {
		let cleanTime = formData.reservation_time
			.replace(/[\s:]/g, "")
			.toLowerCase();
		if (cleanTime.includes("pm")) {
			cleanTime = Number(cleanTime.slice(0, 4)) + 1200;
			cleanTime = String(cleanTime);
		}
		return `${cleanTime.slice(0, 2)}:${cleanTime.slice(2, 4)}`;
	}

	return (
		<div>
			<h1>Edit Reservation</h1>
			<div className = "d-md-flex mb-3">
				<h4>Complete all fields to edit a reservation</h4>
			</div>
			<hr></hr>
			<ReservationForm
				formData = {formData}
				setFormData = {setFormData}
				submitHandler = {submitHandler}
				error = {error}/>
		</div>
	);
}

export default ReservationEdit;