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
