"use-strict";

//#region MODEL SECTION
// let todos;
let todosArr;

const savedTodos = JSON.parse(localStorage.getItem("todos"));
if (Array.isArray(savedTodos)) {
  todosArr = savedTodos;
} else {
  todosArr = [];
}

//creates a todo
function createTodo(title, datePicker) {
  const id = new Date().getTime();
  todosArr.push({
    title: title.value,
    dueDate: datePicker.value,
    id: id,
  });
  saveTodos();
}

//deletes a todo
function removeTodo(idToDelete) {
  todosArr = todosArr.filter((todo) => {
    //if the id of this todo matches idToDelete, return false and remove from todos array
    //for everything else, return true
    if (todo.id === +idToDelete) {
      return false;
    } else {
      return true;
    }
  });
  saveTodos();
}
function setEditing(todoId) {
  todosArr.forEach((todo) => {
    if (todo.id === todoId) {
      todo.isEditing = true;
    }
  });
  saveTodos();
}
function updateTodo(todoId, newTitle, newDate) {
  todosArr.forEach((todo) => {
    if (todo.id === todoId) {
      todo.title = newTitle;
      todo.dueDate = newDate;
      todo.isEditing = false;
    }
  });
  saveTodos();
}
function toggleTodo(todoId, checked) {
  todosArr.forEach((todo) => {
    if (todo.id === todoId) {
      todo.isDone = checked;
      chkDone.addEventListener("change", strikeTodo);
    }
  });
  saveTodos();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todosArr));
}
//#endregion

//#region CONTROLLER SECTION
//add validation, send notifications, data collection, backend server

function addTodo() {
  const title = document.getElementById("todo-title");
  //push the value of textbox to array
  const datePicker = document.getElementById("datePicker");
  // const isDone = document.getElementById("chkDone");
  // const dueDate = datePicker.value;
  createTodo(title, datePicker);
  title.value = "";
  datePicker.value = "";
  //call render function
  render();
}
// function deleteTodo(e) {
//   const btnDelete = e.target;
//   const idToDelete = btnDelete.id;
//   removeToDo(idToDelete);
//   render();
// }
const onDelete = (todoToDelete) => {
  return () => {
    removeTodo(todoToDelete.id);
    render();
  };
};
function onEdit(e) {
  const btnEdit = e.target;
  const todoId = btnEdit.dataset.todoId;
  setEditing(todoId);
  render();
}
function onUpdate(e) {
  const btnUpdate = e.target;
  const todoId = btnUpdate.dataset.todoId;
  const textbox = document.getElementById(`edit-title-${todoId}`);
  const newTitle = textbox.value;
  const datePicker = document.getElementById(`edit-date-${todoId}`);
  const newDate = datePicker.value;
  updateTodo(todoId, newTitle, newDate);
  render();
}
function strikeTodo(e) {
  const chkbox = e.target;
  const todoId = chkbox.dataset.todoId;
  const checked = chkbox.checked;
  toggleTodo(todoId, checked);
  render();
}

//#endregion

//#region VIEW SECTION
const btnAddTodo = document.createElement("button");
const dtpDatePicker = document.createElement("input");
const todoList = document.createElement("div");
const txtTodoTitle = document.createElement("input");

const modal = document.createElement("div");
const modalContent = document.createElement("div");
const nameInput = document.createElement("input");
const btnTest = document.createElement("button");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();

modal.setAttribute("id", "welcomeModal");
modalContent.setAttribute("class", "welcomeModalContent");
nameInput.setAttribute("id", "firstName");
nameInput.setAttribute("type", "text");
nameInput.setAttribute("placeholder", "Your name");
modalContent.innerHTML = "<span>Welcome! Please enter your first name:</span>";
modalContent.appendChild(nameInput);
modalContent.appendChild(btnTest);
document.body.appendChild(modal);
btnTest.innerText = "Enter";
modal.appendChild(modalContent);

txtTodoTitle.setAttribute("id", "todo-title");
txtTodoTitle.setAttribute("type", "text");
txtTodoTitle.setAttribute("placeholder", "Add to do here");
document.body.appendChild(txtTodoTitle);

dtpDatePicker.setAttribute("type", "date");
dtpDatePicker.setAttribute("id", "datePicker");
dtpDatePicker.setAttribute("min", `${year}-${month}-${day}`);
document.body.appendChild(dtpDatePicker);

