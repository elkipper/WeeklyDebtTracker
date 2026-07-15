let debts = loadDebts();
let earningsHistory =
JSON.parse(
    localStorage.getItem(
        "earningsHistory"
    )
) || [];


let gasSpent =
Number(
localStorage.getItem(
"gasSpent"
)
) || 0;

let gigTotal =
Number(
    localStorage.getItem("gigTotal")
) || 0;


const debtContainer =
document.getElementById("debtContainer");

const dueDates =
document.getElementById("dueDates");



renderDueDates();
renderDebts();
updateMoneyDisplay();
updatePayoffTarget();
renderTimeline();
renderPriorities();
updateTotalDebt();
updateGigDisplay();
showTab("dashboard");

function renderDueDates() {

    dueDates.innerHTML = "";

    const sorted =
    [...debts].sort(
        (a,b)=>a.dueDay-b.dueDay
    );

    sorted.forEach(debt => {

        const card =
        document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <strong>${debt.name}</strong>
            <br>
            Due Day: ${debt.dueDay}
            <br>
            Minimum: $${debt.minimum}
        `;

        dueDates.appendChild(card);

    });

}

function renderDebts() {

    debtContainer.innerHTML = "";

    debts.forEach(debt => {

        const card =
        document.createElement("div");

        card.className =
            debt.target
                ? "debt-card priority"
                : "debt-card";

        if (debt.paid) {
            card.classList.add("paid");
        }

        card.innerHTML = `
            <h3>${debt.name}</h3>

            <p>
                Balance:
                $${debt.balance.toLocaleString()}
            </p>

            <p>
                Minimum:
                $${debt.minimum}
            </p>

            <p>
                Due Day:
                ${debt.dueDay}
            </p>

            <input
                type="number"
                id="payment-${debt.id}"
                placeholder="Payment Amount"
            >

            <button
                onclick="applyPayment(${debt.id})"
            >
                Apply Payment
            </button>
        `;

        debtContainer.appendChild(card);

    });

}

function togglePaid(id) {

    debts = debts.map(debt => {

        if (debt.id === id) {
            debt.paid = !debt.paid;
        }

        return debt;

    });

    saveDebts(debts);

    renderDebts();

}

const cashAdvanceButton =
document.getElementById(
    "cashAdvanceBtn"
);

const cashAdvanceStatus =
document.getElementById(
    "cashAdvanceStatus"
);

const advancePaid =
localStorage.getItem(
    "cashAdvancePaid"
);

if (advancePaid === "true") {

    cashAdvanceStatus.textContent =
        "Status: Paid";

}

cashAdvanceButton.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "cashAdvancePaid",
            "true"
        );

        cashAdvanceStatus.textContent =
            "Status: Paid";

    }
);

if ('serviceWorker' in navigator) {

    navigator.serviceWorker
        .register('service-worker.js')
        .then(() => {
            console.log(
                "Service Worker Registered"
            );
        });

}

function renderPriorities() {

    const container =
    document.getElementById(
        "priorityContainer"
    );

    if (!container) return;

    container.innerHTML = "";

    const items = [

        {
            name: "Cash Advance",
            amount: "$285 Due Jul 23"
        },

        {
            name: "Enphase Catch-Up",
            amount: "$180"
        },

        {
            name: "Vet Bill",
            amount: "$185"
        },

        {
            name: "Current Target",
            amount:
            document.getElementById(
                "currentTarget"
            )?.textContent || "Simple"
        }

    ];

    items.forEach(item => {

        const card =
        document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.amount}</p>
        `;

        container.appendChild(card);

    });

}

const totalDebt =
debts.reduce(
    (sum, debt) =>
    sum + debt.balance,
    0
);

console.log(totalDebt);


document
.getElementById("addGigBtn")
.addEventListener(
    "click",
    addGigIncome
);

function addGigIncome() {

    const amount =
    Number(
        document.getElementById(
            "gigAmount"
        ).value
    );

    if (!amount) return;

    gigTotal += amount;

    localStorage.setItem(
        "gigTotal",
        gigTotal
    );

    
    earningsHistory.push({
        date: new Date(),
        amount: amount
    });

    localStorage.setItem(
        "earningsHistory",
        JSON.stringify(
            earningsHistory
        )
    );


    updateGigDisplay();
    updateMoneyDisplay();

    document.getElementById(
        "gigAmount"
    ).value = "";
}

