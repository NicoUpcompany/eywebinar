/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import flecha from "../../../assets/img/flecha.png";

const Dia1 = ({ setSaveData, abrirCerrar, state }) => {
	return (
		<>
			<div className="row4 border">
				<div className="tiempo">
					<p>Tiempo</p>
				</div>
				<div className="duracion">
					<p>Duración</p>
				</div>
				<div className="plenario">
					<p>Plenario</p>
				</div>
			</div>
			<div className="row2 grey" id="row1" style={{ transitionDuration: "1s" }}>
				<div className="fondoRow grey">
					<div className="tiempo">
						<p>
							11:00 <span>-</span> 11:05 hrs
						</p>
					</div>
					<div className="duracion">
						<p>5 minutos</p>
					</div>
					<div className="plenario">
						<p className="texto2">
							<img src={flecha} alt="" id="flecha1" onClick={() => abrirCerrar("imagen1", "flecha1")} />
							{state ? null : (
								<a onClick={() => setSaveData(3)} className="conFondo">
									ENTRAR AL SALÓN{" "}
								</a>
							)}
						</p>
						<p className="texto1">
							<strong>La nueva normalidad. El mundo, la sociedad y la empresa</strong>
						</p>
					</div>
				</div>
				<div className="imagenes" id="imagen1">
					<div className="espacio"></div>
					<div className="imagen">
						<div className="mita1">
							<div className="icon speaker"></div>
							<div className="nombrecolaborador">
								<span>Speaker</span>
								<br />
								<span>
									<strong>Nombre</strong>
								</span>
								<br />
								<span className="ultimo">Cargo</span>
								<br />
								<span className="ultimo">
									{" "}
									<strong>Empresa</strong>{" "}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row2" id="row2" style={{ transitionDuration: "1s" }}>
				<div className="fondoRow">
					<div className="tiempo">
						<p>
							11:00 <span>-</span> 11:05 hrs
						</p>
					</div>
					<div className="duracion">
						<p>5 minutos</p>
					</div>
					<div className="plenario">
						<p className="texto2">
							<img src={flecha} alt="" id="flecha2" onClick={() => abrirCerrar("imagen2", "flecha2")} />
							{state ? null : (
								<a onClick={() => setSaveData(3)} className="conFondo">
									ENTRAR AL SALÓN{" "}
								</a>
							)}
						</p>
						<p className="texto1">
							<strong>La nueva normalidad. El mundo, la sociedad y la empresa</strong>
						</p>
					</div>
				</div>
				<div className="imagenes" id="imagen2">
					<div className="espacio"></div>
					<div className="imagen">
						<div className="mita1">
							<div className="icon speaker"></div>
							<div className="nombrecolaborador">
								<span>Speaker</span>
								<br />
								<span>
									<strong>Nombre</strong>
								</span>
								<br />
								<span className="ultimo">Cargo</span>
								<br />
								<span className="ultimo">
									{" "}
									<strong>Empresa</strong>{" "}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row2 grey" id="row3" style={{ transitionDuration: "1s" }}>
				<div className="fondoRow grey">
					<div className="tiempo">
						<p>
							11:00 <span>-</span> 11:05 hrs
						</p>
					</div>
					<div className="duracion">
						<p>5 minutos</p>
					</div>
					<div className="plenario">
						<p className="texto2">
							<img src={flecha} alt="" id="flecha3" onClick={() => abrirCerrar("imagen3", "flecha3")} />
							{state ? null : (
								<a onClick={() => setSaveData(3)} className="conFondo">
									ENTRAR AL SALÓN{" "}
								</a>
							)}
						</p>
						<p className="texto1">
							<strong>La nueva normalidad. El mundo, la sociedad y la empresa</strong>
						</p>
					</div>
				</div>
				<div className="imagenes" id="imagen3">
					<div className="espacio"></div>
					<div className="imagen">
						<div className="mita1">
							<div className="icon speaker"></div>
							<div className="nombrecolaborador">
								<span>Speaker</span>
								<br />
								<span>
									<strong>Nombre</strong>
								</span>
								<br />
								<span className="ultimo">Cargo</span>
								<br />
								<span className="ultimo">
									{" "}
									<strong>Empresa</strong>{" "}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row2" id="row4" style={{ transitionDuration: "1s" }}>
				<div className="fondoRow">
					<div className="tiempo">
						<p>
							11:00 <span>-</span> 11:05 hrs
						</p>
					</div>
					<div className="duracion">
						<p>5 minutos</p>
					</div>
					<div className="plenario">
						<p className="texto2">
							<img src={flecha} alt="" id="flecha4" onClick={() => abrirCerrar("imagen4", "flecha4")} />
							{state ? null : (
								<a onClick={() => setSaveData(3)} className="conFondo">
									ENTRAR AL SALÓN{" "}
								</a>
							)}
						</p>
						<p className="texto1">
							<strong>La nueva normalidad. El mundo, la sociedad y la empresa</strong>
						</p>
					</div>
				</div>
				<div className="imagenes" id="imagen4">
					<div className="espacio"></div>
					<div className="imagen">
						<div className="mita1">
							<div className="icon speaker"></div>
							<div className="nombrecolaborador">
								<span>Speaker</span>
								<br />
								<span>
									<strong>Nombre</strong>
								</span>
								<br />
								<span className="ultimo">Cargo</span>
								<br />
								<span className="ultimo">
									{" "}
									<strong>Empresa</strong>{" "}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Dia1;
