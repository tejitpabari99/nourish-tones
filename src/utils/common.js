/*
* Copyright (c) 2024 Tejit Pabari
* Common functions and variables for all restaurant files
* Restaurant files: doordash.js - calls functions from here
*/

// Regexes for various scenarios
var neutralListRegex = createItemListRegex(ItemLists.neutralList); // Neutral List - GREY out
var ignoreListRegex = createItemListRegex(ItemLists.ignoreList); // Ignore List - Do not apply any classes

var allNonVegItemList = ItemLists.nonVegItemsList.concat(ItemLists.seafoodItemsList); // All Non-Veg List = Non-Veg + Seafood
var allNonVegEggItemList = allNonVegItemList.concat(ItemLists.eggItemsList); // Egg based items only
var allNonVeganItemList = allNonVegEggItemList.concat(ItemLists.nonVeganItemsList); // NonVeg + Egg Item List
// Non Veg Ambiguous terms
var allNonVegAmbiguousItemList = allNonVegItemList.map(s => `or ${s}`).concat(
    allNonVegItemList.map(s => `or any choice of ${s}`),
    allNonVegItemList.map(s => `or any ${s}`),
    allNonVegItemList.map(s => `or choice of ${s}`),
)

// Regexes for various diets
var allNonVegItemListRegex = createItemListRegex(allNonVegItemList);
var allNonVegEggItemListRegex = createItemListRegex(allNonVegEggItemList);
var allNonVeganItemListRegex = createItemListRegex(allNonVeganItemList);
var veganItemListRegex = createItemListRegex(ItemLists.veganItemsList);
var pascaterianItemListRegex = createItemListRegex(ItemLists.nonVegItemsList);
var vegItemListRegex = createItemListRegex(ItemLists.vegItemList);
var eggItemsListRegex = createItemListRegex(ItemLists.eggItemsList);
var allNonVegAmbiguousItemListRegex = createItemListRegex(allNonVegAmbiguousItemList);
var veganAmbiguousItemListRegex = createItemListRegex(ItemLists.veganAmbiguousItemsList);
var vegAmbiguousItemListRegex = createItemListRegex(ItemLists.vegAmbiguousItemList);

var allergiesList = []
var allergiesListRegex = null;

// Dictionary of functions for toggling, mapped to respective diets
const toggleFunctions = {
    veg: toggleVeg,
    vegNoEgg: toggleVegNoEgg,
    vegan: toggleVegan,
    pascaterian: togglePascaterian,
    allergies: toggleAllergies
}

function createItemListRegex(itemList) {
    return new RegExp("\\b(" + itemList.join("s?|") + ")\\b", "i");
}

function addToggleEventListeners() {
    for (var i=0; i < toggleOrder.length; i++) {
        var toggleKey = toggleOrder[i];
        var toggleId = toggleDetails[toggleKey].id;
        document.getElementById(toggleId).addEventListener("change", toggleFunctions[toggleKey]);
    }
    document.getElementById(allergiesConfig.id).addEventListener("change", toggleFunctions[allergiesConfig.id]);

    chrome.storage.sync.get(
        { default_diet: '', allergies_list: [], allergiesDefault: false},
        (items) => {
            if(items.default_diet != '') {
                toggleTrue(items.default_diet);
                toggleFunctions[items.default_diet]();
            }
            if (items.allergies_list.length > 0) {
                allergiesList = items.allergies_list;
                allergiesListRegex = createItemListRegex(allergiesList);
            }
            if (items.allergiesDefault && items.allergies_list.length > 0) {
                document.getElementById(allergiesConfig.id).checked = true;
                toggleAllergies();
            }
        }
    );
}

function toggleOthersFalse(skipToggleKey) {
    for (var i=0; i < toggleOrder.length; i++) {
        var toggleKey = toggleOrder[i];
        if (toggleKey != skipToggleKey) {
            toggleValues[toggleKey] = false;

            var toggleId = toggleDetails[toggleKey].id;
            document.getElementById(toggleId).checked = false;
        }
    }
}

function toggleTrue(toggleKey) {
    var toggleId = toggleDetails[toggleKey].id;
    document.getElementById(toggleId).checked = true;
}

function toggleVeg() {
    toggleValues.veg = !toggleValues.veg;
    toggleOthersFalse('veg');
}

function toggleVegNoEgg() {
    toggleValues.vegNoEgg = !toggleValues.vegNoEgg;
    toggleOthersFalse('vegNoEgg');
}

