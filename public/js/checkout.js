// $(document).ready(function () {
//     console.log();

//     var checkArray = [];
//     const recievedMenu = storageTranferGet("forward");
//     storageTranferSet("backward", recievedMenu);

//     recievedMenu.forEach((element, i) => {
//         checkArray[element.id] = i;
//     });
//     // console.log(checkArray);

//     resetBadge();
//     resetTotal();

//     const checkoutCenter = document.querySelector("#container3");

//     displayCheckoutMenu(recievedMenu, checkoutCenter);

//     function resetBadge() {
//         var sum = 0;

//         recievedMenu.forEach((element) => {
//             sum += element.quantity;
//         });
//         $(".badge-item").text(sum);
//     }

//     function resetTotal() {
//         var sum = 0;
//         recievedMenu.forEach((element) => {
//             sum += element.quantity * element.price;
//         });
//         resetSuperTotal(sum);
//         $("#Total").text("$" + sum.toFixed(2));
//     }

//     function resetSuperTotal(sum) {
//         var addedExpense = $("#standard-deli").text();

//         $("#supertotal").text("$" + (sum + 2).toFixed(2));
//     }

//     $(".btn-link").on("click", function () {
//         var checkoutfoodid = this.parentNode.parentNode.children[0].children[0].id;
//         var checkoutfood = recievedMenu[checkArray[checkoutfoodid]];

//         console.log(checkoutfoodid);
//         console.log(recievedMenu);

//         if (this.children[0].className == "fas fa-plus") {
//             checkoutfood.quantity += 1;
//         } else if (this.children[0].className == "fas fa-minus") {
//             if (checkoutfood.quantity > 0) {
//                 checkoutfood.quantity -= 1;
//             }
//         }
//         resetBadge();
//         resetTotal();

//         storageTranferSet("backward", recievedMenu);
//     });

//     function checkquantity0fromlist() {
//         // for (let i = recievedMenu.length - 1; i > 0; i--) {
//         //   console.log(recievedMenu[i].quantity);

//         //   if (recievedMenu[i].quantity == 0) {
//         //     console.log(recievedMenu[i]);
//         //   }
//         // }
//         for (let i = 0; i < recievedMenu.length; i++) {
//             if (recievedMenu[i].quantity == 0) {
//                 // console.log(recievedMenu[i]);
//                 delete recievedMenu[i];
//                 break;
//                 console.log("H");
//             }
//         }
//         // console.log("s");
//         // recreateArray(recievedMenu);
//     }

//     function displayCheckoutMenu(menuItems, destination) {
//         let displayCheckMenu = recievedMenu.map((item) => {
//             return `<div
//         class="item row mb-4 d-flex justify-content-between align-items-center"
//       >
//         <div class="col-md-2 col-lg-2 col-xl-2">
//           <img
//             src=${item.img}
//             class="img-fluid rounded-3"
//             alt="Cotton T-shirt"
//             id="${item.id}"
//           />
//         </div>
//         <div class="col-md-3 col-lg-3 col-xl-3">
//           <h6 class="text-muted">${item.category}</h6>
//           <h6 class="text-black mb-0">${item.title}</h6>
//         </div>
//         <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
//           <button
//             class="btn btn-link px-2"
//             onclick="this.parentNode.querySelector('input[type=number]').stepDown()"
//           >
//             <i class="fas fa-minus"></i>
//           </button>

//           <input
//             id="form1"
//             min="0"
//             name="quantity"
//             value="${item.quantity}"
//             type="number"
//             class="form-control form-control-sm text-md-center input-number"
//             readonly
//           />

//           <button
//             class="btn btn-link px-2"
//             onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
//           >
//             <i class="fas fa-plus"></i>
//           </button>
//         </div>
//         <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
//           <h6 class="mb-0">${item.price}</h6>
//         </div>
//         <div class="col-md-1 col-lg-1 col-xl-1 text-end">
//           <a href="#!" class="text-muted"
//             ><i class="fas fa-times regression"></i
//           ></a>
//         </div>
//         <hr class="my-4" />
//       </div>
//       `;
//         });
//         displayCheckMenu = displayCheckMenu.join("");

//         destination.outerHTML = displayCheckMenu;
//     }

//     $(".regression").click(function () {
//         var exid = this.parentNode.parentNode.parentNode.children[0].children[0].id;

//         // recievedMenu[exid] = null;
//         delete recievedMenu[checkArray[exid]];
//         delete checkArray[exid];

//         // console.log(recievedMenu);
//         // console.log(checkArray);
//         storageTranferSet("backward", recievedMenu);
//         this.parentNode.parentNode.parentNode.remove();

//         resetBadge();
//         resetTotal();
//     });
// });
