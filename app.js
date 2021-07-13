const express = require("express");
const path = require("path");
const http = require("http");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout/layout");

app.use(layouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, saveUninitialized: false, resave: false, }));
app.use(function(req, res, next) {
    //Always keep session.cart active
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

//Routers
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/cart", require("./routes/cart"));
app.use("/payment", require("./routes/payment"));
app.use("/account", require("./routes/account"));


//Sentry integration
Sentry.init({
    dsn: "https://b3463e65ed5642a79faa5c3994f106fa@o880882.ingest.sentry.io/5851197",
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler({ serverName: false, }));
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
        if (error.status === 404 || error.status === 500) {
            return true;
        }
        return false;
    }
}));


//Database - MongoDB - integration
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", function(err) {
    throw err; //Catch it sentry, if you can..
});

//Server integration
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port);

module.exports = app;