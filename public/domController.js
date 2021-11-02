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