btnAddTodo.setAttribute("id", "btnAddToDo");
btnAddTodo.innerText = "Add Todo";
document.body.appendChild(btnAddTodo);

document.body.appendChild(todoList);
todoList.setAttribute("id", "todo-list");
btnAddTodo.addEventListener("click", addTodo);
render();

function render() {
  //reset list to be empty
  document.getElementById("todo-list").innerHTML = "";
  //for each item in todos array todo item text = textbox value
  //todo list item is appended to todo list
  todosArr.forEach((todo) => {
    const div = document.createElement("div");

    // const edit = document.getElementById("btnEdit");
    if (todo.isEditing === true) {
      const textbox = document.createElement("input");
      textbox.setAttribute("type", "text");
      textbox.setAttribute("id", `edit-title-${todo.id}`);
      div.appendChild(textbox);

      const datePicker = document.createElement("input");
      datePicker.setAttribute("type", "date");
      datePicker.setAttribute("id", `edit-date-${todo.id}`);
      div.appendChild(datePicker);

      const btnUpdate = document.createElement("button");
      btnUpdate.innerText = "Update";
      btnUpdate.dataset.todoId = todo.id;
      btnUpdate.addEventListener("click", onUpdate);
      div.appendChild(btnUpdate);
    } else {
      const chkbox = document.createElement("input");
      chkbox.setAttribute("id", "chkDone");
      chkbox.setAttribute("type", "checkbox");

      chkbox.dataset.todoId = todo.id;
      if (todo.isDone === true) {
        chkbox.checked = true;
      } else {
        chkbox.checked = false;
      }

      div.setAttribute("id", todo.id);
      div.setAttribute("class", "todo");
      div.innerHTML = `<span id='title'>${todo.title}</span> <span id="due">${todo.dueDate}</span>`;

      const btnDelete = document.createElement("button");
      btnDelete.innerText = "❌";
      btnDelete.id = todo.id;
      btnDelete.style.marginLeft = "5px";
      btnDelete.addEventListener("click", onDelete(todo));

      const btnEdit = document.createElement("button");
      btnEdit.setAttribute("id", "btnEdit");
      btnEdit.innerText = "🖊";
      btnEdit.style.marginLeft = "5px";
      btnEdit.dataset.todoId = todo.id;
      btnEdit.addEventListener("click", onEdit);

      div.prepend(chkbox);
      div.appendChild(btnEdit);
      div.appendChild(btnDelete);

      const todoItem = document.getElementById("todo-list");
      todoItem.appendChild(div);
    }
  });
}
function greeting() {
  // console.log(`Hello ${firstName}`);
  // document.title = `☑${firstName}'s Todo List☑`;
  if (localStorage.username) {
    modal.style.display = "none";
    document.title = `☑${JSON.parse(localStorage.username)}'s Todo List☑`;
  } else
    window.onload = () => {
      modal.style.display = "block";
      document.title = `☑Todo List☑`;
    };
}
btnTest.onclick = () => {
  let username = "";
  modal.style.display = "none";
  username = firstName.value;
  document.title = `☑${username}'s Todo List☑`;
  localStorage.setItem("username", JSON.stringify(username));
};
greeting();
//#endregion

//#region TEST AREA
// let button = document.createElement("button");
// button.innerText = "button 1";
// document.body.appendChild(button);
// button.setAttribute("id", "button1");
// let btn1 = document.getElementById("button1");
// btn1.addEventListener("click", done);

// function done() {
//   btn1.innerText = "Done";
// }

// let divCounter = document.createElement("div");
// divCounter.innerText = 0;
// divCounter.setAttribute("id", "counter");
// document.body.appendChild(divCounter);

// let btnUp = document.createElement("button");
// btnUp.innerText = "+";
// btnUp.setAttribute("id", "btnUp");
// document.body.appendChild(btnUp);
// let count = 0;
// btnUp.addEventListener("click", increase);

// let btnDown = document.createElement("button");
// btnDown.innerText = "-";
// btnDown.setAttribute("id", "btnDown");
// document.body.appendChild(btnDown);

// btnUp.addEventListener("click", increase);
// btnDown.addEventListener("click", decrease);