function updateGigDisplay() {

    const gasReserve =
    gigTotal * 0.15;

    const available =
    gigTotal - gasReserve;

    document.getElementById(
        "gigTotal"
    ).textContent =
    gigTotal.toFixed(2);

    document.getElementById(
        "gasReserve"
    ).textContent =
    gasReserve.toFixed(2);

    document.getElementById(
        "usableGigMoney"
    ).textContent =
    available.toFixed(2);

    document.getElementById(
        "gigTotal2"
    ).textContent =
    gigTotal.toFixed(2);

}

function applyPayment(id) {

    const paymentField =
    document.getElementById(
        `payment-${id}`
    );

    const payment =
    Number(paymentField.value);

    if (!payment) return;

    debts = debts.map(debt => {

        if (debt.id === id) {

            debt.balance =
            Math.max(
                0,
                debt.balance - payment
            );

        }

        return debt;

    });

    
    saveDebts(debts);

    updateTotalDebt();
    updatePayoffTarget();
    renderPriorities();
    renderTimeline();
    renderDebts();

}



document
.getElementById("addGas")
.addEventListener(
    "click",
    addGas
);

function addGas() {

    const amount =
    Number(
        document
        .getElementById("gasAmount")
        .value
    );

    if (!amount) return;

    gasSpent += amount;

    localStorage.setItem(
        "gasSpent",
        gasSpent
    );

    updateMoneyDisplay();

    document
    .getElementById("gasAmount")
    .value = "";

}


function updateMoneyDisplay() {

    const gigTotal =
        Number(
            localStorage.getItem(
                "gigTotal"
            )
        ) || 0;

    const availableMoney =
        gigTotal
        - gasSpent
        - 100;

    document
    .getElementById("gasTotal")
    .textContent =
        gasSpent.toFixed(2);

    document
    .getElementById("gasDisplay")
    .textContent =
        gasSpent.toFixed(2);

    document
    .getElementById("availableMoney")
    .textContent =
        availableMoney.toFixed(2);

}

function updatePayoffTarget() {

    const priorityList = [
        "Simple",
        "Lendly",
        "Sunbit",
        "Imagine",
        "Sparrow",
        "Indigo",
        "Mercury"
    ];

    let target = "None";

    for (const name of priorityList) {

        const debt = debts.find(
            d => d.name === name && d.balance > 0
        );

        if (debt) {

            target =
                `${debt.name} ($${debt.balance})`;

            break;
        }
    }

    const targetElement =
        document.getElementById(
            "currentTarget"
        );

    if (targetElement) {

        targetElement.textContent =
            target;
    }
}


function showTab(tabName) {

    const tabs =
    document.querySelectorAll(
        '.tab-content'
    );

    tabs.forEach(tab => {

        tab.style.display =
        'none';

    });

    document.getElementById(
        tabName + 'Tab'
    ).style.display =
    'block';
}

function renderTimeline() {

    const container =
        document.getElementById(
            "timelineContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    const timeline = [

        {
            month: "July",
            items: [
                "Cash Advance ($285)",
                "Enphase Catch-up ($180)",
                "Vet Bill ($185)"
            ]
        },

        {
            month: "August",
            items: [
                "Payoff Simple ($848)",
                "Payoff Lendly ($990)"
            ]
        },

        {
            month: "September",
            items: [
                "Payoff Sunbit ($541)"
            ]
        },

        {
            month: "October",
            items: [
                "Payoff Imagine ($365)",
                "Payoff Sparrow ($385)"
            ]
        },

        {
            month: "November",
            items: [
                "Payoff Indigo ($973)"
            ]
        },

        {
            month: "December",
            items: [
                "Payoff Mercury ($1208)"
            ]
        }

    ];

    timeline.forEach(month => {

        const card =
            document.createElement("div");

        card.className = "card";

        let html =
            `<h3>${month.month}</h3>`;

        month.items.forEach(item => {

            html += `<p>✓ ${item}</p>`;

        });

        card.innerHTML = html;

        container.appendChild(card);

    });

}

function updateTotalDebt() {

    const total =
    debts.reduce(
        (sum,debt)=>
        sum + debt.balance,
        0
    );

    document
    .getElementById(
        "totalDebtAmount"
    )
    .textContent =
    "$" +
    total.toLocaleString();

}


