require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const menus = require("./public/js/menus");
const { json } = require("body-parser");
const db = require("./config/db");

const { Menu } = require("./model/schemas");
const { Cart } = require("./model/schemas");
const { Cart_Item } = require("./model/schemas");

// const ejs = require("ejs");
// const _ = require('lodash');

const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./model/schemas").User;

let menuList = [];
for (let i = 0; i < 10; i++) {
  menuList.push(
    new Menu({
      _id: menus.menu[i].id,
      title: menus.menu[i].title,
      category: menus.menu[i].category,
      price: menus.menu[i].price,
      img: menus.menu[i].img,
      desc: menus.menu[i].desc,
      quantity: menus.menu[i].quantity,
    })
  );
}

Menu.collection
  .insertMany(menuList)
  .then(() => {
    console.log("Menu has been successfully added to DB");
  })
  .catch(() => {
    console.log("Menu already been in DB");
  });

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/js", express.static(__dirname + "controller"));

//vvadded
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// start passport
app.use(passport.initialize());
// create session
app.use(passport.session());

db.connect();

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      picture: user.picture,
    });
  });
});

// console.log((await menuss).length);
// const menuDBLength = (await Menu.find({})).length;
// console.log(menuDBLength);

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/profile",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log(profile);
        // Find or create user in your database
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Create new user in database
          const username =
            Array.isArray(profile.emails) && profile.emails.length > 0
              ? profile.emails[0].value.split("@")[0]
              : "";
          const newUser = new User({
            username: profile.displayName,
            googleId: profile.id,
          });
          user = await newUser.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.get("/", async (req, res) => {
  //turn mongo obj into some kind of js array .lean()
  var allmenu = await Menu.find().lean();

  if (req.isAuthenticated()) {
    res.render("index", {
      menus: allmenu,
    });

    // const newCart = new Cart({
    //   user_id: req.user.id,
    //   paid_status: "unpaid",
    //   order_status: "ordering",
    //   delivery_status: "",
    //   payment_method: "",
    // });

    // const newCartItem = new Cart_Item({
    //   _id: 6,
    //   cart_id: 2,
    //   menu_id: 1,
    //   quantity: 0,
    // });

    // Cart.collection
    //   .insertOne(newCart)
    //   .then(console.log("Cart added successfully"));
    // Cart_Item.collection
    //   .insertOne(newCartItem)
    //   .then(console.log("Cart item added successfully"));
  } else {
    res.redirect("/signin");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/profile",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/signup");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/");
        });
      }
    }
  );
});

app.get("/admin_login", (req, res) => {
  res.render("admin_login");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.get("/payment", (req, res) => {
  res.render("payment");
});

app.get("/status", (req, res) => {
  res.render("status");
});

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user.firstName);
    res.render("profile", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      address: req.user.address,
    });
  } else {
    res.redirect("/signin");
  }
});

app.get("/information", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("information", {
      username: req.user.username,
    });
  } else {
    res.redirect("/signin");
  }
});

app.post("/information", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const address = req.body.address;
  console.log(req.user);
  // console.log(firstName);
  // console.log(lastName);
  // console.log(address);

  let foundUser = await User.findById(req.user.id);
  if (foundUser) {
    foundUser.firstName = firstName;
    foundUser.lastName = lastName;
    // foundUser.address = address
    foundUser.save().then(() => {
      res.redirect("/profile");
    });
  }
});

//404 handling
// app.use((err, req, res, next) => {
//   res.status(404).catch(res.redirect("/"));
// });

// console.log(new Error('A standard error'))

// console.log("mmm",menus.menu[3])

app.listen(process.env.PORT, function () {
  console.log(`Server app listening on port ${process.env.PORT}`);
});
