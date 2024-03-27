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
let tokenStorage = [];
let quantity;
let cost;
let dailyTokensPrices = [];
let profit;
let sliderValue;
let currencyPrice
let percentEventTrigger = 19; // 9 = 10% | 99 = 100%
let fiftyPercent = 49; // 0 = 0% | 99 = 100%


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
    exchangeButtons.innerHTML = ''
    for (let i = 0; i < exchanges.length; i++) {
        const exchange = exchanges[i];
        exchangeButtons.innerHTML += /*html*/`
        <button class="buttons" onclick="nextDay()">${exchange}</button>
        `
    };
}


function nextDay() {
    debt *= 1.15;
    bank *= 1.05;
    startDay += 1;
    let bodyContainer = document.getElementById(`body`);
    if (startDay > finishDay) {
        startDay = finishDay
        bodyContainer.innerHTML += renderGameEndHTML();
    }
    renderGameInformation()
    renderExchangeSupply()
    bullBaerEvent()
}

function bullBaerEvent() {
    let bullBearEventTrigger = Math.floor(Math.random() * 100)
    let fiftyPercentTrigger = Math.floor(Math.random() * 100)
    let rndIndex = Math.floor(Math.random() * stockExchangeOffer.length)
    let randomCurrency = stockExchangeOffer[rndIndex]
    let defaultValue = cryptoCurrencys[randomCurrency].price
    if (bullBearEventTrigger <= percentEventTrigger) {
        if (fiftyPercentTrigger <= fiftyPercent) {
            bullEvent(rndIndex, randomCurrency, defaultValue)
        } else {
            bearEvent(rndIndex, randomCurrency, defaultValue)
        }
    }
}

function bullEvent(rndIndex, randomCurrency, defaultValue) {
    console.log('bullrun: ' + cryptoCurrencys[randomCurrency].name)
    let randomPrice = defaultValue * percentagePriceGenerator(minPercentagePrice, maxPercentagePrice)
    let bullBearPrice = randomPrice * 2.8
    document.getElementById(`currency-price-${rndIndex}`).innerHTML = formatFinanceValues(bullBearPrice)
    let searchedToken = dailyTokensPrices.find ( coin => coin.token === cryptoCurrencys[randomCurrency].token ) // overwrite value in event case
    console.log(dailyTokensPrices)
    dailyTokensPrices[rndIndex].currentprice = bullBearPrice
}


function bearEvent(rndIndex, randomCurrency, defaultValue) {
    console.log('Bearmarket: ' + cryptoCurrencys[randomCurrency].name)
    let randomPrice = defaultValue * percentagePriceGenerator(minPercentagePrice, maxPercentagePrice)
    let bullBearPrice = randomPrice * 0.32
    document.getElementById(`currency-price-${rndIndex}`).innerHTML = formatFinanceValues(bullBearPrice)
    let searchedToken = dailyTokensPrices.find ( coin => coin.token === cryptoCurrencys[randomCurrency].token ) // overwrite value in event case
    console.log(dailyTokensPrices)
    dailyTokensPrices[rndIndex].currentprice = bullBearPrice
}


