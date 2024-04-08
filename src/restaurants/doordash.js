/*
* Copyright (c) 2024 Tejit Pabari
* Doordash functions to display and filter menu items
*/
function doordash() {
    // Select element to add content
    var element = document.querySelectorAll('.sc-c2653190-1.gSXFxs');
    if(element.length > 0) {
        parentNode = element[0].parentNode; // Parent Node
        tempDiv = document.createElement('div');
        tempDiv.className = "sc-e2bae8f8-0 iNhwLQ"
        var tempDivContent = ""

        // Add all toggle buttons
        for (var i = 0; i < toggleOrder.length; i++) {
            key = toggleOrder[i];
            val = toggleDetails[key];
            tempDivContent += 
                `<div class="doordashSlidersDiv" id="sliderDiv-${i+1}">
                    <label class="switch toggleBlock">
                        <input type="checkbox" id="${val.id}"/>
                        <span class="slider round"></span>
                    </label>
                    <p class="toggleBlock styles__TextElement-sc-3qedjx-0 ZcflS doordashSliderText">
                        ${val.title}
                    </p>
                </div>`
        }

        // Add toggle for allergies
        tempDivContent += 
        `<div class="doordashSlidersDiv" id="sliderDiv-${toggleOrder.length+1}">
            <label class="switch toggleBlock">
                <input type="checkbox" id="${allergiesConfig.id}"/>
                <span class="slider round allergiesClass"></span>
            </label>
            <p class="toggleBlock styles__TextElement-sc-3qedjx-0 ZcflS doordashSliderText">${allergiesConfig.title}</p>
        </div>`
        tempDiv.innerHTML = tempDivContent;

        parentNode.insertBefore(tempDiv, element[0]);
        addToggleEventListeners(); // Add event listeners to all toggle buttons
        runFunctionOnScroll(filterDoordash); // Run filter function on scroll
    }
    else {
        // Keep trying to find the element every 15ms, until it is found.
        // Need to do this as Doordash uses a lot of dynamic loading.
        setTimeout(doordash, 15);
    }
}

// Filter function for Doordash
function filterDoordash() {
    allMenuItems = document.querySelectorAll('div[data-anchor-id="MenuItem"]'); // Menu Items
    restaurantTypeElement = document.querySelectorAll('.styles__TextElement-sc-3qedjx-0.jOBmfy.sc-72ea3307-4.bcCviK'); // Restaurant type
    if (allMenuItems.length == 0)  return;
    for (var i = 0; i < allMenuItems.length; i++) {
        menuItem = allMenuItems[i] // Menu Item
        itemString = menuItem !=null && menuItem.innerText != null ? menuItem.innerText.replace('\n',' ').toLowerCase() : ""; // Menu Item text

        menuItemParent = menuItem.closest(".sc-fd2a3720-0.WChZx");
        menuItemTitleElement = menuItemParent ? menuItemParent.querySelector(".sc-fd2a3720-1.iESGhw") : null; // Menu Item Title
        menuItemTitle = menuItemTitleElement != null ? menuItemTitleElement.innerText.replace('\n',' ').toLowerCase() : "";

        restaurantTypes = restaurantTypeElement.length > 0 // Restaurant Types List
                            ? restaurantTypeElement[0].innerText.toLowerCase().split('.').map(s => s.trim())
                            : [];
        handleToggle(menuItem, menuItemTitle, itemString, restaurantTypes);
    }
}