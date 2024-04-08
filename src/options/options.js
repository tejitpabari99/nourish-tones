/*
* Copyright (c) 2024 Tejit Pabari
* JS file for options page. Saves and restores user preferences.
*/

const saveOptions = () => {
    const default_diet = document.getElementById('default_diet').value;
    const allergies_list = document.getElementById('allergiesList').value
                                    .split(',').map((allergy) => allergy.trim());
    const allergiesDefault = document.getElementById('allergiesDefault').checked;
  
    chrome.storage.sync.set(
      { default_diet: default_diet, allergies_list: allergies_list, allergiesDefault: allergiesDefault},
      () => {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 1000);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { default_diet: '', allergies_list: [], allergiesDefault: false},
      (items) => {
        document.getElementById('default_diet').value = items.default_diet;
        document.getElementById('allergiesList').value = items.allergies_list.join(', ');
        document.getElementById('allergiesDefault').checked = items.allergiesDefault;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);