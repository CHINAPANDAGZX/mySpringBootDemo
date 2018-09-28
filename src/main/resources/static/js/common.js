function getFormData(id) {
	var obj = {};
	var objArr = $("#" + id).serializeArray();
	if (objArr && objArr.length) {
		var k, v;
		for (var i = 0; i < objArr.length; i++) {
			k = objArr[i].name;
			v = objArr[i].value;

			if (k in obj) {
				var arr;
				if ($.type(obj[k]) != 'array') {
					arr = [obj[k]];
				} else {
					arr = obj[k];
				}
				arr.push(v);
				obj[k] = arr;
			} else {
				obj[k] = v;
			}
		}
	}
	return obj;
}

function setFormData(id, entity) {
	var form = $("#" + id);
	for (var v in entity) {
		var input = form.find("input[name='" + v + "']");
		if (input.length == 0) input = form.find("select[name='" + v + "']");
		if (input.attr("type") == "checkbox") input.attr("checked", obj[v] ? "checked": null);
		input.val(entity[v]);
	}
}

function getDateStr(date) {
	if (!isDate(date)) {
		if (isNumber(date)) {
			date = new Date(date);
		} else {
			alert("类型有误");
			return null;
		}
	}
	
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	return year + "-" + month + "-" + day;
}

function getDateTimeStr(date) {
	if (!isDate(date)) {
		if (isNumber(date)) {
			date = new Date(date);
		} else {
			alert("类型有误");
			return null;
		}
	}
	
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
function getYYYYMMDDHHMM(date) {
	if (!isDate(date)) {
		if (isNumber(date)) {
			date = new Date(date);
		} else {
			alert("类型有误");
			return null;
		}
	}
	
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	
	var hour = date.getHours();
	var minute = date.getMinutes();
	return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}

function getJsType(v){
    return Object.prototype.toString.call(v);
    /*
    alert(jsType(null));//[object Null]
    alert(jsType(undefined));//[object Undefined]
    alert(jsType(1));//[object Number]
    alert(jsType(true));//[object Boolean]
    alert(jsType("2"));//[object String]
    alert(jsType([1,2,3]));//[object Array]
    alert(jsType({"name":"zhengjf"}));//[object Object]
    alert(jsType(jsType));//[object Function]
    alert(jsType(new Date()));//[object Date]
    alert(jsType(/^\d+$/));//[object Regexp]
    */
};

function isObject(v) {
    return getJsType(v) == "[object Object]";
}

function isFunction(v) {
    return getJsType(v) == "[object Function]";
}

function isString(v) {
    return getJsType(v) == "[object String]";
}

function isDate(v) {
	return getJsType(v) == "[object Date]";
}

function isNumber(v) {
	return getJsType(v) == "[object Number]";
}

function copyObj(obj) {
	var newObj = {};
	for (var k in obj) {
		newObj[k] = obj[k];
	}
	return newObj;
	var date = new Date();
}

function appendHidden(element, name, value) {
    if (isString(element)) {
    	element = document.getElementById(element);
    }
    var input = document.createElement('INPUT');  
    input.type='hidden';  
    input.name = name;
    input.value = value;  
    element.appendChild(input);
}

function clearAllHiddens(element) {
    if (isString(element)) {
    	element = document.getElementById(element);
    }
    $(element).find(":hidden").remove();
}

//数组去重
Array.prototype.unique = function() {
	var n = {}, r=[]; 						//n为hash表，r为临时数组
	for(var i = 0; i < this.length; i++) {	//遍历当前数组
		if (!n[this[i]]) {					//如果hash表中没有当前项
			n[this[i]] = true; 				//存入hash表
			r.push(this[i]); 				//把当前数组的当前项push到临时数组里面
		}
	}
	return r;
}

/**
 * 根据属性删除数组元素
 * @param prop 属性名，例如：“id”
 * @param value 属性值，例如：1
 * @param isSingle 是否删除一个就结束了
 */
Array.prototype.removeByProperty = function(prop, value, isSingle) {
	var count = 0;	//移除的数量
	var tmpObj;
	for (var i = 0; i < this.length; i++) {
		tmpObj = this[i];
		if ((prop in tmpObj) && tmpObj[prop] == value) {
			count++;
			this.splice(i--, 1);
			if (isSingle) return count;
		}
	}
	return count;
}

//获取某年某月的开始日期
function getMonthStartDate(myYear,myMonth){
	var monthStartDate = new Date(myYear, myMonth-1, 1);      
    return formatDate(monthStartDate); 
}
//获取某年某月的结束日期
function getMonthEndDate(myYear,myMonth){
	var monthEndDate = new Date(myYear, myMonth-1, getMonthDays(myYear,myMonth));      
    return formatDate(monthEndDate); 
}
//获得某年某月的天数     
function getMonthDays(myYear,myMonth){     
    var monthStartDate = new Date(myYear, myMonth-1, 1);      
    var monthEndDate = new Date(myYear, myMonth, 1);      
    var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);      
    return days;      
}
//格式化日期：yyyy-MM-dd     
function formatDate(date) {      
    var myyear = date.getFullYear();     
    var mymonth = date.getMonth()+1;     
    var myweekday = date.getDate();      
         
    if(mymonth < 10){     
        mymonth = "0" + mymonth;     
    }      
    if(myweekday < 10){     
        myweekday = "0" + myweekday;     
    }     
    return (myyear + "-"+mymonth + "-" + myweekday);      
}

