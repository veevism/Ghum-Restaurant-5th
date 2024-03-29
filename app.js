require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const menus = require("./public/js/menus");
const categories = require("./public/js/categories");
const session = require("express-session");
const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// config
const db = require("./config/db");

// model schema
const { Menu } = require("./model/schemas");
const User = require("./model/schemas").User;
const Admin = require("./model/schemas").Admin;
const Cart = require("./model/schemas").Cart;
const Order = require("./model/schemas").Order;
const Category = require("./model/schemas").Category;

// add default menus
let menuList = [];
for (let i = 0; i < menus.menu.length; i++) {
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
  });

// add default category
let categoryList = [];
console.log(categories.category.length);
for (let i = 0; i < categories.category.length; i++) {
  categoryList.push(
    new Category({
      _id: categories.category[i].id,
      name: categories.category[i].category,
      description: categories.category[i].desc,
    })
  );
}

Category.collection
  .insertMany(categoryList)
  .then(() => {
    console.log("Category has been successfully added to DB");
  })
  .catch(() => {
  });

const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
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

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/profile",
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//     },
//     async function (accessToken, refreshToken, profile, done) {
//       try {

//         // Find or create user in your database
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           // Create new user in database
//           const username =
//             Array.isArray(profile.emails) && profile.emails.length > 0
//               ? profile.emails[0].value.split("@")[0]
//               : "";
//           const newUser = new User({
//             username: profile.displayName,
//             googleId: profile.id,
//           });
//           user = await newUser.save();
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

app.get("/", async (req, res) => {

  const allMenu = await Menu.find().lean();
  const categories = await Category.find().lean();
  if (req.isAuthenticated()) {
    const userId = req.user.id

    // Find the cart of the user
    let cart = await Cart.findOne({ userId: userId });

    // If the cart does not exist, create a new cart for the user
    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: [],
      });
    }

    await cart.save()

    const userCart = await Cart.find({ userId: req.user.id }).lean();

    res.render("index", {
      menus: allMenu,
      user: req.user,
      userId: req.user.id,
      carts: userCart[0].items,
      categories: categories,
    });
  } else {
    res.redirect("/signin");
  }
});

app.post("/cart/add", async (req, res) => {
  const userId = req.body.userId;
  const itemId = req.body.itemId;
  const quantity = req.body.quantity;

  try {
    // Find the cart of the user
    let cart = await Cart.findOne({ userId: userId });

    // If the cart does not exist, create a new cart for the user
    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: [],
      });
    }

    // Check if the item is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.itemId === itemId
    );


    if (existingItemIndex !== -1) {
      // If the item is already in the cart, update its quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If the item is not in the cart, add it with the specified quantity
      cart.items.push({ itemId: itemId, quantity: quantity });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).send("Item added to cart successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.post('/cart/clear', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  cart.items = [];
  await cart.save();
  res.redirect('/')
})

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile"] })
// );

// app.get(
//   "/auth/google/profile",
//   passport.authenticate("google", { failureRedirect: "/signin" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );

app.get("/signin", (req, res) => {
  req.session.returnTo = req.headers.referer || "/";
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
        res.redirect("/");
      });
    }
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  User.register(
    {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
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

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/checkout", async (req, res) => {
  const allmenu = await Menu.find().lean();
  if (req.isAuthenticated()) {
    const allItemInCart = await Cart.find({ userId: req.user.id }).lean();
    const allOrder = await Order.find({ userId: req.user.id }).lean();
    const user = await User.findById(req.user.id);

    // if (user.address === undefined) {
    //   user.address.location.address = "";

    //   await user.save()
    // }
    // Check if the user has an address
    if (user.address && user.address.location && user.address.location.address) {
      console.log('User has an address');
    } else {
      console.log('User does not have an address');
    }

    res.render("checkout", {
      carts: allItemInCart[0].items,
      menus: allmenu,
      user: user,
      orders: allOrder,
    });
  } else {
    res.redirect("/signin");
  }
});

app.post("/checkout", async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(400).send("No cart found for the user");
    }

    const userOrder = await Order.findOne({ userId: req.user.id }).lean();

    if (!userOrder || userOrder.status != 'Queuing' || userOrder.status != 'Paying') {
      // Create a new order
      const newOrder = new Order({
        userId: userId,
        items: cart.items,
        orderDate: new Date(),
        status: 'Paying',
      });

      // Save the new order
      await newOrder.save();

      // Empty the user's cart
      cart.items = [];
      await cart.save();
      res.redirect("/payment");
    } else if (userOrder.status == 'Queuing') {
      res.redirect("/status");
    } else {
      res.redirect('/payment')
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/cart/update", async (req, res) => {
  const userId = req.user.id;
  const itemId = req.body.itemId;
  const quantityChange = req.body.quantityChange;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(400).send("No cart found for the user");
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex((item) => item.itemId === itemId);

    if (itemIndex === -1) {
      return res.status(400).send("Item not found in the cart");
    }

    // Update the item quantity
    cart.items[itemIndex].quantity += quantityChange;

    // If the quantity is 0 or less, remove the item from the cart
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    // Save the updated cart
    await cart.save();

    res.status(200).send("Item quantity updated successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.post('/cart/delete', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  const itemIdToDelete = req.body.itemId; // Example itemId to find the index of
  const itemIndex = cart.items.findIndex((item) => item.itemId === itemIdToDelete);
  if (itemIndex !== -1) {
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.redirect('/checkout')
  } else {
    console.log('Item not found in cart');
  }
})

