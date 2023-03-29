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

const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("./model/schemas").User;
const Admin = require("./model/schemas").Admin;

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
app.use(express.json());

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

passport.use("admin-local", Admin.createStrategy());

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

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

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

app.post("/image-clicked", (req, res) => {
  const imageId = req.body.id;
  console.log(`Image with ID ${imageId} clicked.`);

  // Perform any required action with the image ID
  // ...

  res.json({ message: `Image ID ${imageId} received.` });
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
  req.session.returnTo = req.headers.referer || '/';
  res.render("signin");
});

app.post("/signin", async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  // const redirectTo = req.session.returnTo || '/';

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        // req.session.returnTo = '/';
        // res.redirect(redirectTo);
        res.redirect('/');
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

app.get("/admin-logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/admin_login");
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  User.register(
    { username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName },
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
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.render("admin_login");
  });
});

app.post("/admin_login", (req, res) => {
  const admin = new Admin({
    username: req.body.username,
    password: req.body.password,
  });

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.login(admin, (err) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("admin-local")(req, res, () => {
          res.redirect('/admin_dashboard');
        });
      }
    });
  });
});

app.get("/admin_dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user.username);
    res.render("admin_dashboard");
  } else {
    res.redirect("/admin_login");
  }

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
      user: req.user,
    });
  } else {
    res.redirect("/signin");
  }
});

app.get("/information", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("information", {
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      address: req.user.address
    });
  } else {
    res.redirect("/signin");
  }
});

app.post("/information", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const addressName = req.body.addressName;
  const address = req.body.address;
  const subDistrict = req.body.subDistrict;
  const district = req.body.district;
  const province = req.body.province
  const country = req.body.country
  const zip = req.body.zip
  console.log(req.user);

  try {
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          "address.name": addressName,
          "address.location.address": address,
          "address.location.subDistrict": subDistrict,
          "address.location.district": district,
          "address.location.province": province,
          "address.location.country": country,
          "address.location.zip": zip
        }
      }
    );

    // After the update is successful, retrieve the updated user data
    const updatedUser = await User.findById(req.user.id);

    // After the update is successful, redirect to the /profile route
    console.log(updatedUser.firstName);
    res.render('profile', { user: updatedUser });
  } catch (error) {
    // Handle any errors that may occur during the update process
    console.error(error);
    res.status(500).send("An error occurred while updating user information");
  }
});

app.get("/add-menu", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user.username);
    res.render("addMenu");
  } else {
    res.redirect("/admin_login");
  }
});

app.post('/add-menu', async (req, res) => {
  const items = await Menu.find({});
  console.log(items.length);
  // const { title, category, price, img, desc, quantity } = req.body;
  console.log(req.body.title);
  // create a new menu object
  const newMenu = new Menu({
    _id: items.length,
    title: req.body.title,
    category: req.body.category,
    price: req.body.price,
    img: req.body.img,
    desc: req.body.desc,
    quantity: req.body.quantity
  });

  // save the new menu to MongoDB
  newMenu.save().then(() => {
    res.redirect("/manage-menu")
  }).catch(error => {
    console.error('Error saving menu', error);
    res.status(500).json({ error: 'Error saving menu' });
  });
});

app.get('/manage-menu/edit/:menuId', async (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user.username);
    try {
      const menuId = req.params.menuId;
      const menu = await Menu.findById(menuId);
      res.render('editMenu', { menu: menu });
      console.log(`Edit item with ID: ${menuId}`);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  } else {
    res.redirect("/admin_login");
  }

});

app.post('/edit-menu', async (req, res) => {
  try {
    await Menu.updateOne(
      { _id: req.body.menuId },
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          price: req.body.price,
          img: req.body.img,
          desc: req.body.desc,
          quantity: req.body.quantity,
        }
      }
    );

    var allmenu = await Menu.find().lean();
    res.render("manageMenu", {
      menus: allmenu,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating user information");
  }
});

app.get("/manage-menu", async (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user.username);
    var allmenu = await Menu.find().lean();
    res.render("manageMenu", {
      menus: allmenu,
    });
  } else {
    res.redirect("/admin_login");
  }
});

app.post('/manage-menu', async (req, res) => {
  const menuId = req.body.menuId;
  const action = req.body.action;
  // if (action === 'edit') {
  //   // Edit item logic
  //   const menu = await Menu.findById(menuId)
  //   res.render("editMenu", { menu: menu })
  //   console.log(`Edit item with ID: ${menuId}`);
  //   // res.send(`Edit item with ID: ${itemId}`);
  // } else 
  if (action === 'delete') {
    // Delete item logic
    await Menu.findByIdAndRemove(menuId)
      .then(() => {
        console.log(`Delete item with ID: ${menuId}`);
        res.redirect('/manage-menu');
      })
    // res.send(`Delete item with ID: ${itemId}`);
  } else {
    res.status(400).send('Invalid action');
  }
  // console.log(action);
});

//404 handling
// app.use((err, req, res, next) => {
//   res.status(404).catch(res.redirect("/"));
// });

app.listen(process.env.PORT, function () {
  console.log(`Server app listening on port ${process.env.PORT}`);
});
