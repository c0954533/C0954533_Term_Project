
// C0954533
// Sairam_Burri

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const currencyList = document.getElementById('currencies');
const compareList = document.getElementById('compare-list');
const show24hChange = document.getElementById('show-24h-change');
const sortOption = document.getElementById('sort-option');

let selectedCryptos = JSON.parse(localStorage.getItem('selectedCryptos')) || [];
let preferences = JSON.parse(localStorage.getItem('preferences')) || { show24hChange: false, sortBy: 'market_cap_desc' };

show24hChange.checked = preferences.show24hChange;
sortOption.value = preferences.sortBy;

async function fetchData() {
  const response = await fetch(`${API_URL}?vs_currency=usd&order=${preferences.sortBy}&per_page=50&page=1`);
  const data = await response.json();
  displayCurrencies(data);
  updateComparison(data);
}

function displayCurrencies(data) {
  currencyList.innerHTML = '';
  data.forEach(coin => {
    const div = document.createElement('div');
    div.className = 'currency';
    div.innerHTML = `
      <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
      <p>Price: $${coin.current_price}</p>
      ${preferences.show24hChange ? `<p>24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%</p>` : ''}
      <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
    `;
    div.addEventListener('click', () => toggleCompare(coin.id));
    currencyList.appendChild(div);
  });
}

function toggleCompare(id) {
  if (selectedCryptos.includes(id)) {
    selectedCryptos = selectedCryptos.filter(c => c !== id);
  } else if (selectedCryptos.length < 5) {
    selectedCryptos.push(id);
  } else {
    alert('You can only compare up to 5 cryptocurrencies.');
  }
  saveState();
  fetchData();
}

function updateComparison(data) {
  compareList.innerHTML = '';
  const selectedData = data.filter(coin => selectedCryptos.includes(coin.id));
  selectedData.forEach(coin => {
    const div = document.createElement('div');
    div.className = 'compare-item';
    div.innerHTML = `
      <h3>${coin.name}</h3>
      <p>Price: $${coin.current_price}</p>
      ${preferences.show24hChange ? `<p>24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%</p>` : ''}
      <button onclick=\"removeFromCompare('${coin.id}')\">Remove</button>
    `;
    compareList.appendChild(div);
  });
}

function removeFromCompare(id) {
  selectedCryptos = selectedCryptos.filter(c => c !== id);
  saveState();
  fetchData();
}

function saveState() {
  localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
  localStorage.setItem('preferences', JSON.stringify(preferences));
}

show24hChange.addEventListener('change', () => {
  preferences.show24hChange = show24hChange.checked;
  saveState();
  fetchData();
});

sortOption.addEventListener('change', () => {
  preferences.sortBy = sortOption.value;
  saveState();
  fetchData();
});

fetchData();
setInterval(fetchData, 60000); // Update every minute