app.get("/payment", async (req, res) => {
  if (req.isAuthenticated()) {
    const allOrder = await Order.find({ userId: req.user.id }).lean();
    res.render("payment", {
      orders: allOrder,
      user: req.user,
    });
  } else {
    res.redirect("/signin");
  }
});

app.post('/order/update-status', async (req, res) => {

  // const allOrder = await Order.find({ userId: req.user.id }).lean();

  const orderId = req.body.orderId;
  const newStatus = req.body.newStatus;
  const role = req.body.role;

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).send('Order not found');
    }

    // Update the order status
    order.status = newStatus;
    order.orderDate = new Date();

    // Save the updated order
    await order.save();

    if (role == 'admin') {
      res.send('/admin_dashboard');
    }

    if (order.status == 'Queuing') {
      res.send('/status/' + orderId); // Send the URL as a response
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

app.get("/status/:orderId", async (req, res) => {
  if (req.isAuthenticated()) {
    const orderId = req.params.orderId
    // const userOrder = await Order.find({ userId: req.user.id }).lean();
    const userOrder = await Order.find({ userId: req.user.id, _id: orderId }).lean();
    console.log(userOrder);
    const allmenu = await Menu.find().lean();
    const user = await User.findById(req.user.id);
    res.render("status", {
      user: user,
      orders: userOrder,
      menus: allmenu,
    });
  } else {
    res.redirect("/signin");
  }
});

app.get("/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ _id: req.user.id }).lean()
    const userOrder = await Order.find({ userId: req.user.id }).lean();
    const allmenu = await Menu.find().lean();
    res.render("profile", {
      user: user,
      orders: userOrder,
      menus: allmenu
    });
  } else {
    res.redirect("/signin");
  }
});

app.get("/information", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("information", {
      user: req.user,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      address: req.user.address,
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
  const province = req.body.province;
  const country = req.body.country;
  const zip = req.body.zip;

  try {
    const user = await User.findById(req.user.id);

    user.firstName = firstName
    user.lastName = lastName
    user.address.name = addressName
    user.address.location.address = address
    user.address.location.subDistrict = subDistrict
    user.address.location.district = district
    user.address.location.province = province
    user.address.location.country = country
    user.address.location.zip = zip

    await user.save();

    res.redirect('/profile')
  } catch (error) {
    // Handle any errors that may occur during the update process
    console.error(error);
    res.status(500).send("An error occurred while updating user information");
  }
});

app.get("/history", async (req, res) => {
  if (req.isAuthenticated()) {
    const allmenu = await Menu.find().lean();

    const allOrder = await Order.find({ userId: req.user.id }).lean();
    res.render("history", {
      orders: allOrder,
      user: req.user,
      menus: allmenu,

    });
  } else {
    res.redirect("/signin");
  }
});

app.get("/about", async (req, res) => {
  res.render("about", {
    user: req.user,
  });
});

// admin
app.get("/admin_login", (req, res) => {
  // req.logout((err) => {
  //   if (err) {
  //     return next(err);
  //   }
  res.render("admin_login");
  // });
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
          res.redirect("/admin_dashboard");
        });
      }
    });
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

app.get("/admin_dashboard", async (req, res) => {
  const allmenu = await Menu.find().lean();
  const allOrder = await Order.find().lean();
  const allUser = await User.find().lean();

  if (req.isAuthenticated()) {
    res.render("admin_dashboard", {
      menus: allmenu,
      orders: allOrder,
      users: allUser,
    });
  } else {
    res.redirect("/admin_login");
  }
});

app.get("/add-menu", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("addMenu");
  } else {
    res.redirect("/admin_login");
  }
});

app.post("/add-menu", async (req, res) => {
  const items = await Menu.find({});
  // create a new menu object
  const newMenu = new Menu({
    _id: items.length,
    title: req.body.title,
    category: req.body.category,
    price: req.body.price,
    img: req.body.img,
    desc: req.body.desc,
    quantity: req.body.quantity,
  });

  // save the new menu to MongoDB
  newMenu
    .save()
    .then(() => {
      res.redirect("/manage-menu");
    })
    .catch((error) => {
      console.error("Error saving menu", error);
      res.status(500).json({ error: "Error saving menu" });
    });
});

app.get("/manage-menu/edit/:menuId", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const menuId = req.params.menuId;
      const menu = await Menu.findById(menuId);
      res.render("editMenu", { menu: menu });
      console.log(`Edit item with ID: ${menuId}`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.redirect("/admin_login");
  }
});

app.post("/edit-menu", async (req, res) => {
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
        },
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
    var allmenu = await Menu.find().lean();
    res.render("manageMenu", {
      menus: allmenu,
    });
  } else {
    res.redirect("/admin_login");
  }
});

app.post("/manage-menu", async (req, res) => {
  const menuId = req.body.menuId;
  const action = req.body.action;
  if (action === "delete") {
    // Delete item logic
    await Menu.findByIdAndRemove(menuId).then(() => {
      console.log(`Delete item with ID: ${menuId}`);
      res.redirect("/manage-menu");
    });
  } else {
    res.status(400).send("Invalid action");
  }
});


app.get("/find-address", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("findAddressById");
  } else {
    res.redirect("/admin_login");
  }
});

app.post('/user-address', async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.body.userId;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send('User not found');
      }

      // Redirect to the /user-profile route with the user ID as a parameter
      res.redirect(`/user-profile/${userId}`);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  } else {
    res.redirect("/admin_login");
  }
});


app.get("/user-profile/:userId", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.params.userId;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send('User not found');
      }

      res.render("user-profile", {
        user: user,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  } else {
    res.redirect("/admin_login");
  }
});

app.listen(process.env.PORT, function () {
  console.log(`Server app listening on port ${process.env.PORT}`);
});
