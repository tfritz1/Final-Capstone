import {useHistory} from "react-router-dom";
import {deleteTableReservation} from "../utils/api";

function FinishTable({table_id}) {
	const history = useHistory();

	async function finishHandler(e) {
		e.preventDefault();
		const abortController = new AbortController();

		const finishTable = window.confirm(
			"Is this table ready to seat new guests? This cannot be undone."
		);
		if (!finishTable) return history.push("/dashboard");
		try {
			await deleteTableReservation(table_id, abortController.signal);
		} catch (error) {
			console.log(error.message);
		}
		window.location.reload();
		return () => abortController.abort();
	}

	return (
		<button
			type = "button"
			className = "btn btn-success"
			data-table-id-finish = {table_id}
			onClick = {(e) => finishHandler(e)}>
			Finish
		</button>
	);
}

export default FinishTable;