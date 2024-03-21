let startDay = 0;
let finishDay = 30;
let cash = 3000;
let bank = 0;
let debt = -3000;
let exchanges = ['FTX', 'Coinbase', 'Kraken', 'Crypto.com', 'Bincance', 'Poloniex']

function init() {
    renderGameInformation();
    renderExchangeInformation();
}

function renderGameInformation() {
    let dayBox = document.getElementById('day-info');
    dayBox.innerHTML += `<h2>${startDay} / ${finishDay}</h2>`

    let cashBox = document.getElementById('cash-info');
    cashBox.innerHTML += `<h2>${formatFinanceValues(cash) }</h2>`

    let bankBox = document.getElementById('bank-info');
    bankBox.innerHTML += `<h2>${formatFinanceValues(bank)}</h2>`

    let debtBox = document.getElementById('debt-info');
    debtBox.innerHTML += `<h2>${formatFinanceValues(debt)}</h2>`
}

function formatFinanceValues(value) {
    let formatedNumber = value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    return formatedNumber;
}

function renderExchangeInformation() {
    let exchangeButtons = document.getElementById('exchange-box');
    

    for (let i = 0; i < exchanges.length; i++) {
        const exchange = exchanges[i];
        exchangeButtons.innerHTML += `
        <button class="exchange-buttons">${exchange}</button>
        `
    }
}