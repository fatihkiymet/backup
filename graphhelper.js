// helper functions
function is_null(a) {
    return (a === null);
}
function is_undefined(a) {
    return (is_null(a) || typeof a == 'undefined' || a === '' || a === 'undefined');
}
function is_array(a) {
    return (a instanceof Array);
}
function is_jquery(a) {
    return (a instanceof jQuery);
}
function is_object(a) {
    return ((a instanceof Object || typeof a == 'object') && !is_null(a) && !is_jquery(a) && !is_array(a) && !is_function(a));
}
function is_number(a) {
    return ((a instanceof Number || typeof a == 'number') && !isNaN(a));
}
function is_string(a) {
    return ((a instanceof String || typeof a == 'string') && !is_undefined(a) && !is_true(a) && !is_false(a));
}
function is_function(a) {
    return (a instanceof Function || typeof a == 'function');
}
function is_boolean(a) {
    return (a instanceof Boolean || typeof a == 'boolean' || is_true(a) || is_false(a));
}
function is_true(a) {
    return (a === true || a === 'true');
}
function is_false(a) {
    return (a === false || a === 'false');
}
function is_date(a) {
    return (a && typeof a.getDate != 'undefined');
}

function is_arrays_equal(arr1, arr2) {
    return JSON.stringify(arr1) == JSON.stringify(arr2);
}
function is_array_filled(a) {
    return is_array(a) && a.length;
}
function is_array_empty(a) {
    return is_array(a) && !a.length;
}

// is day in dd.mm.yyyy format
function is_day_valid(day) {
    if (day && day.length == 10) {
        var parts = day.split('.');
        return parts.length == 3 && parts[0].toString().length == 2 && parts[1].toString().length == 2 && parts[2].toString().length == 4 && is_number(+parts[0]) && is_number(+parts[1]) && is_number(+parts[2]);
    }
    else
        return false;
}

// parse a date in dd.mm.yyyy format (http://stackoverflow.com/questions/2587345/javascript-date-parse)
function parseDate(day) {
    if (is_day_valid(day)) {
        var parts = day.split('.');
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(+parts[2], +parts[1] - 1, +parts[0]); // months are 0-based
    }
    else
        return null;
}

function convertDay2Str(day, appendDayName) {
    var d = day.getDate(),
        m = day.getMonth() + 1;

    return (d >= 10 ? d : '0' + d) + '.' + (m >= 10 ? m : '0' + m) + '.' + day.getFullYear() + (appendDayName ? ' ' + getDayName(day.getDay()) : '');
}

function getDayName(dayNo) {
    var dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']; // FIXME : resx
    return (dayNo >= 0 && dayNo <= 6) ? dayNames[dayNo] : '';
}

// gives day difference between two Date s (http://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript)
function getDayDifference(firstDay, lastDay) {
    return Math.ceil(Math.abs(lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)); // 1 day = 1000 milliseconds * 60 seconds * 60 minutes * 24 hours
}

// gives month difference between two Date s (http://stackoverflow.com/questions/4312825/javascript-month-difference)
function getMonthDifference(firstDay, lastDay) {
    return lastDay.getMonth() - firstDay.getMonth() + (12 * (lastDay.getFullYear() - firstDay.getFullYear()));
}

// add count of days to a given Date (http://www.webdeveloper.com/forum/showthread.php?151997-how-to-add-days-to-current-date-in-javascript&p=874211#post874211)
function addDays(day, count) {
    return count ? new Date(+day + (1000 * 60 * 60 * 24 * count)) : day;
}

// Month is 1 based (http://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript)
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function log(debugConf, message) {
    if (!debugConf || is_undefined(window.console) || is_undefined(window.console.log)) {
        return false;
    }
    else if (is_object(debugConf)) {
        if (!debugConf.debug) {
            return false;
        }

        if (is_string(message)) {
            message = 'akbChart (' + debugConf.selector + '): ' + message;
        }
        else {
            message = ['akbChart (' + debugConf.selector + '):', message];
        }
    }
    else if (is_string(message)) {
        message = 'akbChart: ' + message;
    }
    else {
        message = ['akbChart:', message];
    }

    window.console.log(message);
}

// http://stackoverflow.com/questions/3303772/raphael-js-rect-with-one-round-corner
// http://www.remy-mellet.com/blog/179-draw-rectangle-with-123-or-4-rounded-corner/
// roundedRectangle(x, y, width, height, upper_left_corner, upper_right_corner, lower_right_corner, lower_left_corner)
Raphael.fn.roundedRectangle = function (x, y, w, h, r1, r2, r3, r4) {
    var array = [];
    array = array.concat(['M', x, r1 + y, 'Q', x, y, x + r1, y]); // A
    array = array.concat(['L', x + w - r2, y, 'Q', x + w, y, x + w, y + r2]); // B
    array = array.concat(['L', x + w, y + h - r3, 'Q', x + w, y + h, x + w - r3, y + h]); // C
    array = array.concat(['L', x + r4, y + h, 'Q', x, y + h, x, y + h - r4, 'Z']); // D

    return this.path(array);
};

Raphael.fn.barIncome = function (x, y, w, h, r) {
    r = r ? r : 6;

    return this.roundedRectangle(x, y, w, h, r, r, 0, 0).attr({
        //'fill': '90-#5a090f:0-#dc1625',
        //'fill': 'rgba(194, 194, 194, .4)',
        'fill': '0-#ccc:0-#d6d6d6',
        'fill-opacity': .5,
        'stroke': 'none',
        'cursor': 'pointer'
    });
};

Raphael.fn.barOutgoing = function (x, y, w, h, r) {
    r = r ? r : 6;

    return this.roundedRectangle(x, y, w, h, 0, 0, r, r).attr({
        //'fill': 'rgba(217, 217, 217, .4)',
        'fill': '0-#ddd:0-#e6e6e6',
        'fill-opacity': .5,
        'stroke': 'none',
        'cursor': 'pointer'
    });
};

Raphael.fn.lineOrigin = function (w, y) {
    return this.path(['M', 0, y, 'L', w, y]).attr({
        'fill': 'none',
        'stroke': '#989898',
        'stroke-width': 1
    });
};