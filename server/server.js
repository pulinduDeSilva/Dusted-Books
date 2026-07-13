require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")
const cookieParser = require("cookie-parser");

const app = express();
connectDB();

//middleware
app.use(cors({
    origin: process.env.client_url,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`);
})

app.use("/api", require("./routes/authRoute"));
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/bookRoutes"));
app.use("/api", require("./routes/bookRequestRoutes"));


//test route
app.get("/", (req, res) => {
    res.send("API is running...")
});
