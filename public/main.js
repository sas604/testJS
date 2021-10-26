let data = { cheesecake: 0 };

const incrementCount = () => {
  data.cheesecake++;
  window.document.getElementById('count').innerHTML = data.cheesecake;
};
const incrementButton = window.document.getElementById('increment-button');
incrementButton.addEventListener('click', incrementCount);

module.exports = { data, incrementCount };
