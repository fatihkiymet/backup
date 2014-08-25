String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.ltrim = function() {
    return this.replace(/^\s+/, "");
};
String.prototype.rtrim = function() {
    return this.replace(/\s+$/, "");
};
String.prototype.toSafeUrl = function() {
    var a = this;
    a = a.replace(/\s/g, "-");
    a = a.toLowerCase();
    a = a.replace(/ý/g, "i");
    a = a.replace(/þ/g, "s");
    a = a.replace(/ç/g, "c");
    a = a.replace(/ü/g, "u");
    a = a.replace(/ð/g, "g");
    a = a.replace(/ö/g, "o");
    a = a.replace(/[^a-zA-Z0-9\-,]/g, "");
    a = a.replace(/,/g, "-");
    a = a.replace(/\/+/g, "-");
    a = a.replace(/_/g, "-");
    a = a.substr(0, 100);
    return a;
};
String.prototype.changeTurkishChar = function() {
    var a = this;
    a = a.trim();
    a = a.replace(/I/g, "Ý");
    //	a = a.replace(/S/g, "Þ");
    //	a = a.replace(/C/g, "Ç");
    //	a = a.replace(/U/g, "Ü");
    //	a = a.replace(/G/g, "Ð");
    //	a = a.replace(/O/g, "Ö");
    return a;
};
String.prototype.urlParts = function() {
    var loc = this;
    loc = loc.split(/([a-z0-9_\-]{1,5}:\/\/)?(([a-z0-9_\-]{1,}):([a-z0-9_\-]{1,})\@)?((www\.)|([a-z0-9_\-]{1,}\.)+)?([a-z0-9_\-]{3,})((\.[a-z]{2,4})(:(\d{1,5}))?)(\/([a-z0-9_\-]{1,}\/)+)?([a-z0-9_\-]{1,})?(\.[a-z]{2,})?(\?)?(((\&)?[a-z0-9_\-]{1,}(\=[a-z0-9_\-]{1,})?)+)?/g);
    loc.href = this;
    loc.protocol = loc[1];
    loc.user = loc[3];
    loc.password = loc[4];
    loc.subdomain = loc[5];
    loc.domain = loc[8];
    loc.domainextension = loc[10];
    loc.port = loc[12];
    loc.path = loc[13];
    loc.file = loc[15];
    loc.filetype = loc[16];
    loc.query = loc[18];
    loc.anchor = loc[22];
    //return the final object
    return loc;
};

String.prototype.format = function (params) {
    var text = this;
    
    if (params === null || typeof (params) == "undefined") {
        return text;
    }


    $.each(arguments, function (index, val) {
        text = text.replace('{' + index + '}', val);
    });


    return text;
};

//Array
if (typeof (Array.prototype.indexOfItem) === typeof (undefined)) {
    Array.prototype.indexOfItem = function (comparer) {
        if (typeof (comparer) == "function") {
            var idx = -1;
            for (var i = 0; i < this.length; i++) {
                if (comparer(this[i])) {
                    return i;
                }
            }
            return idx;
        }
        else {
            var idx = -1;
            for (var i = 0; i < this.length; i++) {
                if (this[i] === comparer) {
                    return i;
                }
            }
            return idx;
        }
    };
}

//Array
if (typeof (Array.prototype.contains) === typeof (undefined)) {
    Array.prototype.contains = function (val) {

        return this.indexOfItem(val) > -1;
    };
}

if (typeof (Array.prototype.filter) === typeof (undefined)) {
    Array.prototype.filter = function (comparer) {
        var arr = [];

        if (typeof (comparer) == "function") {
            for (var i = 0; i < this.length; i++) {
                if (comparer(this[i])) {
                    arr.push(this[i]);
                }
            }
        }

        return arr;
    };
}

if (typeof (Array.replace) === typeof (undefined)) {
    Array.prototype.replace = function (value, replacement) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                this[i] = replacement;
            }
        }

        return this;
    };
}

Array.prototype.findSequentialNumbers = function () {
    var arr = this;    
    var result = [];
    var i = 1;
    var cursor = 0;

    var addToResult = function (startIndex, endIndex) {
        result.push({
            start: arr[startIndex - 1],
            end: arr[endIndex - 1]
        });
    };

    while (i <= arr.length) {
        var prev = i - 1;

        //if last
        if (i == arr.length) {
            addToResult(i - cursor, i);
            break;
        }

        var currentValue = arr[i];
        var prevValue = arr[prev];

        if (currentValue == prevValue + 1)
            cursor++;
        else {
            addToResult(i - cursor, i);
            cursor = 0;
        }

        i++;
    }

    return result;
};

if (typeof (Array.prototype.max) === typeof (undefined)) {
    Array.prototype.max = function () {
        var arr = this;
        var maxValue = null;

        for (var i = 0; i < this.length; i++) {
            if (maxValue === null) {
                maxValue = arr[i];
                continue;
            }
        
            if(arr[i] > maxValue) {
                maxValue = arr[i];
            }
        }

        return maxValue;
    };
};

if (!Array.prototype.min) {
    Array.prototype.min = function () {
        var arr = this;
        var minValue = null;

        for (var i = 0; i < this.length; i++) {

            if (minValue === null) {
                minValue = arr[i];
                continue;
            }

            if (arr[i] < minValue) {
                minValue = arr[i];
            }
        }

        return minValue;
    };
};

function checkArrays(arrA, arrB) {

    //check if lengths are different
    if (arrA.length !== arrB.length) return false;

    //slice so we do not effect the orginal
    //sort makes sure they are in order
    var cA = arrA.slice().sort();
    var cB = arrB.slice().sort();

    for (var i = 0; i < cA.length; i++) {
        if (cA[i] !== cB[i]) return false;
    }

    return true;

}

//Int
tryParseInt = function (value, defaultValue) {
    var val = parseInt(value);
    if (val.toString() === 'NaN')
        return defaultValue;
    return val;
};

parseSerializedJsonDate = function(exp) {
    return new Date(parseInt(exp.substr(6)));
};

//Date
if (!Date.prototype.addDays) {
    Date.prototype.addDays = function(day) {
        var ms = this.getTime() + (86400000 * day);
        return new Date(ms);
    };
}

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}