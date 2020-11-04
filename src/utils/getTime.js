//实时获取时间
function getNowdate() {
  var t = new Date();
  var Y = t.getFullYear();
  var M = t.getMonth() + 1 < 10 ? "0" + (t.getMonth() + 1) : t.getMonth() + 1;
  var D = t.getDate() < 10 ? "0" + t.getDate() : t.getDate();
  var H = t.getHours() < 10 ? "0" + t.getHours() : t.getHours();
  var F = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
  var S = t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds();
  return `${Y}-${M}-${D}-${H}:${F}:${S}`;
}

//时间戳转换

export default getNowdate;