async function renderExchangeSupply() {
    uniqueRandomNumbers();
    let supplyTable = document.getElementById('exchange-supply-table');

    supplyTable.innerHTML = renderExchangeSupplyTableHeaderHTML();
    dailyTokensPrices = [];
    for (let i = 0; i < stockExchangeOffer.length; i++) {
        const currency = cryptoCurrencys[stockExchangeOffer[i]];
        currencyPrice = currency.price * percentagePriceGenerator(minPercentagePrice, maxPercentagePrice);
        let currentTokenPrice = {
            "token" : currency.token,
            "currentprice" : currencyPrice,
        }
        dailyTokensPrices.push(currentTokenPrice)
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


function convertStringToFloat(currencyPrice) {
    let stringReplace = currencyPrice.replace('&nbsp;€', '').replace('.', '').replace(',', '.');
    let floatPrice = parseFloat(stringReplace)
    return floatPrice
}


function openBuyMenu(i) {
    let bodyContainer = document.getElementById(`body`);
    let currencyName = document.getElementById(`currency-name-${i}`).innerHTML;
    let currencyPrice = document.getElementById(`currency-price-${i}`).innerHTML;
    let priceAsFloat = convertStringToFloat(currencyPrice)
    let searchedCurrency = cryptoCurrencys.find(currency => currency.name === currencyName);
    quantity = Math.floor(cash / priceAsFloat)
    cost = quantity * priceAsFloat
    bodyContainer.innerHTML += renderBuyMenuHTML(quantity, priceAsFloat, i, currencyPrice, searchedCurrency);
    let slider = document.getElementById('slider');
    slider.addEventListener("input", function() {
        updateBuySliderValue(slider, priceAsFloat);
    });
}

function updateBuySliderValue(slider, priceAsFloat) {
    let amount = document.getElementById('amount');
    let total = document.getElementById('total');
    sliderValue = parseFloat(slider.value);
    quantity = Math.floor(sliderValue / priceAsFloat)
    amount.textContent = quantity;
    total.textContent = formatFinanceValues(quantity * priceAsFloat);
    cost = quantity * priceAsFloat
}


function openSellMenu(i) {
    let currentToken = tokenStorage[i]
    let searchedTokenOnExchange = dailyTokensPrices.find( currency => currency.token === currentToken.token )
    let currentSellPrice = searchedTokenOnExchange.currentprice.toFixed(2)
    profit = currentSellPrice * currentToken.quantity;
    sliderValue = currentToken.quantity;

    let bodyContainer = document.getElementById(`body`);
    bodyContainer.innerHTML += renderSellMenuHTML(i, currentToken, profit, currentSellPrice);

    let slider = document.getElementById('slider');
    slider.addEventListener("input", function() {
        updateSellSliderValue(slider, currentSellPrice);
    });
}


function updateSellSliderValue(slider, currentSellPrice) {
    let amount = document.getElementById('amount');
    let total = document.getElementById('total');
    sliderValue = parseFloat(slider.value);

    amount.textContent = sliderValue;
    total.textContent = formatFinanceValues(sliderValue * currentSellPrice);
    profit = currentSellPrice * sliderValue;
}


function sellCurrency(i) {
    let token = tokenStorage[i];
    // let stringTotal = document.getElementById('total').innerHTML;
    console.log(sliderValue)
    cash += profit
    token.quantity -= sliderValue
    if (token.quantity <= 0) {
        tokenStorage.splice(i, 1)
    }
    renderStorageTable()
    renderGameInformation()
    closeTradeWindow();
}


function closeTradeWindow() {
    document.getElementById('trade-background').remove()
}


function stopclickingthrough(event) {
    event.stopPropagation()
}


function buyQuantityChanger(percent, priceAsFloat) {
    let floatingNumber = parseFloat(percent / 100)
    quantity = Math.floor((cash * floatingNumber) / priceAsFloat) 
    cost = (quantity * priceAsFloat)
    document.getElementById('amount').innerHTML = quantity
    document.getElementById('total').innerHTML = formatFinanceValues(cost)
}


function buyCurrency(i) {
    let currencyPrice = document.getElementById(`currency-price-${i}`).innerHTML;
    let priceAsFloat = convertStringToFloat(currencyPrice)
    if (cash < priceAsFloat) {
        alert('you cant buy more')
        return
    }
    cash -= cost
    pushToTokenStroage(i, priceAsFloat);
    renderStorageTable()
    renderGameInformation()
    closeTradeWindow();
}



function pushToTokenStroage(i, priceAsFloat) {
    let currencyName = document.getElementById(`currency-name-${i}`).innerHTML;
    let searchedCurrency = cryptoCurrencys.find(currency => currency.name === currencyName);
    let boughtCurrency = {
        "name": searchedCurrency.name,
        "logo": searchedCurrency.logo,
        "quantity": Math.floor(quantity),
        "buyprice": priceAsFloat,
        "token": searchedCurrency.token
    }
    tokenStorage.push(boughtCurrency)
}


function newGame() {
    startDay = 0;
    cash = 3000;
    bank = 0;
    debt = -3000
    tokenStorage = []
    init();
    let bgExists = document.getElementById('trade-background')
    if (bgExists) {
        closeTradeWindow() 
    }
}


function renderFinances() {
    let bodyContainer = document.getElementById(`body`);
    bodyContainer.innerHTML += renderFinancesHTML();
}


function refreshFinanceValues() {
    document.getElementById('finance-cash').innerHTML = `${formatFinanceValues(cash)}`;
    document.getElementById('finance-bank').innerHTML = `${formatFinanceValues(bank)}`;
    document.getElementById('finance-debt').innerHTML = `${formatFinanceValues(debt)}`;
}


function cashToBank() {
    if (cash <= 0) {
        alert('you have not enough funds CASH')
    }
    bank += cash;
    cash = 0;
    renderGameInformation();
    refreshFinanceValues()
}


function withdrawFromBank() {
    if (bank <= 0) {
        alert('you have not enough funds BANK')
    }
    cash += bank
    bank = 0
    renderGameInformation();
    refreshFinanceValues()
}


function payLoan() {
    if (debt === 0 ) {
        alert('nothing to pay')
    }
    if (cash > Math.abs(debt)) {
        let newCash = cash + debt
        debt = 0
        cash = newCash
    } else if  (cash <= Math.abs(debt)) {
        debt += cash
        cash = 0
    }

    renderGameInformation()
    refreshFinanceValues()
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
        <tr id="tr-exchange-${i}" onclick="openBuyMenu(${i})">
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
        <tr id="tr-storage-${i}" onclick="openSellMenu(${i})">
            <td><div class="logo-name-box"><img src="${storageCurrency.logo}">${storageCurrency.token}<div></td>
            <td>${storageCurrency.quantity}</td>
            <td>${formatFinanceValues(storageCurrency.buyprice)}</td>
        </tr>
    `
}


function renderBuyMenuHTML(quantity, priceAsFloat, i, currencyPrice, searchedCurrency) {
    return /*html*/`
        <div id="trade-background" onclick="closeTradeWindow()">
            <div class="trade-menu" onclick="stopclickingthrough(event)">
                <span class="topic">Buy Order</span>
                <div class="buy-info-box"><h3>Currency Price</h3> <h3>${currencyPrice}</h3></div>
                <div class="buy-info-box"><h3>Amount</h3> <h3><span id="amount">${quantity}</span> ${searchedCurrency.token}</h3></div>
                <div class="d-flex-between">
                    <input type="range" min="1" max=${cash} step="1.0" value=${cash} id="slider">
                </div>
                <div class="buy-info-box"><h3>Total</h3> <h3><span id="total">${formatFinanceValues(cost)}</span></h3></div>
                <div class="d-flex-center d-gap">
                    <button class="buttons btn-trade-menu buy-sell-btn color-green" onclick="buyCurrency(${i})">Buy</button>
                    <button class="buttons btn-trade-menu buy-sell-btn color-red" onclick="closeTradeWindow()">Cancel</button>
                </div>
            </div>
        </div>
    `
}


function renderSellMenuHTML(i, currentToken, profit, currentSellPrice) {
    return /*html*/`
        <div id="trade-background" onclick="closeTradeWindow()">
            <div class="trade-menu" onclick="stopclickingthrough(event)">
                <span class="topic">Sell Order</span>
                <div class="buy-info-box"><h3>Sell Price</h3> <h3>${currentSellPrice} €</h3></div>
                <div class="buy-info-box"><h3>Sell Tokens</h3> <h3><span id="amount">${currentToken.quantity}</span> ${currentToken.token}</h3></div>
                <div class="d-flex-between">
                    <input type="range" min="1" max=${currentToken.quantity} step="1.0" value=${currentToken.quantity} id="slider">
                </div>
                <div class="buy-info-box"><h3>Total</h3> <h3><span id="total">${formatFinanceValues(profit)}</span></h3></div>
                <div class="d-flex-center d-gap">
                    <button class="buttons btn-trade-menu buy-sell-btn color-red" onclick="sellCurrency(${i})">Sell</button>
                    <button class="buttons btn-trade-menu buy-sell-btn color-red" onclick="closeTradeWindow()">Cancel</button>
                </div>
            </div>
        </div>
    `
}

function renderGameEndHTML() {
    return /*html*/`
    <div id="trade-background">
        <div class="trade-menu" onclick="stopclickingthrough(event)">
            <span class="topic">Game End</span>
            <div class="buy-info-box game-end">
                <h3>Cash:</h3> 
                <h3>${formatFinanceValues(cash)}</h3>
            </div>
            <div class="buy-info-box game-end">
                <h3>Bank:</h3> 
                <h3>${formatFinanceValues(bank)}</h3>
            </div>
            <div class="buy-info-box game-end">
                <h3>Debt:</h3> 
                <h3>${formatFinanceValues(debt)}</h3>
            </div>
            <div class="buy-info-box">
                <h3>Score:</h3> 
                <h3><b>${formatFinanceValues((cash + bank) + debt)}</b></h3>
            </div>
            <div class="d-flex-center d-gap">
                <button class="buttons btn-options primary-btn" onclick="newGame()">New Game</button>
                <button class="buttons btn-options primary-btn">Leaderboard</button>
            </div>
            
        </div>
    </div>
`
}


function renderFinancesHTML() {
    return /*html*/`
        <div id="trade-background" onclick="closeTradeWindow()">
            <div class="trade-menu" onclick="stopclickingthrough(event)">
                <span class="topic">Finances</span>
                <div class="d-flex-center d-gap">
                    <div class="buy-info-box flex-1">
                        <h3>Cash</h3> 
                        <h3 id="finance-cash">${formatFinanceValues(cash)}</h3>
                    </div>
                    <button class="buttons finance-button" onclick="cashToBank()">to Bank</button>
                </div>
                <div class="d-flex-center d-gap">
                    <div class="buy-info-box flex-1">
                        <h3>Bank</h3> 
                        <h3 id="finance-bank">${formatFinanceValues(bank)}</h3>
                    </div>
                    <button class="buttons finance-button" onclick="withdrawFromBank()">withdraw</button>
                </div>
                <div class="d-flex-center d-gap">
                    <div class="buy-info-box flex-1">
                        <h3>Debt</h3> 
                        <h3 id="finance-debt">${formatFinanceValues(debt)}</h3>
                    </div>
                    <button id="pay-loan" class="buttons finance-button" onclick="payLoan()">pay loan</button>
                </div>
                <div class="d-flex-center d-gap">
                    <button class="buttons btn-trade-menu buy-sell-btn color-red" onclick="closeTradeWindow()">Cancel</button>
                </div>
            </div>
        </div>
    `
}

