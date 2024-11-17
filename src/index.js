const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;
const route = require("./routes");
const db = require("./config/db");
var methodOverride = require("method-override");

// connect to DB
db.connect();
app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(methodOverride("_method"));
// HTTP logger
// app.use(morgan('combined'));

// Template engine
// app.engine(
//   "hbs",
//   engine({
//     extname: "hbs",
//   })
// );
///
app.use("/uploads", express.static("uploads"));
///

app.engine(
  "hbs",
  engine({
    extname: "hbs", // doi ten hbs
    helpers: {
      sum: (a, b) => a + b,
      generateSeatID: (row, seatNumber) => generateSeatID(row, seatNumber),
    },
  })
);
function generateSeatID(row, seatNumber) {
  let rowLetter = "";
  while (row > 0) {
    let mod = (row - 1) % 26;
    rowLetter = String.fromCharCode(65 + mod) + rowLetter;
    row = Math.floor((row - 1) / 26);
  }
  return `${rowLetter}${seatNumber}`;
}
/////////
const session = require("express-session");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // đặt thành `true` khi dùng HTTPS
  })
);

////////
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Routes init
route(app);

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);

/////////////
