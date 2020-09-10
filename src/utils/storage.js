/* 
    对storage进行封装
*/
var storage = {
    setstorage: function (key, val) {
        window.localStorage.setItem(key, window.JSON.stringify(val));
    },
    getstorage: function(key){
        return JSON.parse(window.localStorage.getItem(key));
    } ,
    clearstorage: function(key){
        return window.localStorage.removeItem(key);
    }
}

export default storage;