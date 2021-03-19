let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = event =>{
    const db = event.target.result;
    db.createObjectStore("pending", {
        autoIncrement: true
    });
};

request.onsuccess = event =>{
    db = event.target.result;
    console.log(`Successfully opened ${db}`)

    if(navigator.onLine){
        checkDatabase();
    }
};

request.onerror = event => {
    console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record){
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
            //    adding data
            // budgetData.forEach(budget => budgetStore.add(budget))

    store.add(record);
}
function checkDatabase(){
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = ()=> {
        if(getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*", "Content-Type":
                    "application/json"
                }
            })
            .then(response => response.json())
            .then(()=>{
                const transaction = db.transaction(["pending"], "readwrite");

                const store = transaction.objectStore("pending");

                store.clear();
            });
        }
    };
}

// eslint-disable-next-line no-unused-vars
function saveRecord(record) {
    const db = request.result;

    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction([pendingObjectStore], `readwrite`);

    // access your pending object store
    const store = transaction.objectStore(pendingObjectStore);

    // add record to your store with add method.
    store.add(record);
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);