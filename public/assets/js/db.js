let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore("transaction", {
        keyPath: "id", autoIncrement: true
    });
};

request.onsuccess = event => {
    db = event.target.result;
    console.log(`Successfully opened ${db}`)

    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = event => {
    console.log("Good Luck! " + event.target.errorCode);
};

const saveRecord = record => {
    const transaction = db.transaction(["transaction"], "readwrite");
    const store = transaction.objectStore("transaction");

    store.add(record);
}
const checkDatabase = () => {
    const transaction = db.transaction(["transaction"], "readwrite");
    const store = transaction.objectStore("transaction");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*", "Content-Type":
                        "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["transaction"], "readwrite");

                    const store = transaction.objectStore("transaction");

                    store.clear();
                });
        }
    };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);