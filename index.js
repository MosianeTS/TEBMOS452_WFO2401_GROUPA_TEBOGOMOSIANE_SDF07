
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"    /* Function import */
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"  /* Function import */

const appSettings = {
    databaseURL: "https://grocery-store-b4f07-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)                                  /* Connects our app with firebase */
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")                   /* Creates a database reference named shoppingList */

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const itemsTotalEL = document.getElementById("items-total")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value       
    push(shoppingListInDB, inputValue)                           /* Pushes input value to the database */
      
    clearInputFieldEl()    
})

onValue(shoppingListInDB, function(snapshot) {                   /* Fetches data from the database */     
    if (snapshot.exists()) {                                             /* Checks if there are items on the database */            
        let itemsArray = Object.entries(snapshot.val())                  /* Converts objects into arrays with keys and values*/
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items found"
        
    }       
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""     /*Clears shopping list  */
}

function clearInputFieldEl() {
    inputFieldEl.value = ""       /*Clears input field after adding item to cart  */
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]       
    let itemValue = item[1]
    
    let newEl = document.createElement("li")     /*Creates a list item  */
    
    newEl.textContent = itemValue
    
    shoppingListEl.append(newEl)

    newEl.addEventListener("click", function() {
       
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)        
        
        remove(exactLocationOfItemInDB)    /*Deletes item from database using its ID */  
    })   
}

