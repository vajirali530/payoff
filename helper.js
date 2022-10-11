/**
 * Store data in chrome storage as key value pair
 * @param {string} key 
 * @param {value} value 
 * @returns boolen
 */
export function setChromeStorage(key, value) {
    let storingData = {};
    storingData[key] = value;

    try {
        chrome.storage.sync.set(storingData);
        return true;
    } catch (error) {
        console.log('storing error', error);
        return false;
    }

}


/**
 * Get data from chrome storage by passing array of keys
 * @param {array} key 
 * @returns Promise
 */
export function getChromeStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(result) {
            resolve(result);
        })
    })
}