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
                <button class="buttons btn-options primary-btn" onclick="renderLeaderboard()">Leaderboard</button>
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


function renderLeaderboardHeaderHTML() {
    return /*html*/`           
        <tr>
            <th>Pos.</th>
            <th>Date</th>
            <th>Score</th>
        </tr>
    `
}

function renderLeaderboardTableHTML(i, score) {
    return /*html*/ `
        <tr>
            <td>${i + 1}</td>
            <td>${score.date}</td>
            <td>${score.score}</td>
        </tr>
    `
}

function renderLeaderboardHTML() {
    return /*html*/`
        <div class="trade-menu" onclick="stopclickingthrough(event)">
            <span class="topic">Leaderboard</span>
            <div class="buy-info-box">
                <h3>Your Score:</h3> 
                <h3><b>${formatFinanceValues((cash + bank) + debt)}</b></h3>
            </div>
            <table id="score-table">
            </table>
            <div class="d-flex-center d-gap">
                <button class="buttons btn-options primary-btn" onclick="newGame()">New Game</button>
            </div>
        </div>
    `
}