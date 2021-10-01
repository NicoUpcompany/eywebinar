import React, { useState } from "react";

import Dia1 from "./dia1";
import Dia2 from "./dia2";

import "./Agenda.scss";

const Agenda = (props) => {
	const [dia, setDia] = useState(4);
	const { agendaTime, state, setSaveData } = props;

	const abrirCerrar = (raw, flecha) => {
		try {
			const doc = document.getElementById(raw);
			const doc2 = document.getElementById(flecha);
			if (doc.style.display === "none") {
				doc2.style.transform = "rotate(360deg)";
				doc2.style.transitionDuration = "1s";
				doc.style.display = "block";
				doc.style.transitionDuration = "2s";
			} else {
				doc2.style.transform = "rotate(180deg)";
				doc.style.display = "none";
				doc2.style.transitionDuration = "1s";
				doc.style.transitionDuration = "1s";
			}
		} catch (error) {
			console.log("error");
		}
	};
	
	return (
		<>
			<div className="contenedorAgenda" id="agenda">
				<div className="days">
					<button
						id="4"
						className={dia === 4 ? "clase" : ""}
						onClick={() => setDia(4)}
					>
						Miércoles 04
					</button>
					<button
						id="5"
						className={dia === 5 ? "clase" : ""}
						onClick={() => setDia(5)}
					>
						Jueves 05
					</button>
				</div>
				{dia === 4 ? (
					<Dia1
						setSaveData={setSaveData}
						abrirCerrar={abrirCerrar}
						state={false}
					/>
				) : (
					<Dia2
						setSaveData={setSaveData}
						abrirCerrar={abrirCerrar}
						state={false}
					/>
				)}
			</div>
		</>
	);
};

export default Agenda;
