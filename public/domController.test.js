/**
 * @jest-environment jsdom
 */
const { getByText, screen } = require('@testing-library/dom');
const fs = require('fs');
const { title } = require('process');

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync('./public/index.html');
});

const {
  updateItemList,
  handleUndo,
  handlePopstate,
} = require('./domController');

describe('updateItemList', () => {
  beforeEach(() => localStorage.clear());
  test('updates the DOM with inventory items', () => {
    const inventory = {
      cheesecake: 5,
      'apple pie': 2,
      'carrot-cake': 6,
    };
    updateItemList(inventory);
    const itemList = document.querySelector('#item-list');
    expect(itemList.childNodes).toHaveLength(3);

    expect(getByText(itemList, 'cheesecake - Quantity: 5')).toBeInTheDocument();
    expect(getByText(itemList, 'apple pie - Quantity: 2')).toBeInTheDocument();
    expect(
      getByText(itemList, 'carrot-cake - Quantity: 6')
    ).toBeInTheDocument();
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
  test('highlighting in red elements whose quantity is below five', () => {
    const inventory = { cheesecake: 5, 'apple pie': 2, 'carrot cake': 6 };
    updateItemList(inventory);

    expect(screen.getByText('apple pie - Quantity: 2')).toHaveStyle({
      color: 'red',
    });
  });
  test('updates the localStorage with the inventory', () => {
    const inventory = { cheesecake: 5, 'apple pie': 2 };
    updateItemList(inventory);
    expect(localStorage.getItem('inventory')).toEqual(
      JSON.stringify(inventory)
    );
  });
});

describe('test with history', () => {
  beforeEach((done) => {
    const clearHistory = () => {
      if (history.state === null) {
        window.removeEventListener('popstate', clearHistory);
        return done();
      }

      history.back();
    };

    window.addEventListener('popstate', clearHistory);

    clearHistory();
  });
  beforeEach(() => jest.spyOn(window, 'addEventListener'));

  afterEach(() => {
    const popstateListeners = window.addEventListener.mock.calls.filter(
      ([eventName]) => {
        return eventName === 'popstate';
      }
    );

    popstateListeners.forEach(([eventName, handlerFn]) => {
      window.removeEventListener(eventName, handlerFn);
    });

    jest.restoreAllMocks();
  });

  describe('handleUndo', () => {
    describe('handlePopstate', () => {
      test('updating the item list with the current state', () => {
        history.pushState(
          { inventory: { cheesecake: 5, 'carrot cake': 2 } },
          'title'
        );

        handlePopstate();

        const itemList = document.getElementById('item-list');
        expect(itemList.childNodes).toHaveLength(2);
        expect(
          getByText(itemList, 'cheesecake - Quantity: 5')
        ).toBeInTheDocument();
        expect(
          getByText(itemList, 'carrot cake - Quantity: 2')
        ).toBeInTheDocument();
      });
    });
    test('going back from an initial state', () => {
      jest.spyOn(history, 'back');
      handleUndo();

      expect(history.back.mock.calls).toHaveLength(0);
    });
    test('going back from a non-initial state', (done) => {
      window.addEventListener('popstate', () => {
        expect(history.state).toEqual(null);
        done();
      });
      history.pushState({ inventory: { cheesecake: 5 } }, title);
      handleUndo();
    });
  });
});
