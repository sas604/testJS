(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { addItem, data } = require('./inventoryController');

const updateItemList = (inventory) => {
  if (!inventory === null) return;
  localStorage.setItem('inventory', JSON.stringify(inventory));
  const inventoryList = window.document.getElementById('item-list');
  inventoryList.innerHTML = '';

  Object.entries(inventory).forEach(([itemName, quantity]) => {
    const listItem = window.document.createElement('li');
    listItem.innerHTML = `${itemName} - Quantity: ${quantity}`;
    inventoryList.appendChild(listItem);
    if (quantity < 5) {
      listItem.style.color = 'red';
    }
  });
  const inventoryContents = JSON.stringify(inventory);
  const p = window.document.createElement('p');
  p.innerHTML = `The inventory has been updated - ${inventoryContents}`;

  document.body.insertBefore(p, document.querySelector('script'));
};
const handleAddItem = (e) => {
  e.preventDefault();
  const { name, quantity } = e.target.elements;
  addItem(name.value, parseInt(quantity.value, 10));
  history.pushState({ inventory: { ...data.inventory } }, document.title);

  updateItemList(data.inventory);
};
const validItems = ['cheesecake', 'apple pie', 'carrot cake'];
const checkFormValues = () => {
  const itemName = document.querySelector(`input[name="name"]`).value;
  const quantity = document.querySelector(`input[name="quantity"]`).value;

  const itemNameIsEmpty = itemName === '';
  const itemNameIsInvalid = !validItems.includes(itemName);
  const quantityIsEmpty = quantity === '';

  const errorMsg = window.document.getElementById('error-msg');
  if (itemNameIsEmpty) {
    errorMsg.innerHTML = '';
  } else if (itemNameIsInvalid) {
    errorMsg.innerHTML = `${itemName} is not a valid item.`;
  } else {
    errorMsg.innerHTML = `${itemName} is valid!`;
  }

  const submitButton = document.querySelector(`button[type="submit"]`);
  if (itemNameIsEmpty || itemNameIsInvalid || quantityIsEmpty) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
};
const handleUndo = () => {
  if (history.state === null) return;
  history.back();
};
const handlePopstate = () => {
  data.inventory = history.state ? history.state.inventory : {};
  updateItemList(data.inventory);
};

module.exports = {
  updateItemList,
  handleAddItem,
  checkFormValues,
  handleUndo,
  handlePopstate,
};

},{"./inventoryController":2}],2:[function(require,module,exports){
const data = { inventory: {} };

const addItem = (itemName, quantity) => {
  const currentQuantity = data.inventory[itemName] || 0;
  data.inventory[itemName] = currentQuantity + quantity;
};

module.exports = { data, addItem };

},{}],3:[function(require,module,exports){
const { data } = require('./inventoryController');
const {
  updateItemList,
  handleAddItem,
  checkFormValues,
  handleUndo,
  handlePopstate,
} = require('./domController');

const storedInventory = JSON.parse(localStorage.getItem('inventory'));

if (storedInventory) {
  data.inventory = storedInventory;
  updateItemList(data.inventory);
}

const form = document.getElementById('add-item-form');
const undoButton = document.getElementById('undo-button');
undoButton.addEventListener('click', handleUndo);
window.addEventListener('popstate', handlePopstate);
form.addEventListener('input', checkFormValues);
form.addEventListener('submit', handleAddItem);
checkFormValues();

},{"./domController":1,"./inventoryController":2}]},{},[3]);
