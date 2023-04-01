# Ghum Restaurant 5th

Ghum Restaurant is a web application built using Node.js and MongoDB. It's a restaurant website where users can select food items and add them to their cart. The admin can manage the menu by adding, updating, and deleting items.

## Features
- User can browse through the menu and select food items to add to their cart.
- User can view their cart and update the quantity of items or remove them.
- User can place an order by providing their name, email, and phone number.
- Admin can add new items to the menu.
- Admin can update existing items in the menu.
- Admin can delete items from the menu.

## Installation
1. Clone the repository:
```bash
git clone https://github.com/Vee-Sorawee/Ghum-Restaurant-5th.git
```
2. Navigate to the project directory:
```bash
cd Ghum-Restaurant-5th.git
```

3. Install the dependencies:
```bash
npm install
```

4. Set up the environment variables by creating a .env file in the root directory and adding the following variables:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/
```
5. Start the server:
```bash
npm start
```

6. Visit http://localhost:3000 in your web browser to access the application.

## Usage

### User
- Browse through the menu by clicking on the menu items in the navigation bar.
- Select an item to view its details and add it to your cart by clicking on the "Add to cart" button.
- View your cart by clicking on the cart icon in the navigation bar.
- Update the quantity of an item or remove it from your cart.
- Place an order by filling out the order form.

### Admin
- Log in as an admin by visiting http://localhost:3000/admin and entering the admin username and password.
- Add a new item to the menu by clicking on the "Add Item" button and filling out the form.
- Update an existing item in the menu by clicking on the "Edit" button next to the item and making changes in the form.
- Delete an item from the menu by clicking on the "Delete" button next to the item.

## Credits

The application was built by 
- 642115045 Sorawee Sriphakdeephongdej (Vee-Sorawee)
- 642115031 Phiriyakorn Maneekongrit (Webwebweb5)
