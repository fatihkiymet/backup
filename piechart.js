(function () {
    if (!$.fn.akbPieChart) {
        var
            /*
            * initialize pie chart element
            */
            init = function (options) {
                var settings = this.data('settings');

                if (!is_undefined(settings)) { // if initialized earlier (settings saved as data), do nothing
                    log(settings, '"' + this.selector + '" has been initialized.');
                }
                else { // initialization
                    var id = this.attr('id'),
                        $this = $('#' + id),
                        w = $this.width(),
                        h = $this.height(),
                        paper = Raphael(id, w, h),
                        t = Math.floor((h) / 2),
                        l = Math.floor((w) / 2);

                    settings = $.extend(true, {}, $.fn.akbPieChart.defaults, options); // extend defaults with user options

                    // init some settings
                    settings.radius = settings.radius || t - 10;
                    settings.top = settings.top || t;
                    settings.left = settings.left || l;
                    settings.data = convertSortData(settings, settings.data);
                    settings.dataInitial = convertSortData(settings, settings.dataInitial);

                    if (validate(settings)) { // if settings are valid
                        // save settings
                        this.data('settings', settings);

                        // set Raphael element's custom attribues
                        setCustomAttributes(settings, paper);                        

                        // render totalEl and legendsEl
                        renderTotalLegends.call(this, settings);

                        if (settings.animate) { // animation enabled
                            renderChart.call(this, settings, paper); // render dataInitial first
                        }

                        // render chart with settings.data
                        renderChart.call(this, settings);
                    }
                }

                return this; // chaining
            },
            /*
            * validate settings
            */
            validate = function (settings) {
                if (!is_array(settings.data) || settings.data.length == 0) {
                    log(true, '"data" must be an array.');
                    return false; // not valid
                }

                if (!is_array(settings.dataInitial) || settings.dataInitial.length < 2) {
                    log(true, '"dataInitial" must be an array and has minimum 2 items.');
                    return false; // not valid
                }

                if (!is_function(settings.dataConverter)) {
                    log(true, '"dataConverter" must be a function.');
                    return false; // not valid
                }

                if (!is_number(settings.dataMaxLength) || settings.dataMaxLength < 2 || settings.dataMaxLength > 20) {
                    log(true, '"dataMaxLength" must be a number and between 2 and 20.');
                    return false; // not valid
                }

                if (!is_number(settings.radius) || settings.radius < 10) {
                    log(true, '"radius" must be a number and greater than 10.');
                    return false; // not valid
                }

                if (!is_number(settings.donutPercent) || settings.donutPercent < 10 || settings.donutPercent > 90) {
                    log(true, '"donutPercent" must be a number and between 10 and 90.');
                    return false; // not valid
                }

                if (!is_undefined(settings.gradientMaskCss) && !is_object(settings.gradientMaskCss)) {
                    log(true, '"gradientMaskCss" must be an object.');
                    return false; // not valid
                }

                return true; // valid
            },
            /*
            * Raphael element's custom attribues
            */
            setCustomAttributes = function (settings, paper) {
                // donut; http://stackoverflow.com/questions/7972347/raphael-js-converting-pie-graph-to-donut-graph
                paper.customAttributes.piece = function (x, y, r1, r2, a1, a2, i, tooltip) {
                    var flag = (a2 - a1) > 180;

                    a1 = (a1 % 360) * Math.PI / 180;
                    a2 = (a2 % 360) * Math.PI / 180;

                    var x1 = x + r1 * Math.cos(a1),
                        y1 = y + r1 * Math.sin(a1),
                        x2 = x + r1 * Math.cos(a2),
                        y2 = y + r1 * Math.sin(a2),
                        xx1 = x + r2 * Math.cos(a1),
                        yy1 = y + r2 * Math.sin(a1),
                        xx2 = x + r2 * Math.cos(a2),
                        yy2 = y + r2 * Math.sin(a2);

                    return {
                        path: [
                            ['M', xx1, yy1],
                            ['L', x1, y1],
                            ['A', r1, r1, 0, +flag, 1, x2, y2],
                            ['L', xx2, yy2],
                            ['A', r2, r2, 0, +flag, 0, xx1, yy1],
                            ['Z']
                        ],
                        fill: tooltip ? 'transparent' : getColor(settings, i),
                        stroke: tooltip ? 'transparent' : getStroke(a1 == a2, settings, i),
                        "stroke-opacity" : 0,
                        "stroke-linejoin": "round"
                    };
                }
            },
            /*
            * convert and sort data
            */
            convertSortData = function (settings, data) {
                if (data.length == 1) { // chart must have at least 2 pieces to render
                    var o = {};
                    o[settings.dataProperty.name] = 'dummy';
                    o[settings.dataProperty.value] = data[0][settings.dataProperty.value] / 1000; // minimum piece (near to zero)
                    data.push(o);
                }
                else {
                    var nonZeroCount = 0,
                        i,
                        inx;

                    for (i = 0; i < data.length; i++)
                        if (data[i][settings.dataProperty.value] > 0) {
                            inx = i; // non-zero element's index
                            nonZeroCount++;
                        }

                    if (nonZeroCount === 0) { // all elements have value = 0
                        $.merge(data, settings.dataInitial); // then, add dataInitial to data
                    }
                    else if (nonZeroCount === 1) { // only one element has value > 0
                        var o = {};
                        o[settings.dataProperty.name] = '';
                        o[settings.dataProperty.value] = data[inx][settings.dataProperty.value] / 1000; // minimum piece (near to zero)
                        data.push(o);
                    }
                    // else, at least 2 elements have value > 0
                }

                data = $.fn.akbPieChart.defaults.dataConverter.call(this, data);

                // sort data if sorting enabled
                if (settings.sort) {
                    return data.sort(function (a, b) {
                        return b[settings.dataProperty.value] - a[settings.dataProperty.value];
                    });
                }

                return data;
            },
            /*
            * render totalEl and legendsEl
            */
            renderTotalLegends = function (settings) {
                var me = this;
                if (is_string(settings.totalEl)) {
                    $('#' + settings.totalEl).empty().append('<span/>').find('span').html(settings.currency == 'TL' ? settings.totalValue + ' TL' : settings.currency + ' ' + settings.totalValue).css({
                        'white-space': 'nowrap',
                        'z-index': is_number(this.css('z-index')) ? +(this.css('z-index')) + 2 : 2
                    });
                }

                if (is_string(settings.legendSettings.elementId)) {
                    var $legends = $('#' + settings.legendSettings.elementId).css({
                        'z-index': is_number(this.css('z-index')) ? +(this.css('z-index')) + 3 : 3
                    }),
                    html = '<ul class="legends">';
                    $legends.empty();

                    for (var i = 0; i < settings.data.length; i++) {
                        if (settings.data[i].legend) {
                            html += '<li class="clearfix" unselectable="on" onselectstart="return false;">' + settings.data[i].legend + '</li>';
                        }
                    }

                    html += '</ul>';
                    
                    var $ul = $(html),
                        $uls = $legends.children();

                    $legends.append($ul);                   

                    var $children = $ul.children();

                    $(this).data('legends', $children);

                    $children.each(function () {
                        var $legend = $(this);
                        $legend.bind('mouseover', function (event) {
                            settings.legendSettings.mouseover($(me).data('pieces')[$(this).index()], settings);
                        }).bind('mouseout', function (event) {
                            settings.legendSettings.mouseout($(me).data('pieces')[$(this).index()], settings);
                        });
                    });      

                    if (settings.animate) {
                        for (i = 0; i < $uls.length; i++) {
                            $uls.eq(i).stop(true).slideUp(function () {
                                $(this).remove();
                            });
                        }
                        $ul.stop(true).fadeIn();
                    }
                    else {
                        $uls.eq(0).remove();
                        $ul.show();
                    }
                }
            },
            /*
            * calculate total value of given data
            */
            calculateTotal = function (data) {
                for (var total = 0, i = 0; i < data.length; i++) {
                    total += data[i].value;
                }

                return total;
            },
            /*
            * render chart pieces (animated or non-animated)
            */
            renderChart = function (settings, paper) {

                var me = this,
                    pieces = this.data('pieces') || paper.set(),
                    data = settings.animate && settings.animateReset ? settings.dataInitial : settings.data,
                    total = calculateTotal(data),
                    start,
                    i,
                    val,
                    radiusDonut,
                    path,
                    angle,
                    mangle,
                    cos,
                    sin;

                start = 180 - (360 / total * data[0][settings.dataProperty.value]) - .5; // .5 => line correction

                if (pieces.length == 0) {
                    for (i = 0; i < settings.data.length; i++) {
                        val = 360 / total * (i < data.length ? data[i][settings.dataProperty.value] : 0);

                        var p = paper.path().attr({
                            piece: [
                                settings.left,      // x
                                settings.top,       // y
                                settings.radius,    // r1
                                0,                  // r2
                                start,              // a1
                                start += val,        // a2
                                i                   // i
                            ]
                        });

                        if (!!settings.animate === false) {
                            var idx = settings.data[i].name == 'dummy' ? i - 1 : i;
                            $(p.node).data('legend', $(this).data('legends')[idx]);
                        }

                        p.hover(function () {
                            this.animate({ transform: "s1.1, 1.1, {0}, {1}".format(settings.left, settings.top) }, 500, "elastic"); 
                            $($(this.node).data('legend')).addClass('over');

                        }, function () {
                            this.animate({ transform: "s1, 1" }, 500, "elastic");
                            $($(this.node).data('legend')).removeClass('over');
                        });
                        if (settings.data[i].name != '' && settings.data[i].name !== "dummy" && settings.showTooltip && settings.data[i] && settings.tooltipfn) {
                            settings.tooltipfn(p.node, settings.data[i], settings);
                        }

                        pieces.push(p);
                    }

                    this.data('pieces', pieces);
                }
                else if (settings.animate) {
                    for (i = 0; i < settings.data.length; i++) {
                        val = 360 / total * (i < data.length ? data[i][settings.dataProperty.value] : 0);
                        radiusDonut = settings.donut ? settings.radius * (100 - settings.donutPercent + 10) / 100 : 0;

                        var idx = settings.data[i].name == 'dummy' ? i - 1 : i;
                        $(pieces[i].node).data('legend', $(this).data('legends')[idx]);

                        if (settings.data[i].name !== "dummy" && settings.data[i] && settings.showTooltip && settings.tooltipfn) {
                            settings.tooltipfn(pieces[i].node, settings.data[i], settings)
                        }

                        pieces[i].stop().animate({
                            piece: [
                                settings.left,
                                settings.top,
                                settings.radius,
                                radiusDonut,
                                start,
                                start + val,
                                i
                            ]
                        }, settings.animateReset ? settings.animationDuration / 2 : settings.animationDuration, settings.animationEasing);

                        start += val;
                    }

                    if (settings.animateReset) {
                        setTimeout(function () {
                            total = calculateTotal(settings.data);

                            start = 180 - (360 / total * settings.data[0][settings.dataProperty.value]) - .5; // .5 => line correction

                            for (i = 0; i < settings.data.length; i++) {
                                val = 360 / total * (i < settings.data.length ? settings.data[i][settings.dataProperty.value] : 0);
                                radiusDonut = settings.donut ? settings.radius * (100 - settings.donutPercent) / 100 : 0;

                                pieces[i].stop().animate({
                                    piece: [
                                                settings.left,
                                                settings.top,
                                                settings.radius,
                                                radiusDonut,
                                                start,
                                                start + val,
                                                i
                                    ]
                                }, settings.animationDuration, settings.animationEasing);

                                start += val;
                            }
                        }, settings.animationDuration / 2);
                    }
                }
                else {
                    for (i = 0; i < settings.data.length; i++) {
                        val = 360 / total * (i < data.length ? data[i][settings.dataProperty.value] : 0);
                        radiusDonut = settings.donut ? settings.radius * (100 - settings.donutPercent) / 100 : 0;

                        pieces[i].attr({
                            piece: [
                                settings.left,
                                settings.top,
                                settings.radius,
                                radiusDonut,
                                start,
                                start + val,
                                i
                            ]
                        });

                        start += val;
                    }
                }
            },
            /*
            * get color from colorPalette string / array
            */
            getColor = function (settings, i) {
                return is_array(settings.colorPalette) ? (i < settings.colorPalette.length ? settings.colorPalette[i] : settings.colorPalette[settings.colorPalette.length - 1]) : settings.colorPalette;
            },
            /*
            * get stroke from stroke string / array
            */
            getStroke = function (none, settings, i) {
                return none ? 'none' : (is_array(settings.stroke) ? (i < settings.stroke.length ? settings.stroke[i] : settings.stroke[0]) : settings.stroke);
            },
            /*
            * user accessible methods
            */
            publicMethods = {
                /*
                * refresh chart with new data (and set total value)
                */
                refresh: function (data, totalValue, currency, afterRefreshCallback) {
                    var settings = this.data('settings');

                    if (is_undefined(settings)) {
                        settings = $.extend(true, {}, $.fn.akbPieChart.defaults);
                    }

                    settings.data = convertSortData(settings, settings.data); // previous data
                    data = convertSortData(settings, data.length ? data : settings.dataInitial); // new data

                    if (settings.animateReset || !is_arrays_equal(settings.data, data)) {
                        settings.totalValue = totalValue;
                        settings.currency = currency;
                        settings.data = data;

                        if (validate(settings)) {
                            // save settings
                            this.data('settings', settings);

                            // render totalEl and legendsEl
                            renderTotalLegends.call(this, settings);

                            // render chart with settings.data
                            renderChart.call(this, settings);

                            if (afterRefreshCallback) {
                                afterRefreshCallback();
                            }
                        }
                    }

                    return this; // chaining
                },
                /*
                * destroy plugin
                */
                destroy: function () {
                    this.removeData('settings').removeData('pieces');

                    return this; // chaining
                }
            };

        /*
        * plugin function
        */
        $.fn.akbPieChart = function () {

            //	no element
            if (!this.length) {
                log(true, 'No element found for "' + this.selector + '".');
                return this;
            }

            //	multiple elements
            if (this.length > 1) {
                return this.each(function () {
                    var $this = $(this);
                    $this.akbPieChart.apply($this, arguments);
                });
            }

            var args = arguments,
                method = args[0];

            if (is_function(publicMethods[method])) { // if first argument is user accessible method
                method = publicMethods[method];
                args = Array.prototype.slice.call(args, 1);
            }
            else if (is_object(method) || !method) { // plugin initialization
                method = init;
            }
                // else, something went wrong, log it
            else if (is_string(method)) {
                log(true, '"' + method + '" method does not exist.');
                return this; // chaining
            }
            else {
                log(true, 'Wrong argument.');
                return this; // chaining
            }

            // run method, assigned earlier with arguments
            return method.apply(this, args);
        }

        /*
        * plugin default configuration
        */
        $.fn.akbPieChart.defaults = {
            // data
            dataInitial: [{
                name: '',
                value: 1000
            }, {
                name: '',
                value: 1
            }],
            dataProperty: {
                name: 'name',
                value: 'value'
            },
            dataConverter: function (data) {
                return data;
            },
            dataMaxLength: 10,
            sort: true,

            // colors of pieces
            colorPalette : akbank.ui.graph.colorPalette,
            stroke: 'transparent', // array or string

            // gradient
            showGradientMask: false,
            gradientMaskSrc: '',
            gradientMaskCss: null,

            // animation
            animate: true,
            animationDuration: 1200, // milliseconds
            animationEasing: 'bounce',
            animateReset: true, // animate to dataInitial first, than new data

            // dimensions and position
            radius: 0,
            top: 0,
            left: 0,

            // for donut appearance true, for circle appearance false
            donut: true,
            donutPercent: 60,

            // tooltip
            showTooltip: true,
            // totals and legends
            totalEl: null,
            totalValue: 0,
            currency: 'TL',
            tooltipfn: function (element, data, settings, target) {
                akbank.ui.graph.createTooltip(element, data, settings, target);
            },
            legendSettings: {
                showTooltip: true,
                elementId: null,
                mouseover: function (path, settings) {
                    path.animate({ transform: "s1.1, 1.1, {0}, {1}".format(settings.left, settings.top) }, 500, "elastic");
                },
                mouseout: function (path, settings) {
                    path.animate({ transform: "s1, 1" }, 500, "elastic");
                }
            },
            onmouseover: false,
            onmouseout: false,
            debug: true
        }
    }
})();