/*  
js由毫秒数得到年月日  
使用： (new Date(data[i].creationTime)).Format("yyyy-MM-dd hh:mm:ss.S")  
*/  
Date.prototype.Format = function (fmt) { //author: meizz  
    var o = {  
        "M+": this.getMonth() + 1, //月份  
        "d+": this.getDate(), //日  
        "h+": this.getHours(), //小时  
        "m+": this.getMinutes(), //分  
        "s+": this.getSeconds(), //秒  
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
        "S": this.getMilliseconds() //毫秒  
    };  
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o)  
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
    return fmt;  
};

/* 
 * formatMoney(s,type) 
 * 功能：金额按千位逗号分割 
 * 参数：s，需要格式化的金额数值. 
 * 参数：type,判断格式化后的金额是否需要小数位. 
 * 返回：返回格式化后的数值字符串. 
 */  
function formatMoney(s, type) {  
    if (/[^0-9\.]/.test(s))  
        return "0";  
    if (s == null || s == "")  
        return "0";  
    s = s.toString().replace(/^(\d*)$/, "$1.");  
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");  
    s = s.replace(".", ",");  
    var re = /(\d)(\d{3},)/;  
    while (re.test(s))  
        s = s.replace(re, "$1,$2");  
    s = s.replace(/,(\d\d)$/, ".$1");  
    if (type == 0) {// 不带小数位(默认是有小数位)  
        var a = s.split(".");  
        if (a[1] == "00") {  
            s = a[0];  
        }  
    }  
    return s;  
}

/**
 * 加载等待效果
 * @param msg 文本（默认：正在处理，请稍候...）
 * @param fn 回调函数
 */
function loading(msg, fn) {
   $("<div class=\"datagrid-mask\" style='z-index:1000000'></div>").css({
    	display:"block",
    	width:"100%", 
    	height: Math.max($(window).height(), $(document.body).height())
    }).appendTo("body"); 
   $("<div class=\"datagrid-mask-msg\" style='z-index:100000'></div>").html(msg || "正在处理，请稍候...").appendTo("body").css({
    	display:"block",
    	left:($(document.body).outerWidth(true) - 200) / 2, top:($(window).height() - 56) / 2
   });
   $(document.body).addClass("no-scrol-y");
   
   if (fn) fn();
}

/**
 * 去掉加载等待效果
 * @param fn 回调函数
 */
function loaded(fn) {
	$(".datagrid-mask").remove();
	$(".datagrid-mask-msg").remove();
	$(document.body).removeClass("no-scrol-y");
	
	if (fn) fn();
}


var PI = 3.1415926535897932384626;
var X_PI = 3.14159265358979324 * 3000.0 / 180.0;
var A = 6378245.0;
var EE = 0.00669342162296594323;
var D2R = 0.017453;

function transformLat(x, y){
	var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
	ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
}

