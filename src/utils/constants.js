/*
* Copyright (c) 2024 Tejit Pabari
* Constants file
*/

const EXT_NAME = "Nourish Tones"
const EXT_VERSION = "1.0"

const ItemLists = {
    nonVegItemsList: [
        // General Terms
        "meat", "seafood", "boneless",
        // Meat Terms
        "chicken", "beef", "pork", "lamb", "bacon", "sausage", "ham", "pepperoni", "salami", "prosciutto", "steak", "veal", "tendon", "flank", "brisket",
        // Different types of animals
        "turkey", "goose", "rabbit", "bison", "buffalo", "venison", "boar", "elk", "frog", "turtle", "ox tail", "oxtail", "quail", "pheasant", "duck", "goat",
        // Indian Terms
        "mutton", "keema", "kheema", "kheema", "kheemo", "kheemo", "murgh",
        // Other cusine non-veg terms
        "chorizo", "andouille", "boudin", "blood", "pate", "liver", "gizzard", "intestine", "intestines", "tripe",
        // Dishes that are typically non-veg
        "brisket", "tenderloin", "fillet", "cutlet", "nugget", "wing","drumstick", "thigh", "leg", "breast", "rib", "rack", "meatball",
    ],
    vegItemList: [
        "veggie", "vegetarian"
    ],
    vegAmbiguousItemList: [
        "choice of meat"
    ],
    eggItemsList: [
        "egg", "mayonnaise", "mayo", "custard", "souffle", "soufflé", "souffle"
    ],
    nonVeganItemsList: [
        "dairy", "poultry", "cheese", "butter", "mayonnaise", "mayo", "yogurt", "yoghurt", "cream", "sour cream", "sourcream", "sour-cream", "half and half",
        "parmigiano", "parmesan", "mozzarella", "cheddar", "gouda", "brie", "feta", "ricotta", "provolone", "swiss", "asiago", "colby", 
        "monterey", "jack", "queso", "fresco",
        "paneer"
    ],
    veganItemsList: [
        "non dairy", "non-dairy", "plant based", "plant-based", "vegan", "tempeh", "seitan",
    ],
    veganAmbiguousItemsList: [
        "tofu", "soy", "soybean", "soy milk", "soymilk", "soy-milk", "almond milk", "almondmilk", "almond-milk", "oat milk", "oatmilk", "oat-milk", "rice milk", "ricemilk", "rice-milk",
        "coconut milk", "coconutmilk", "coconut-milk"
    ],
    seafoodItemsList: [
        // Seafood Terms
        "fish", "shrimp", "prawn", "crab", "lobster", "oyster", "mussel", "clam", "scallop", 
        "squid", "octopus", "escargot", "escargots", "mollusk", "mollusks", "molluscs", "calamari", "anchovy", "anchovies", 
        // Fishes
        "roe", "caviar", "sardine", "sardines", "herring", "mackerel", "trout", "salmon", "tuna", "catfish", "tilapia", "cod", 
        "halibut", "haddock", "pollock", "perch", "flounder", "sole", "whitefish", "bass", "carp", "pike", "sturgeon", "swordfish", "snapper"
    ],
    neutralList: [
        "beverage", "extras", "cutlery", "utensil", "bubble tea", "drink"
    ],
    ignoreList: [
        "Add Drinks to Your Order"
    ]
}

var toggleValues = {
    veg: false,
    noEgg: false,
    vegan: false,
    pascaterian: false,
    allergies: false
}

const toggleClasses = {
    correctClass: "greenClass",
    incorrectClass: "redClass",
    neutralClass: "greyClass",
    ambiguousClass: "yellowClass"
}

const toggleDetails = {
    veg: {
        title: "Vegetarian",
        id: "vegCheck"
    },
    vegNoEgg: {
        title: "Vegetarian (no egg)",
        id: "vegNoEggCheck"
    },
    vegan: {
        title: "Vegan",
        id: "veganCheck"
    },
    pascaterian: {
        title: "Pescaterian",
        id: "pascaterianCheck"
    }
}

const toggleOrder = ["veg", "vegNoEgg", "vegan", "pascaterian"]

const allergiesConfig = {
    title: "Allergies",
    id: "allergies",
    list: "allergiesList",
    checkBox: "allergiesDefault"
}

const categoryValues = {
    veg: false,
    vegAmbiguous: false,
    vegNoEgg: false,
    vegNoEggAmbiguous: false,
    vegan: false,
    veganAmbiguous: false,
    pascaterian: false,
    pascaterianAmbiguous: false,
    neutral: false,
    allergies: false
}