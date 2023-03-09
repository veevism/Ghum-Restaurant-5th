var menu = [
  {
    id: 0,
    title: "buttermilk pancakes",
    category: "breakfast",
    price: 15.99,
    img: "./images/item-1.jpeg",
    desc: `I'm baby woke mlkshk wolf bitters live-edge blue bottle, hammock freegan copper mug whatever cold-pressed `,
    quantity: 0,
  },
  {
    id: 1,
    title: "diner double",
    category: "lunch",
    price: 13.99,
    img: "./images/item-2.jpeg",
    desc: `vaporware iPhone mumblecore selvage raw denim slow-carb leggings gochujang helvetica man braid jianbing. Marfa thundercats `,
    quantity: 0,
  },
  {
    id: 2,
    title: "godzilla milkshake",
    category: "shakes",
    price: 6.99,
    img: "./images/item-3.jpeg",
    desc: `ombucha chillwave fanny pack 3 wolf moon street art photo booth before they sold out organic viral.`,
    quantity: 0,
  },
  {
    id: 3,
    title: "country delight",
    category: "breakfast",
    price: 20.99,
    img: "./images/item-4.jpeg",
    desc: `Shabby chic keffiyeh neutra snackwave pork belly shoreditch. Prism austin mlkshk truffaut, `,
    quantity: 0,
  },
  {
    id: 4,
    title: "egg attack",
    category: "lunch",
    price: 22.99,
    img: "./images/item-5.jpeg",
    desc: `franzen vegan pabst bicycle rights kickstarter pinterest meditation farm-to-table 90's pop-up `,
    quantity: 0,
  },
  {
    id: 5,
    title: "oreo dream",
    category: "shakes",
    price: 18.99,
    img: "./images/item-6.jpeg",
    desc: `Portland chicharrones ethical edison bulb, palo santo craft beer chia heirloom iPhone everyday`,
    quantity: 0,
  },
  {
    id: 6,
    title: "bacon overflow",
    category: "breakfast",
    price: 8.99,
    img: "./images/item-7.jpeg",
    desc: `carry jianbing normcore freegan. Viral single-origin coffee live-edge, pork belly cloud bread iceland put a bird `,
    quantity: 0,
  },
  {
    id: 7,
    title: "american classic",
    category: "lunch",
    price: 12.99,
    img: "./images/item-8.jpeg",
    desc: `on it tumblr kickstarter thundercats migas everyday carry squid palo santo leggings. Food truck truffaut  `,
    quantity: 0,
  },
  {
    id: 8,
    title: "quarantine buddy",
    category: "shakes",
    price: 16.99,
    img: "./images/item-9.jpeg",
    desc: `skateboard fam synth authentic semiotics. Live-edge lyft af, edison bulb yuccie crucifix microdosing.`,
    quantity: 0,
  },
  {
    id: 9,
    title: "bison steak",
    category: "dinner",
    price: 22.99,
    img: "./images/item-10.jpeg",
    desc: `skateboard fam synth authentic semiotics. Live-edge lyft af, edison bulb yuccie crucifix microdosing.`,
    quantity: 0,
  },
  {
    id: 10,
    title: "chicago deep dish pizza",
    category: "lunch",
    price: 13.45,
    img: "./images/item-11.jpg",
    desc: `Mouthwatering Chicago-style deep dish pizza with gooey cheese, savory tomato sauce, and a crispy buttery crust.`,
    quantity: 0,
  },
  {
    id: 11,
    title: "boston cream pie",
    category: "desert",
    price: 5.54,
    img: "./images/item-12.jpg",
    desc: `Decadent Boston cream pie with layers of fluffy sponge cake, silky vanilla custard, and rich chocolate glaze.`,
    quantity: 0,
  },
];

function storageTranferSet(name, obj) {
  sessionStorage.setItem(name, JSON.stringify(obj));
}

function setBackward(name, obj) {
  storageTranferSet(name, obj);
}
//same

function setBackward(name) {
  storageTranferGet(name);
}

function storageTranferGet(name) {
  sessionStorage.getItem(name);
  return JSON.parse(sessionStorage.getItem(name));
}

// console.log(localStorage.getItem("Hello") + "Meow");

// function setBackward(obj, name) {
//   storageTranfer(obj, name);
// }
