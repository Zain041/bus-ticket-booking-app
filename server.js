const express = require("express");
const app = express();
const path = require("path");

var cors = require("cors");
require("dotenv").config();
const connectDB = require("./DB/Connection");

connectDB();

app.get("/",(req,res)=>{
  res.send("api working")
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", require("./routes/users"));


app.use("/api", require("./routes/categories"));
app.use("/api", require("./routes/blogRoute"));
app.use("/api", require("./routes/bus"));
app.use("/api", require("./routes/stops"));
app.use("/api", require("./routes/bookings"));
// coupon routes



// app.use(express.static("./build"));
// app.get('/', (req, res) => {
//     res.json("works now")
// })

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.dirname(__dirname, "client", "build", "index.html"));
//   });
// }

const port = process.env.PORT || 4000; 
app.listen(port, (req, res) => {
  console.log(`server running ${port}`);
});
