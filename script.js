let startDay = 0;
let finishDay = 30;
let cash = 3000;
let bank = 0;
let debt = -3000;
let exchanges = ['FTX', 'Coinbase', 'Kraken', 'Crypto.com', 'Bincance', 'Poloniex'];
let cryptoCurrencys = [] // comple JSON Data
let stockExchangeOffer = [];
let minPercentagePrice = 0.65;
let maxPercentagePrice = 1.35;
let tokenStorage = []
let quantity;


async function getCurrencyData() {
    let response = await fetch('./cryptocurrencys.json');
    cryptoCurrencys = await response.json();
}


async function init() {
    await getCurrencyData();
    renderGameInformation();
    renderExchangeInformation();
    await renderExchangeSupply();
    await renderStorageTable();
}

function renderGameInformation() {
    let dayBox = document.getElementById('day-info');
    dayBox.innerHTML = `<h2>Day:</h2><h2>${startDay} / ${finishDay}</h2>`

    let cashBox = document.getElementById('cash-info');
    cashBox.innerHTML = `<h2>Cash:</h2><h2>${formatFinanceValues(cash) }</h2>`

    let bankBox = document.getElementById('bank-info');
    bankBox.innerHTML = `<h2>Bank:</h2><h2>${formatFinanceValues(bank)}</h2>`

    let debtBox = document.getElementById('debt-info');
    debtBox.innerHTML = `<h2>Debt:</h2><h2>${formatFinanceValues(debt)}</h2>`
}


function formatFinanceValues(value) {
    let formatedNumber = value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    return formatedNumber;
}


function renderExchangeInformation() {
    let exchangeButtons = document.getElementById('exchange-box');
    
    for (let i = 0; i < exchanges.length; i++) {
        const exchange = exchanges[i];
        exchangeButtons.innerHTML += /*html*/`
        <button class="buttons">${exchange}</button>
        `
    }
}


async function renderExchangeSupply() {
    uniqueRandomNumbers();
    let supplyTable = document.getElementById('exchange-supply-table');

    supplyTable.innerHTML = renderExchangeSupplyTableHeaderHTML();

    for (let i = 0; i < stockExchangeOffer.length; i++) {
        const currency = cryptoCurrencys[stockExchangeOffer[i]];
        let currencyPrice = currency.price * percentagePriceGenerator(minPercentagePrice, maxPercentagePrice);
        supplyTable.innerHTML += renderExchangeSupplyHTML(i, currency, currencyPrice) ;
    }
}

async function renderStorageTable() {
    let storageTable = document.getElementById('storage-table');
    storageTable.innerHTML = renderStorageTableHeaderHTML();
    for (let i = 0; i < tokenStorage.length; i++) {
        const storageCurrency = tokenStorage[i]

        storageTable.innerHTML += renderStorageHTML(i, storageCurrency);
    }
}


function uniqueRandomNumbers() {
    stockExchangeOffer = [];
    let exchangeSupplyIndex = generateRandomIndexCount(); // generiert eine zahl zwischen 5-10
    while (stockExchangeOffer.length < exchangeSupplyIndex) {
        let randomIndex = RandomIndexFromJSonLength() // generiert eine zahl zwischen 0-9
        if (!stockExchangeOffer.includes(randomIndex)) {
            stockExchangeOffer.push(randomIndex)
        }
    }
    stockExchangeOffer.sort()
    // console.log(stockExchangeOffer)
}

function percentagePriceGenerator(min, max) {
    return Math.random() * (max - min) + min;
}

// generiert eine zahl zwischen 5-10
function generateRandomIndexCount() {
    return Math.floor(Math.random() * (cryptoCurrencys.length - 6 + 1)) + 6; 
}


// generiert eine zahl zwischen 0-9
function RandomIndexFromJSonLength() {
    return Math.floor(Math.random() * cryptoCurrencys.length) + 1 - 1 
}