function outOfChina(lat, lon) {
    if (lon < 72.004 || lon > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;
    return false;
}
/**
 * 原始坐标(GPS-84) to 火星坐标系 (GCJ-02)
 * @param lat
 * @param lon
 * @return
 */
function gps84_To_Gcj02(lat, lon) {
	var result = [];
    if (outOfChina(lat, lon)) {
    	result = [lat,lon];
        return result;
    }
    var dLat = transformLat(lon - 105.0, lat - 35.0);
    var dLon = transformLon(lon - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * PI;
    var magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI);
    dLon = (dLon * 180.0) / (A / sqrtMagic * Math.cos(radLat) * PI);
    var mgLat = lat + dLat;
    var mgLon = lon + dLon;
    result = [mgLat,mgLon];
    return result;
}

/**
 *  将百度坐标系(BD-09) 坐标转换成火星坐标系(GCJ-02)坐标
 *  @param bd_lat
 *  @param bd_lon
 *  @return
 */
function bd09_To_Gcj02(bd_lat, bd_lon) {
    var x = bd_lon - 0.0065, y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    var tempLon = z * Math.cos(theta);
    var tempLat = z * Math.sin(theta);
    var gps = [tempLat,tempLon];
    return gps;
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02tobd09(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
}

/**
 * 计算两点间距离
 * @param lng1
 * @param lat1
 * @param lng2
 * @param lat2
 * @returns
 */
function fnDistance(lat1,lng1,lat2,lng2){
	if(lng1 == lng2 && lat1 == lat2) {
        return 0;
    }else{
    	var fdLambda = (lng1 - lng2) * D2R;
    	var fdPhi = (lat1 - lat2) * D2R;
    	var fPhimean = ((lat1 + lat2) / 2.0) * D2R;
    	var fTemp = 1 - EE * (Math.pow (Math.sin(fPhimean),2));
    	var fRho = (A * (1 - EE)) / Math.pow (fTemp, 1.5);
    	var fNu = A / (Math.sqrt(1 - EE * (Math.sin(fPhimean) * Math.sin(fPhimean))));
    	var fz = Math.sqrt (Math.pow(Math.sin(fdPhi / 2.0), 2) +
                Math.cos(lat2 * D2R) * Math.cos(lat1*D2R ) * Math.pow( Math.sin(fdLambda / 2.0),2));
    	fz = 2 * Math.asin(fz);
    	var fAlpha = Math.cos(lat2 * D2R) * Math.sin(fdLambda) * 1 / Math.sin(fz);
    	fAlpha = Math.asin (fAlpha);
    	var fR = (fRho * fNu) / ((fRho * Math.pow( Math.sin(fAlpha),2)) + (fNu * Math.pow( Math.cos(fAlpha),2)));
    	return fz * fR;
    }
}


/**
 * 通用flavr alert弹窗
 * @param msg
 * @param modal
 * @returns
 */
function flavrAlert(msg,modal){
	//不存在父页面
	if(window.top==window.self){
		//如果本页面引用flavr js则打开本页面弹窗
		if($.flavr){
			new $.flavr({
				dialog:'alert',
				modal   : modal,
				content:msg,
				buttons: {
			        ok: {
			            text: '确定'
			        }
			    }
			});
		}
	}else{
		//本页有引用flavr js则优先本窗口
		if($.flavr){
			new $.flavr({
				dialog:'alert',
				modal   : modal,
				content:msg,
				buttons: {
			        ok: {
			            text: '确定'
			        }
			    }
			});
		}else{
			//调用父页面弹窗
			window.top.flavrAlert(msg,modal);
		}
	}
}

/**
 * 通用flavr confirm弹窗
 * @param msg
 * @param callback
 * @returns
 */
function flavrConfirm(msg,callback){
	//不存在父页面
	if(window.top==window.self){
		//如果本页面引用flavr js则打开本页面弹窗
		if($.flavr){
			new $.flavr({
			    content     : msg,
			    dialog      : 'confirm',
			    buttons: {
			        ok:{
			            text: '确定',
			            style: 'danger',
			            action: function() {
			            	if(typeof callback === 'function'){
					        	callback(true);
					        }
			            }
			        },
			        cancel:{
			            text: '取消',
			            action: function() {
			            	if(typeof callback === 'function'){
					    		callback(false);
					        }
			            }
			        }
			    } 
			});
		}
	}else{
		//本页有引用flavr js则优先本窗口
		if($.flavr){
			new $.flavr({
			    content     : msg,
			    dialog      : 'confirm',
			    buttons: {
			        ok:{
			            text: '确定',
			            style: 'danger',
			            action: function() {
			            	if(typeof callback === 'function'){
					        	callback(true);
					        }
			            }
			        },
			        cancel:{
			            text: '取消',
			            action: function() {
			            	if(typeof callback === 'function'){
					    		callback(false);
					        }
			            }
			        }
			    } 
			});
		}else{
		//调用父页面弹窗
		window.top.flavrConfirm(msg,callback);
		}
	}
}

/**
 * 通用flavr prompt弹窗
 * @param msg
 * @param placeholder
 * @param callback
 * @returns
 */
function flavrPrompt(msg,placeholder,callback){
	//不存在父页面
	if(window.top==window.self){
		//如果本页面引用flavr js则打开本页面弹窗
		if($.flavr){
			new $.flavr({
			    content     : msg,
			    dialog      : 'prompt',
			    prompt      : { placeholder: placeholder },
			    buttons: {
			        ok:{
			            text: '确定',
			            style: 'danger',
			            action: function($container, $prompt) {
			            	if(typeof callback === 'function'){
					        	callback( $prompt.val() );
					        }
			            }
			        },
			        cancel:{
			            text: '取消'
			        }
			    } 
			});
		}
	}else{
		//本页有引用flavr js则优先本窗口
		if($.flavr){
			new $.flavr({
			    content     : msg,
			    dialog      : 'prompt',
			    prompt      : { placeholder: placeholder },
			    buttons: {
			        ok:{
			            text: '确定',
			            style: 'danger',
			            action: function($container, $prompt) {
			            	if(typeof callback === 'function'){
					        	callback( $prompt.val() );
					        }
			            }
			        },
			        cancel:{
			            text: '取消'
			        }
			    } 
			});
		}else{
			//调用父页面弹窗
			window.top.flavrPrompt(msg,placeholder,callback);
		}
	}
}