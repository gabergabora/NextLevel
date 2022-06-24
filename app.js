const express = require('express');
const app = express()
const db = require('./config/database')
const index = require('./routes/index')
const cookieParser = require('cookie-parser')
const api = require('./routes/api')
const category = require('./routes/category')
const products = require('./routes/products')
const store = require('./routes/store')
const reservations = require('./routes/reservations')
const cart = require('./routes/cart')
const orders = require('./routes/orders')
const post = require('./routes/post')
const champion = require('./routes/champion')
const profile = require('./routes/profile')
const work = require('./routes/work')
const bodyParser = require('body-parser')
const flash = require('express-flash');
const session = require('express-session')
const methodOverride = require('method-override')

let PORT = 3000;

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(methodOverride("_method"))


app.use("/", index)
app.use("/api", api)
app.use("/admin", category)
app.use("/admin", products)
app.use("/store", store)
app.use("/reservation", reservations)
app.use("/cart", cart)
app.use("/admin/orders", orders)
app.use("/post", post)
app.use("/champion", champion)
app.use("/profile", profile)
app.use("/work", work)

app.listen(PORT, (err) => {
    if(err){
        console.log(err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
})