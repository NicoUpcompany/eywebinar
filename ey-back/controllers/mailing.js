const fs = require("fs");
const path = require("path");

function getImage(req, res) {
	const image = req.params.image;
	const filePath = "./uploads/mailing/" + image;

	fs.exists(filePath, (exists) => {
		if (!exists) {
			res.status(404).send({
				ok: false,
				message: "Imagen no encontrada",
			});
		} else {
			res.sendFile(path.resolve(filePath));
		}
	});
}

module.exports = {
	getImage,
};
