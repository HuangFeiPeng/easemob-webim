/* 
    对storage进行封装
*/
var storage = {
    setstorage: function (key, val) {
        window.localStorage.setItem(key, window.JSON.stringify(val));
    },
    getstorage: function(key){
        return JSON.parse(window.localStorage.getItem(key));
    } 
}

export default storage;