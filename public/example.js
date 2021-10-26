const page = require('./page');

console.log(';');
console.log(page.window.document.body.innerHTML);

const paragraph = page.window.document.createElement('p');
paragraph.innerHTML = 'Look, I am a new paragraph';
page.window.document.body.appendChild(paragraph);

console.log('final body');
console.log(page.window.document.body.innerHTML);
