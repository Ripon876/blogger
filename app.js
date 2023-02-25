const expres = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const gApi = require("./graphql");
const isAuth = require("./middleware/isAuth");
const app = expres();

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlparser: true,
	useUnifiedTopology: true,
});

app.use(expres.json());
app.use(cors());
app.use(isAuth);

gApi(app); // adding graphql api with express

app.get("/", (req, res) => {
	res.send({
		status: "ok",
	});
});

app.listen(5000, () => {
	console.log("server running at port => ", 5000);
});