async function buyCurrency(i) {
    let currencyName = document.getElementById(`currency-name-${i}`).innerHTML;
    let currencyPrice = document.getElementById(`currency-price-${i}`).innerHTML;
    let priceAsFloat = convertStringToFloat(currencyPrice)
    let searchedCurrency = cryptoCurrencys.find(currency => currency.name === currencyName);
    quantity = cash / priceAsFloat
    
    if (cash < priceAsFloat) {
        alert('you cant buy more')
        return
    }

    cash -= quantity * priceAsFloat
    let boughtCurrency = {
        "name": searchedCurrency.token,
        "logo": searchedCurrency.logo,
        "quantity": quantity.toFixed(4),
        "buyprice": priceAsFloat,
        "token": searchedCurrency.token
    }
    tokenStorage.push(boughtCurrency)
    renderStorageTable()
    renderGameInformation()
}


function convertStringToFloat(currencyPrice) {
    let floatPrice = currencyPrice.replace('&nbsp;€', '').replace('.', '').replace(',', '.');
    return floatPrice
}


function openTradeMenu(i) {
    let bodyContainer = document.getElementById(`body`);
    let currencyName = document.getElementById(`currency-name-${i}`).innerHTML;
    let currencyPrice = document.getElementById(`currency-price-${i}`).innerHTML;
    let priceAsFloat = convertStringToFloat(currencyPrice)
    let searchedCurrency = cryptoCurrencys.find(currency => currency.name === currencyName);
    quantity = cash / priceAsFloat
    total = priceAsFloat * quantity

    bodyContainer.innerHTML += /*html*/`
        <div id="trade-background" onclick="closeTradeWindow()">
            <div class="trade-menu" onclick="stopclickingthrough(event)">
                <span class="topic">Buy Order</span>
                <div class="buy-info-box"><h3>Currency Price</h3> <h3>${currencyPrice}</h3></div>
                <div class="buy-info-box"><h3>Amount</h3> <h3><span id="amount">${quantity.toFixed(4)}</span> ${searchedCurrency.token}</h3></div>
                <div class="d-flex-between">
                    <button class="buttons btn-trade-menu" onclick="quantityChanger('100')">(100%)</button>
                    <button class="buttons btn-trade-menu" onclick="quantityChanger('75')">(75%)</button>
                    <button class="buttons btn-trade-menu" onclick="quantityChanger('50')">(50%)</button>
                    <button class="buttons btn-trade-menu" onclick="quantityChanger('25')">(25%)</button>
                </div>
                <div class="buy-info-box"><h3>Total</h3> <h3><span id="total">${total}</span> €</h3></div>
                <div class="d-flex-center d-gap">
                    <button class="buttons btn-trade-menu buy-sell-btn color-green">Buy</button>
                    <button class="buttons btn-trade-menu buy-sell-btn color-red" onclick="closeTradeWindow()">Cancel</button>
                </div>
            </div>
        </div>
    `
}


function closeTradeWindow() {
    document.getElementById('trade-background').remove()
}

function stopclickingthrough(event) {
    event.stopPropagation()
}

function quantityChanger(percent) {
    let amount = convertStringToFloat(document.getElementById('amount').innerHTML);
    let total = convertStringToFloat(document.getElementById('total').innerHTML);

    console.log(amount)
    if (percent === '75') {
        newAmount = amount * 0.75
        newTotal = total * 0.75
        document.getElementById('amount').innerHTML = newAmount
        document.getElementById('total').innerHTML = newTotal
    }
}

// HTML Templates

function renderExchangeSupplyTableHeaderHTML() {
    return /*html*/`                
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
        </tr>
    `
}

function renderExchangeSupplyHTML(i, currency, currencyPrice) {
    return /*html*/`
        <!-- <tr id="tr-exchange-${i}" onclick="buyCurrency(${i})"> -->
        <tr id="tr-exchange-${i}" onclick="openTradeMenu(${i})">
            <td>${i + 1}</td>
            <td><div class="logo-name-box"><img src="${currency.logo}"><div id="currency-name-${i}">${currency.name}</div><div></td>
            <td id="currency-price-${i}">${formatFinanceValues(currencyPrice)}</td>
        </tr>
        `
}


function renderStorageTableHeaderHTML() {
    return  /*html*/`
        <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
        </tr>
    `
}


function renderStorageHTML(i, storageCurrency) {
    return /*html*/`
        <tr id="tr-storage-${i}">
            <td><div class="logo-name-box"><img src="${storageCurrency.logo}">${storageCurrency.name}<div></td>
            <td>${storageCurrency.quantity}</td>
            <td>${formatFinanceValues(storageCurrency.buyprice)}</td>
        </tr>
    `
}