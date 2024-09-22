import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from "react"; 

function GroceryShoppingList() {

    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [amount, setAmount] = useState(1);
    const [message, setMessage] = useState("");
    const [resatItems, setResatItems] =([])

    useEffect(() => {
        const fetchData = async () => {
            const itemsCollection = collection(db, "items");
            const itemsSnapshot = await getDocs(itemsCollection);
            const itemsList = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(itemsList);
        };
        fetchData();
    }, []);

    function handleInputChange(event) {
        setNewItem(event.target.value);
    }

    function handleCategoryChange(event) {
        setNewCategory(event.target.value);
    }

    function handleAmountChange(event) {
        setAmount(parseInt(event.target.value) || 1);
    }

    async function addItem() {
        if (newItem.trim() !== "" && amount !== "" && newCategory.trim() !== "") {
            const newObject = {
                name: newItem,
                amount: amount,
                category: newCategory,
                completed: false
            };

            const docRef = await addDoc(collection(db, "items"), newObject);
            const updatedItems = [...items, { id: docRef.id, ...newObject }];
            setItems(sortItems(updatedItems));
            setNewItem("");
            setAmount(1);
            setMessage("");
        } else {
            setMessage("קיימים שדות ריקים");
            setTimeout(() => setMessage(""), 1000);
        }
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            addItem();
        }
    }

    async function deleteItem(index) {
        const itemToDelete = items[index];
        await deleteDoc(doc(db, "items", itemToDelete.id));

        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    }

    async function checkItem(index) {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, completed: !item.completed } : item
        );
        const itemToUpdate = items[index];
        await updateDoc(doc(db, "items", itemToUpdate.id), {
            completed: !itemToUpdate.completed
        });
        setItems(updatedItems);
    }

    function sortItems(array) {
        return array.sort((a, b) => {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            return 0;
        });
    }

    async function resat() {
        const itemRefs = items.map(item => doc(db, "items", item.id));
        
        // מחיקה של כל הפריטים מ-Firestore
        for (const itemRef of itemRefs) {
            await deleteDoc(itemRef);
        }
    
        // ריקון הרשימה מהמצב (state)
        setItems([]);
    }

    return (
        <div className="groceryList">
            <h1>Time is money</h1>
            <h5>רשימת קניות מסודרת לפי מחלקות</h5>

            <div>
                <input
                    type="text"
                    className="addItem"
                    placeholder="הכנס\י פריט"
                    value={newItem}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                /><br/>

                <select
                    className="categorySelect"
                    value={newCategory}
                    onChange={handleCategoryChange}
                    onKeyDown={handleKeyPress}
                >
                    <option value="">בחר קטגוריה</option>
                    <option value="פירות/ירקות">פירות/ירקות</option>
                    <option value="מוצרי חלב">מוצרי חלב</option>
                    <option value="קפואים">קפואים</option>
                    <option value="מוצרי אפייה">מוצרי אפייה</option>
                    <option value="שימורים">שימורים</option>
                    <option value="ניקיון">ניקיון</option>
                    <option value="היגיינה">היגיינה</option>
                    <option value="מאפים">מאפים</option>
                    <option value="קטניות">קטניות</option>
                    <option value="בשר/עוף/דגים">בשר/עוף/דגים</option>
                    <option value="אחר">אחר</option>
                </select><br/>

                <button className="addButton" onClick={addItem}>הוספה</button>

                <input
                    type="number"
                    className="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    onKeyDown={handleKeyPress}
                />
            </div>

            {message && <div className="errorMessage">{message}</div>}<br/>

            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <button className="deleteButton" onClick={() => deleteItem(index)}>🚮</button>
                        <button className="checkButton" onClick={() => checkItem(index)}>✅</button>
                        <span className="amountText"> ק"ג/ יחידות: {item.amount}</span>
                        <span
                            className="text"
                            style={{ textDecoration: item.completed ? 'line-through red' : 'none' }}
                        >
                            {item.name}
                        </span>
                    </li>
                ))}
            </ul><br/>
            <button className="resetButton" onClick={resat}>איפוס רשימה</button>
        </div>
    );
}

export default GroceryShoppingList;
