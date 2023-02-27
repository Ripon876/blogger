const expres = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const gApi = require("./graphql");
const isAuth = require("./middleware/isAuth");
const PORT = process.env.PORT || 5000;
const app = expres();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("new connection");

	socket.on("joinThread", (id) => {
		socket.join(id);
		console.log("user joined room");
	});
});

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlparser: true,
	useUnifiedTopology: true,
});

app.use(expres.json());
app.use(cors());
app.use(isAuth);
app.use((req, res, next) => {
	req.io = io;
	next();
});
gApi(app); // adding graphql api with express

app.get("/", (req, res) => {
	res.send({
		status: "ok",
	});
});

server.listen(PORT, () => {
	console.log("server running at port => ", PORT);
});