function toggleVegan() {
    toggleValues.vegan = !toggleValues.vegan;
    toggleOthersFalse('vegan');
}

function togglePascaterian() {
    toggleValues.pascaterian = !toggleValues.pascaterian;
    toggleOthersFalse('pascaterian');
}

function toggleAllergies() {
    toggleValues.allergies = !toggleValues.allergies;
}

function handleToggle(htmlItem, menuItemTitle, itemString, restaurantTypes) {
    removeAllClasses(htmlItem);
    if (!menuItemTitle.match(ignoreListRegex)) {
        var itemCategoryValues = checkCategories(menuItemTitle, itemString, restaurantTypes);
        if (itemCategoryValues.neutral) {
            htmlItem.classList.add(toggleClasses.neutralClass);
        }
        else {
            assignClasses(htmlItem, itemCategoryValues);
        }
    }
}

function checkCategories(menuItemTitle, itemString, restaurantTypes) {
    var itemCategoryValues = {...categoryValues};
    itemCategoryValues = checkNeutral(itemCategoryValues, menuItemTitle, itemString, restaurantTypes);
    if (itemCategoryValues.neutral) {
        return itemCategoryValues;
    }
    itemCategoryValues = checkAllergies(itemCategoryValues, menuItemTitle, itemString, restaurantTypes);
    itemCategoryValues = checkVegan(itemCategoryValues, menuItemTitle, itemString, restaurantTypes);
    itemCategoryValues = checkVegAndVegNoEgg(itemCategoryValues, menuItemTitle, itemString, restaurantTypes);
    itemCategoryValues = checkPascaterian(itemCategoryValues, menuItemTitle, itemString, restaurantTypes);
    return itemCategoryValues;
}

function checkAllergies(itemCategoryValues, menuItemTitle, itemString, restaurantTypes) {
    if (allergiesList.length > 0) {
        var checkString = `${menuItemTitle} ${itemString}`;
        for (var i = 0; i < allergiesList.length; i++) {
            if (checkString.match(allergiesListRegex)){
                itemCategoryValues.allergies = true;
                break;
            }
        }
    }
    return itemCategoryValues;
}

function checkNeutral(itemCategoryValues, menuItemTitle, itemString, restaurantTypes) {
    if (menuItemTitle.match(neutralListRegex)){
        itemCategoryValues.neutral = true;
    }
    return itemCategoryValues;
}

function checkVegan(itemCategoryValues, menuItemTitle, itemString, restaurantTypes) {
    /*
    * If the restaurant is vegan, vegan = true
    * If the item contains vegan terms, vegan = true
    * Else, vegan = false
    */
    var checkString = `${menuItemTitle} ${itemString}`;
    if (restaurantTypes.includes("vegan")) {
        itemCategoryValues.vegan = true;
    }
    else if (checkString.match(veganItemListRegex)) {
        itemCategoryValues.vegan = true;
    }
    else if (checkString.match(allNonVeganItemListRegex)){
        itemCategoryValues.vegan = false;
    }
    else {
        itemCategoryValues.vegan = true;
    }
    return itemCategoryValues;
}

