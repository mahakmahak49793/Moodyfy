require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const journalRoutes = require("./routes/journalRoutes");
const moodRoutes = require("./routes/moodRoutes");
const gratitudeRoutes = require("./routes/gratitudeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/gratitude", gratitudeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
connectDB();

app.get("/", (req, res) => {
    res.send("Moodyfy API running...");
});

const protect = require("./middleware/authMiddleware");

app.get("/api/test", protect, (req, res) => {
    res.json({
        success: true,
        message: "Protected route accessed",
        user: req.user,
    });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});