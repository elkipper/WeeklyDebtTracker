function loadDebts() {

    const stored =
        localStorage.getItem("debts");

    if (stored) {
        return JSON.parse(stored);
    }

    return defaultDebts;
}

function saveDebts(debts) {

    localStorage.setItem(
        "debts",
        JSON.stringify(debts)
    );

}

function resetDebts() {

    localStorage.removeItem("debts");
    location.reload();

}