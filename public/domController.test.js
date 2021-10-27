/**
 * @jest-environment jsdom
 */

const fs = require('fs');

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync('./public/index.html');
});

const { updateItemList } = require('./domController');

describe('updateItemList', () => {
  test('updates the DOM with inventory items', () => {
    const inventory = {
      cheesecake: 5,
      'apple pie': 2,
      'carrot-cake': 6,
    };
    updateItemList(inventory);
    const itemList = document.querySelector('#item-list');
    expect(itemList.childNodes).toHaveLength(3);

    const nodeText = Array.from(itemList.childNodes).map(
      (node) => node.innerHTML
    );
    expect(nodeText).toContain('cheesecake - Quantity: 5');
    expect(nodeText).toContain('apple pie - Quantity: 2');
    expect(nodeText).toContain('carrot-cake - Quantity: 6');
  });
  test('adding a paragraph indicating what was the update', () => {
    const inventory = { cheesecake: 5, 'apple pie': 2 };
    updateItemList(inventory);
    const paragraphs = Array.from(document.querySelectorAll('p'));

    const updateParagraphs = paragraphs.filter((p) => {
      return p.innerHTML.includes('The inventory has been updated');
    });
    expect(updateParagraphs).toHaveLength(1);
    expect(updateParagraphs[0].innerHTML).toBe(
      `The inventory has been updated - ${JSON.stringify(inventory)}`
    );
  });
});