// function increase() {
//   count++;
//   divCounter.innerText = count;
// }

// function decrease() {
//   count--;
//   divCounter.innerText = count;
// }

// //create the shopping cart div
// const clearBtn = document.createElement("button");
// const shoppingCart = document.createElement("div");
// const receiptSubtotal = document.createElement("div");
// const receiptTotal = document.createElement("div");
// let foodArray = [
//   { name: "Apple", price: 1, quantity: 3 },
//   { name: "Tomato", price: 2, quantity: 2 },
//   { name: "Eggs", price: 3, quantity: 1 },
// ];

// //create the food buttons dynamically from the array
// for (let i = 0; i < foodArray.length; i++) {
//   const foodBtn = document.createElement("button");
//   foodBtn.setAttribute("id", "foodBtn");
//   foodBtn.innerText = [foodArray[i].name];
//   document.body.appendChild(foodBtn);
//   foodBtn.addEventListener("click", (e) => addToCart(e.target.innerText));
//   foodBtn.style.marginTop = "10px";
//   foodBtn.style.marginRight = "4px";
// }

// // create the clear button
// clearBtn.setAttribute("id", "clearBtn");
// clearBtn.innerText = "Clear";
// clearBtn.addEventListener("click", clearCart);
// document.body.appendChild(clearBtn);

// //create the shoppingCart div
// shoppingCart.setAttribute("id", "cart");
// shoppingCart.style.marginTop = "10px";
// document.body.appendChild(shoppingCart);

// receiptSubtotal.setAttribute("id", "receiptSubtotal");
// receiptSubtotal.style.background = "darkOrange";
// receiptSubtotal.style.width = "fit-content";
// receiptSubtotal.style.padding = "2px";

// document.body.appendChild(receiptSubtotal);

// receiptTotal.setAttribute("id", "receiptTotal");
// receiptTotal.style.background = "maroon";
// receiptTotal.style.width = "fit-content";
// receiptTotal.style.padding = "2px";
// receiptTotal.style.marginBottom = "10px";
// receiptTotal.style.borderTop = "5px solid black";
// document.body.appendChild(receiptTotal);

// function displayReceipt(cartArray) {
//   const receipt = document.getElementById("receiptSubtotal");
//   receipt.innerHTML = "";
//   cartArray.forEach((i) => {
//     const receiptSubtotalLine = document.createElement("div");
//     receiptSubtotalLine.innerText = `${i.name} $${i.price} * ${i.quantity} = $${
//       i.price * i.quantity
//     }`;
//     receipt.appendChild(receiptSubtotalLine);
//   });
// }

// function addToCart(food) {
//   const cart = document.getElementById("cart");
//   const cartItem = document.createElement("div");
//   cartItem.innerText = food;
//   cart.appendChild(cartItem);
// }

// function clearCart() {
//   cart.innerHTML = "";
// }

// function cartTotal(cartArray) {
//   let cartArrayTotal = 0;
//   cartArray.forEach((i) => {
//     cartArrayTotal += i.price * i.quantity;
//   });
//   receiptTotal.innerText = `Cart total = $${cartArrayTotal}`;
// }

// let total = 0;
// function createCart(foodPrices) {
//   const foods = Object.keys(foodPrices);
//   foods.forEach((i) => {
//     const cartItem = document.createElement("div");
//     const foodName = foodPrices.reduce((a, o) => (a.push(o.name), a), []);
//     const foodPrice = foodPrices.reduce((a, o) => (a.push(o.price), a), []);
//     cartItem.innerText = `${foodName[i]} $${foodPrice[i]}`;
//     const addBtn = document.createElement("button");
//     addBtn.style.marginLeft = "5px";
//     addBtn.addEventListener("click", add);
//     addBtn.innerText = "Add";

//     function add() {
//       total += foodPrice[i];

//       totalCounter.innerText = `TOTAL: $${total}`;
//     }

//     cartItem.appendChild(addBtn);
//     document.body.appendChild(cartItem);
//   });
//   const totalCounter = document.createElement("div");
//   totalCounter.style.width = "fit-content";
//   totalCounter.style.borderTop = "5px solid black";
//   totalCounter.style.padding = "2px";
//   totalCounter.style.minWidth = "100px";
//   totalCounter.style.background = "maroon";
//   document.body.appendChild(totalCounter);
// }
// cartTotal(foodArray);
// displayReceipt(foodArray);
// createCart(...[foodArray]);