function checkVegAndVegNoEgg(itemCategoryValues, menuItemTitle, itemString, restaurantTypes) {
    var checkString = `${menuItemTitle} ${itemString}`;
    /*
    * If the item is vegan, vegetarian = true; vegetarian (no egg) = true
    * If the item contains veg terms, vegetarian = true;
    *   Check for vegetarian (no egg)
    * If the item contains non-veg ambiguous terms,
    *   Check Item Name and Description (Item String)
    *       If that contains non-veg ambiguous terms, vegetarianAmbiguous = true; vegetarian (no egg) ambiguous = true
    *       If that contains non-veg terms, vegetarian = false; vegetarian (no egg) = false
    *       Else, vegetarian = true;
    *           Check for vegetarian (no egg)
    * If the item contains non-veg terms, vegetarian = false; vegetarian (no egg) = false
    * Else, vegetarian = true; 
    *   Check for vegetarian (no egg)
    */
    var nonVegItemAmbiguousMatches = checkString.match(allNonVegAmbiguousItemListRegex)
    if (itemCategoryValues.vegan){
        itemCategoryValues.veg = true;
        itemCategoryValues.vegNoEgg = true;
    }
    else if (checkString.match(vegItemListRegex)){
        itemCategoryValues.veg = true;
        itemCategoryValues = _checkVegNoEggIfVeg(itemCategoryValues, menuItemTitle, itemString, restaurantTypes);
    }
    else if (checkString.match(vegAmbiguousItemListRegex)){
        itemCategoryValues.vegAmbiguous = true;
        itemCategoryValues = _checkVegNoEggIfVeg(itemCategoryValues, menuItemTitle, itemString, restaurantTypes);
    }
    else if (nonVegItemAmbiguousMatches){
        var firstMatch = nonVegItemAmbiguousMatches[0];
        var searchBeforeFirstMatch = checkString.match(`(\\b\\w+\\b) ${firstMatch}`);
        if (searchBeforeFirstMatch){
            if (searchBeforeFirstMatch[1].match(allNonVegItemListRegex)){
                itemCategoryValues.veg = false;
                itemCategoryValues.vegNoEgg = false;
            }
            else {
                itemCategoryValues.veg = true;
                itemCategoryValues = _checkVegNoEggIfVeg(itemCategoryValues, "", itemString, restaurantTypes);
            }
        }
    }
    else if (checkString.match(allNonVegItemListRegex)){
        itemCategoryValues.veg = false;
        itemCategoryValues.vegNoEgg = false;
    }
    else {
        itemCategoryValues.veg = true;
        itemCategoryValues = _checkVegNoEggIfVeg(itemCategoryValues, menuItemTitle, itemString, restaurantTypes);
    }
    return itemCategoryValues;
}

function _checkVegNoEggIfVeg(itemCategoryValues, menuItemTitle, itemString, restaurantTypes) {
    var checkString = `${menuItemTitle} ${itemString}`;
    /* Assume that the incoming itemCategoryValues.veg = true
    * If the item contains egg terms, vegetarian (no egg) = false
    * Else, vegetarian (no egg) = true
    */
    if (checkString.match(eggItemsListRegex)){
        itemCategoryValues.vegNoEgg = false;
    }
    else if (itemCategoryValues.vegAmbiguous){
        itemCategoryValues.vegNoEggAmbiguous = true;
    }
    else {
        itemCategoryValues.vegNoEgg = true;
    }
    return itemCategoryValues;
}

function checkPascaterian(itemCategoryValues, menuItemTitle, itemString, restaurantTypes) {
    /*
    * If the item is vegan, vegetarian, or vegetarian (no egg), pascaterian = true
    * If the item contains seafood terms, pascaterian = false
    * Else, pascaterian = true
    */
    var checkString = `${menuItemTitle} ${itemString}`;
    if (itemCategoryValues.vegan || itemCategoryValues.veg || itemCategoryValues.vegNoEgg){
        itemCategoryValues.pascaterian = true;
    }
    else if (checkString.match(pascaterianItemListRegex)){
        itemCategoryValues.pascaterian = false;
    }
    else {
        itemCategoryValues.pascaterian = true;
    }
    return itemCategoryValues;
}

function assignClasses(htmlItem, itemCategoryValues) {
    if (toggleValues.allergies && itemCategoryValues.allergies) {
        addValuetoClassList(htmlItem, toggleClasses.incorrectClass);
    }
    else {
        for (var i = 0; i < toggleOrder.length; i++) {
            var toggleKey = toggleOrder[i];
            if (toggleValues[toggleKey]) {
                if (itemCategoryValues[toggleKey]) {
                    addValuetoClassList(htmlItem, toggleClasses.correctClass);
                }
                else if (itemCategoryValues[`${toggleKey}Ambiguous`]) {
                    addValuetoClassList(htmlItem, toggleClasses.ambiguousClass);
                }
                else {
                    addValuetoClassList(htmlItem, toggleClasses.incorrectClass);
                }
                break;
            }
        }
    }
}

function removeAllClasses(htmlItem) {
    for (var key in toggleClasses) {
        if (htmlItem.classList.contains(toggleClasses[key])) {
            htmlItem.classList.remove(toggleClasses[key]);
        }
    }
}

function isAnyToggleTrue(){
    for (var key in toggleValues) {
        if (toggleValues[key]) {
            return true;
        }
    }
    return false;
}

function runFunctionOnScroll(func) {
    window.addEventListener('scroll', function() {
        func();
    });
}

function addValuetoClassList(htmlItem, value){
    if (!htmlItem.classList.contains(value)) {
        htmlItem.classList.add(value);
    }
}