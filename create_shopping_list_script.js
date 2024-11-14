document.getElementById("shopping_list_Form").addEventListener("submit", function(event) {
    event.preventDefault(); 
  
    
    const selectedDishes = Array.from(document.querySelectorAll('input[name="dishes"]:checked')).map(input => input.value);

    localStorage.setItem("selectedDishes", JSON.stringify(selectedDishes));
  
    if (selectedDishes.length === 0) {
      alert("Вы забыли выбрать блюдо :(");
      return;
    }

    const recipes = {
      "Салат Оливье": ["Картофель", "Морковь", "Горошек", "Колбаса", "Яйца", "Майонез"],
      "Борщ": ["Свекла", "Капуста", "Картофель", "Морковь", "Мясо", "Лук"],
      "Паста Карбонара": ["Спагетти", "Бекон", "Яйца", "Пармезан", "Сливки"],
      "Куриное филе с овощами": ["Куриное филе", "Перец болгарский", "Брокколи", "Морковь", "Сметана"]
    };  
    
    let shoppingList = new Set();
    selectedDishes.forEach(dish => {
      recipes[dish].forEach(ingredient => shoppingList.add(ingredient));
    });

    localStorage.setItem("shoppingList", JSON.stringify(Array.from(shoppingList)));
  
    displayShoppingList(Array.from(shoppingList));
    toggleClearButton(Array.from(shoppingList));
  });
  
  function displayShoppingList(ingredients) {
    const container = document.getElementById("generatedList");
    container.innerHTML = '';
  
    if (ingredients.length > 0){
      const listTitle = document.createElement("h3");
      listTitle.innerText = "Список покупок:";
      container.appendChild(listTitle);
    }    
  
    const list = document.createElement("ul");
  
    const savedShoppingState = JSON.parse(localStorage.getItem("shoppingState")) || {};
  
    ingredients.forEach((ingredient, index) => {
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const uniqueIndex = `ingredient-${index}`;
      checkbox.id = uniqueIndex;
  
      if (savedShoppingState[ingredient]) {
        checkbox.checked = true;
        listItem.style.textDecoration = "line-through"; 
      }
  
      checkbox.addEventListener("change", function() {
        listItem.style.textDecoration = this.checked ? "line-through" : "none";
  
        savedShoppingState[ingredient] = this.checked;
        localStorage.setItem("shoppingState", JSON.stringify(savedShoppingState));
      });

      const label = document.createElement("label");
      label.setAttribute("for", uniqueIndex);
      label.textContent = " " + ingredient;
  
      listItem.appendChild(checkbox);      
      list.appendChild(listItem);
      listItem.appendChild(label);
    });
  
    container.appendChild(list);
  }
  function toggleClearButton(ingredients) {
    const container = document.getElementById("generatedList");
    
    if (ingredients && ingredients.length > 0) {
        
        if (!document.getElementById("clearShoppingListButton")) {
            const clearButton = document.createElement("button");
            clearButton.id = "clearShoppingListButton";
            clearButton.innerText = "Очистить список покупок";
            clearButton.addEventListener("click", function() {
                localStorage.removeItem("shoppingList");
                localStorage.removeItem("shoppingState");
                displayShoppingList([]); 
                toggleClearButton([]);
            });
            container.appendChild(clearButton);  
        }
    } else {
        const clearButton = document.getElementById("clearShoppingListButton");
        if (clearButton) {
            clearButton.remove();  
        }
    }
}
  
  window.addEventListener("load", function() {
    
    const savedDishes = JSON.parse(localStorage.getItem("selectedDishes"));
    const savedShoppingList = JSON.parse(localStorage.getItem("shoppingList"));
  
    if (savedDishes && savedDishes.length > 0) {
      savedDishes.forEach(dish => {
        const checkbox = document.querySelector(`input[name="dishes"][value="${dish}"]`);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }

    if (savedShoppingList && savedShoppingList.length > 0) {
      displayShoppingList(savedShoppingList);
      toggleClearButton(savedShoppingList);
    }
  });