// const textbox = document.createElement("input");
// document.body.appendChild(textbox);
// textbox.setAttribute("id", "textbox");
// textbox.setAttribute("placeholder", "Insert measurement");
// for (let i = 0; i < 2; i++) {
//   const btn = document.createElement("button");
//   document.body.appendChild(btn);
//   btn.setAttribute("id", "btn" + i);
//   btn.addEventListener("click", convert);
// }
// btn0.innerText = "Convert to cm";
// btn1.innerText = "Convert to inch";

// const result = document.createElement("div");
// result.setAttribute("id", "result");
// result.style.backgroundColor = "red";

// document.body.appendChild(result);

// function convert(e) {
//   if (e.target === btn0) {
//     result.innerText = +textbox.value * 2.54;
//   } else if (e.target === btn1) {
//     result.innerText = +textbox.value / 2.54;
//   }
// }

// // function toUpper(str) {
// //   console.log(str.toUpperCase());
// // }

// // toUpper("string");

// const tempArr = [0, 10, 5, 20, -2, -30];
// // function aboveFreezing(temps) {
// //   const tempsAboveFreezing = temps.filter((temp) => {
// //     return temp > 0;
// //   });
// //   // return console.log(tempsAboveFreezing);
// //   return tempsAboveFreezing;
// // }

// // aboveFreezing(tempArr);

// foodArray[0].color = "red";
// foodArray[1].color = "red";
// foodArray[2].color = "white";
// function removeRed(food) {
//   return food.filter((red) => {
//     // return console.log("not red", red.color !== "red");
//     return red.color !== "red";
//   });
// }
// removeRed(foodArray);

// function max(arr) {
//   let max = -Infinity;
//   arr.forEach((num) => {
//     if (num > max) {
//       max = num;
//     }
//     return console.log(max);
//   });
//   // return console.log("My way", Math.max.apply(Math, arr));
// }

// function min(arr) {
//   return console.log("My way", Math.min.apply(Math, arr));
// }

// function greaterThanZero(arr) {
//   let min = Infinity;
//   arr.forEach((num) => {
//     if (num < 0) {
//       return;
//     } else if (num < min) {
//       min = num;
//     }
//   });
//   return console.log(min);
// }

// max(tempArr);
// min(tempArr);
// greaterThanZero(tempArr);

// let fruitArr = ["cherry", "apple", "orange", "apple", "banana", "apple"];

// function pickApples(fruit) {
//   let applesPicked = 0;
//   const filteredArr = fruit.filter((fruits) => {
//     if (applesPicked >= 2) {
//       return true;
//     } else if (fruits === "apple") {
//       ++applesPicked;
//       return false;
//     } else {
//       return true;
//     }
//   });
//   return console.log(filteredArr);
//   // unique = [...new Set(fruit)];
//   // return console.log(unique);
// }
// function pickLastApples(fruit) {
//   let applesPicked = 0;
//   fruit.reverse();
//   const filteredArr = fruit.filter((fruits) => {
//     if (applesPicked >= 2) {
//       return true;
//     } else if (fruits === "apple") {
//       ++applesPicked;
//       return false;
//     } else {
//       return true;
//     }
//   });
//   return console.log(filteredArr.reverse());
//   // unique = [...new Set(fruit)];
//   // return console.log(unique);
// }
// function pickFruits(fruit) {
//   let applesPicked = 0;
//   let orangesPicked = 0;

//   const filteredArr = fruit.filter((fruits) => {
//     if (fruits === "apple") {
//       if (applesPicked >= 2) {
//         return true;
//       } else {
//         ++applesPicked;
//         return false;
//       }
//     } else if (fruits === "orange") {
//       if (orangesPicked >= 1) {
//         return true;
//       } else {
//         ++orangesPicked;
//         return false;
//       }
//     } else {
//       return true;
//     }
//     // unique = [...new Set(fruit)];
//     // return console.log(unique);
//   });
//   return console.log(filteredArr);
// }

// pickApples(fruitArr);
// pickFruits(fruitArr);
// pickLastApples(fruitArr);
//#endregion
