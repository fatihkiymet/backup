(function (A) {
    A.ui = {}

    return A.ui;
})(akbank);

(function (A) {
    A.browser = {
        ie: {
            isVersionLessThan: function (version) {
                return $.browser.msie && parseInt($.browser.version, 10) < version;
            },
            isIE7: function () {
                return $.browser.msie && parseInt($.browser.version, 10) === 7;
            },
            isIE8: function () {
                return $.browser.msie && parseInt($.browser.version, 10) === 8;
            }
        }
    };

    return A.browser;

})(akbank);

(function (ui) {
    ui.format = {
        toCurrency: function (num, digit, currency) {
            var result = "";
            if (!currency) {
                currency = "TL";
            }

            currency = currency == "DOLAR" ? "USD" : currency;

            if (typeof (num) === 'number') {
                result = num.toFixed(digit) + " " + currency;
                var parts = result.replace(".", ",").split(",");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                result = parts.join(",");
            }
            else {
                result = num + " " + currency;
                var parts = result.replace(".", ",").split(",");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                result = parts.join(",");
            }

            return result;
        }
    }

    return ui.format;
})(akbank.ui);

(function (ui) {
    ui.tooltip = {
        defaults: {
            prerender: true,
            position: {
                target: 'mouse',
                adjust: {
                    x: 10,
                    y: -30
                }
            },
            style: {
                def: false,
                classes: 'vp-qtip-custom',
                tip: {
                    corner: 'bottom left',
                    width: 16,
                    height: 15
                }
            },
            show: {
                event: 'mouseover',
                delay: 300
            },
            hide: {
                event: 'mouseout'
            }
        },
        create: function (options) {
            return $.extend(true, {}, this.defaults, options);
        }
    }

    return ui.tooltip;
})(akbank.ui);


(function (ui) {
    var $html = $('html'),
        colorfulPalette,
        colorPalette;

    if ($html.hasClass('is-segment-premier')) {
        colorfulPalette = ["90-#7BCC55-#A7FB73", "45-#0B73D2-#0E99FA", "0-#E37201-#FC9B03", "0-#ccc-#999", '#FF00FF', '#0000ff', '#7d1111', '#690000', '#5c0000', '#4f0000', '#3f0000', '#300']; // specify colors as of dataMaxLength
        colorPalette = ['#707070', "#565656", "#3D3D3D", '#232323', '#161616', "#636363", "#4A4A4A", '#303030', '#2A2A2A', '#1D1D1D', '#101010', '#060606']; // specify colors as of dataMaxLength
    }
    else if ($html.hasClass('is-segment-bo')) {
        colorfulPalette = ["90-#7BCC55-#A7FB73", "45-#0B73D2-#0E99FA", "0-#E37201-#FC9B03", "0-#ccc-#999", '#FF00FF', '#0000ff', '#7d1111', '#690000', '#5c0000', '#4f0000', '#3f0000', '#300']; // specify colors as of dataMaxLength
        colorPalette = ['#7a95a1', "#57707b", "#334a55", '#10252f', '#0070a1', "#68828e", "#455d68", '#223842', '#03648e', '#05577b', '#084a68', '#0b3e55']; // specify colors as of dataMaxLength
    }
    else {
        colorfulPalette = ["90-#7BCC55-#A7FB73", "45-#0B73D2-#0E99FA", "0-#E37201-#FC9B03", "0-#ccc-#999", '#FF00FF', '#0000ff', '#7d1111', '#690000', '#5c0000', '#4f0000', '#3f0000', '#300']; // specify colors as of dataMaxLength
        colorPalette = ['#ed222a', "#c51522", "#a41722", "#7e1717", "#5b1011", '#0000ff', '#7d1111', '#690000', '#5c0000', '#4f0000', '#3f0000', '#300']; // specify colors as of dataMaxLength
    }

    ui.graph = {
        parseGradientColor: function (gradient) {
            var colArr = gradient.split('-');
            if (colArr.length > 1)
                gradient = colArr[1]

            return gradient;
        },
        colorfulPalette: colorfulPalette,
        colorPalette: colorPalette,
        createLegend: function (item, color) {
            var html = '';
            color = akbank.ui.graph.parseGradientColor(color);

            if (!!item.name === true) {
                html += '<span class="legend-color" style="background-color:' + color + ';"></span><span class="legend-text" unselectable="on" onselectstart="return false;">' + item.name + '</span>';
            }
            if (!!item.value === true) {
                html += '<span class="clear legend-value">' + akbank.ui.format.toCurrency(item.value, 2) + '</span>';
            }

            return html;
        },
        getTooltipSettings: function (options) {
            var size = akbank.ui.size.calculate(12, options.content);
            var tooltipHeight = size.height;

            return akbank.ui.tooltip.create({
                id: options.id,
                content: options.content,
                position: {
                    target: 'mouse',
                    adjust: {
                        mouse: false,
                        x: 0,
                        y: (tooltipHeight + 11) * -1,
                        method: 'shift none'
                    },
                    viewport: $(window)
                },
                show: {
                    event: 'mouseover',
                    target: $(options.target).add($(options.target).data('legend')),
                    delay: 300
                },
                hide: {
                    event: 'mouseout',
                    target: $(options.target).add($(options.target).data('legend'))
                }
            });
        },
        createTooltip: function (element, data, settings) {
            var qtipSettings;
            var id = guidGenerator();

            var tooltipHtml = akbank.ui.format.toCurrency(data.value, 2, settings.currency);

            if (data.tooltip)
                tooltipHtml = data.tooltip;

            var tooltipId = $(element).attr('data-hasqtip');
            var $tipElement = $('#qtip-' + tooltipId);

            if ($tipElement && $tipElement.length > 0) {
                $tipElement.qtip("api").destroy();
            }

            qtipSettings = akbank.ui.graph.getTooltipSettings({
                content: tooltipHtml,
                id: !!$.trim(tooltipId) === true ? tooltipId : id,
                target: element
            });

            $(element).qtip(qtipSettings);

        }
    }

    return ui.graph;
})(akbank.ui);

(function (ui) {
    ui.combobox = {
        addComboBoxItem: function (combo, text, value, selected) {
            var comboItem = new Telerik.Web.UI.RadComboBoxItem();
            comboItem.set_text(text);
            comboItem.set_value(value);
            combo.trackChanges();
            combo.get_items().add(comboItem);
            if (selected) {
                comboItem.select();
            }
            combo.commitChanges();
        },
        databind: function (combo, list, dataPropertyName, dataPropertyValue) {
            $(list).each(function () {
                var comboItem = new Telerik.Web.UI.RadComboBoxItem();
                comboItem.set_text(this[dataPropertyName]);
                comboItem.set_value(this[dataPropertyValue]);
                combo.get_items().add(comboItem);

                if (this.selected) {
                    comboItem.select();
                }
            });
        },
        selectItemWithValue: function (combo, value) {
            if (combo) {
                var item = combo.findItemByValue(value);
                if (item) item.select();
            }
        }
    }

    return ui.combobox;
})(akbank.ui);

(function (ui) {
    // http://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = [37, 38, 39, 40],
        preventDefault = function (e) {
            e = e || window.event;
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        },
        wheel = function (e) {
            preventDefault(e);
        },
        keydown = function (e) {
            if (e && e.keyCode) {
                for (var i = keys.length; i--;) {
                    if (e.keyCode === keys[i]) {
                        preventDefault(e);
                        return;
                    }
                }
            }
        },
        $iframeScroll = $('#iframe-scroll'),
        isMobile = $(document.body).hasClass('is-mobile');

    ui.scroll = {
        disableMouseWheelScrolling: function (element) {
            if (isMobile) {
                $iframeScroll.css('overflow-y', 'hidden');
            }
            else {
                if (window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', wheel, false);
                }
                else {
                    element.attachEvent("onmousewheel", wheel);
                }

                window.onmousewheel = document.onmousewheel = wheel;
                document.onkeydown = keydown;
            }
        },
        enableMouseWheelScrolling: function (element) {
            if (isMobile) {
                $iframeScroll.css('overflow-y', 'auto');
            }
            else {
                if (window.removeEventListener) {
                    window.removeEventListener('DOMMouseScroll', wheel, false);
                }
                else {
                    $(element).unbind("onmousewheel", this.mouseWheelHandler);
                }

                window.onmousewheel = document.onmousewheel = document.onkeydown = null;
            }
        }
    };

    return ui.scroll;
})(akbank.ui);


(function (ui) {
    ui.progressbar = {
        show: function () {
            VeriBranch.ShowMask();
        },
        hide: function () {
            VeriBranch.HideMask();
        }
    }
})(akbank.ui);

(function (ui) {
    ui.dialog = {
        defaults: {
            buttons: [],
            width: 'auto',
            height: 'auto',
            modal: true,
            title: '',
            dialogClass: 'akbank-dialog',
            footerClass: 'ui-dialog-footer-center', // ui-dialog-footer-left, ui-dialog-footer-center, ui-dialog-footer-right, ui-dialog-footer-justify
            closeText: '',
            autoOpen: false,
            resizable: false,
            draggable: true,
            hasPadding: true,
            open: function (event, ui) {
                akbank.ui.scroll.disableMouseWheelScrolling(event.target);
            },
            close: function (event, ui) {
                akbank.ui.scroll.enableMouseWheelScrolling(event.target);
            },
            onOpen: false,
            onClose: false
        },
        getOptions: function (params) {
            var self = this;
            var options = $.extend(true, {}, this.defaults, params);

            if (params.open) {
                options.open = function (event, ui) {
                    self.defaults.open(event, ui);
                    params.open.apply(this, [event, ui]);
                }
            }

            if (params.close) {
                options.close = function (event, ui) {
                    self.defaults.close(event, ui);
                    params.close.apply(this, [event, ui]);
                }
            }

            var maxHeight = VeriBranch.CalculateWindowHeight();
            if (typeof (options.height) == 'number' && options.height > 0 && options.height > maxHeight) {
                options.height = maxHeight - 20;
            }

            if (options.dialogClass && options.dialogClass !== this.defaults.dialogClass) {
                options.dialogClass = this.defaults.dialogClass + ' ' + options.dialogClass;
            }

            return options;
        },
        create: function (params) {
            var options = this.getOptions(params),
                contentEl = $(options.content),
                dialog = (contentEl.length ? contentEl : $('<div id="' + options.content.substr(1, options.content.length - 1) + '"></div>').appendTo(document.body)).dialog(options),
                parent = dialog.parent();

            if (options.actionButtons && options.actionButtons.length) {
                var $footer = $('<div class="ui-dialog-footer" unselectable="on"></div>');
                parent.addClass('ui-dialog-has-footer');

                $(options.actionButtons).each(function () {
                    $footer.append(this);
                });

                parent.addClass(options.footerClass).append($footer);
            }

            if (options.hasPadding) {
                parent.addClass('has-padding');
            }

            this.prependBg(parent);
            dialog.dialog('open');
            if (akbank.browser.ie.isIE7() && options.width === 'auto') {
                parent.find('.ui-dialog-footer').width(parent.width());
                parent.find('.ui-dialog-titlebar').width(parent.width());
            }

            return dialog
        },
        populate: function (params) {
            var options = this.getOptions(params),
                contentEl = $(options.content),
                content = contentEl.length ? contentEl : $('<div id="' + options.content.substr(1, options.content.length - 1) + '"></div>').appendTo(document.body),
                footer = content.find('.ui-dialog-footer'),
                title = content.find('.ui-dialog-title');

            if (title.length) {
                options.title = title.html();
            }

            var dialog = content.dialog(options),
                parent = dialog.parent();

            if (footer.length) {
                footer.attr('unselectable', 'on');
                parent.addClass('ui-dialog-has-footer').addClass(options.footerClass).append(footer[0]);
            }

            if (options.hasPadding) {
                parent.addClass('has-padding');
            }

            this.prependBg(parent);

            return dialog.dialog('open');
        },
        prependBg: function (parent) {
            parent.prepend($('<div class="ui-dialog-bg-tl"></div><div class="ui-dialog-bg-t"></div><div class="ui-dialog-bg-tr"></div><div class="ui-dialog-bg-l"></div><div class="ui-dialog-bg-m"></div><div class="ui-dialog-bg-r"></div><div class="ui-dialog-bg-bl"></div><div class="ui-dialog-bg-b"></div><div class="ui-dialog-bg-br"></div>'));
        },
        closeDialog: function (el) {
            $(el).closest('.ui-dialog').children('.ui-dialog-content').dialog('close');
        }
    };

    return ui.dialog;

})(akbank.ui);


(function (ui) {

    ui.button = {
        create: function (options) {
            /*
            options = {
                text: '',
                cssClass: '',
                isRed: false,
                isClose: false,
                width: -1,
                click: function () {},
                onclick: 'xyz();'
            }
            */

            if (options.isRed) {
                options.cssClass = options.cssClass && options.cssClass.length ? 'btn-iwantto-red ' + options.cssClass : 'btn-iwantto-red';
            }

            var sb = [];
            sb.push('<a class="btn-iwantto{0}" href="javascript:void(0)"{1}>'.format(options.cssClass && options.cssClass.length ? ' ' + options.cssClass : '', options.onclick || options.isClose ? " onclick=\"" + (options.onclick && options.onclick.length ? (options.onclick.substr(options.onclick.length - 1, 1) == ';' ? options.onclick : options.onclick + ';') : '') + (options.isClose ? 'akbank.ui.dialog.closeDialog(this);' : '') + "\"" : ''));
            sb.push('<div class="btn-iwantto-text">{0}</div>'.format(options.text));
            sb.push('<div class="btn-iwantto-bg-north-west"></div><div class="btn-iwantto-bg-repeat-west"></div><div class="btn-iwantto-bg-south-west"></div>');
            sb.push('<div class="btn-iwantto-bg-north-east"></div><div class="btn-iwantto-bg-repeat-east"></div><div class="btn-iwantto-bg-south-east"></div>');
            sb.push('</a>');

            var $button = $(sb.join(''));

            if (options.click) {
                $button.unbind().bind('click', options.click);
            }

            return $('<span class="btn-wrapper"></span>').append($button);
        }
    }

    return ui.button;

})(akbank.ui);


(function (ui) {
    ui.datalist = {
        create: function (options) {

            if (!(options && options.data && options.data.length > 0)) {
                return;
            }

            var $ul = $('<ul></ul>');

            if (options.cssClass) { $ul.addClass(options.cssClass); }

            $.each(options.data, function (i, val) {
                var $li = $('<li></li>');
                if (val.itemCssClass) { $li.addClass(val.itemCssClass); }
                if (i == 0) { $li.addClass('first'); }
                if (i == options.data.length - 1 && i > 1) { $li.addClass('last'); }
                if (!!options.itemClick == true) { $li.click(function (e) { options.itemClick.apply(this, [val]); }); }
                if (!!options.itemAttr == true) { options.itemAttr(val, $li); }
                if (!!options.getItemContent == true) { $li.html(options.getItemContent(val)); }
                $ul.append($li);
            });

            if (options.renderTo) {
                $ul.appendTo(options.renderTo);
            }

            return $ul;
        }
    }

    return ui.datalist;
})(akbank.ui);


(function (ui) {

    ui.tabs = {
        create: function (tabs, renderTo) {

            var items = [];

            var $ul = ui.datalist.create({
                cssClass: 'tabs',
                renderTo: renderTo,
                itemClick: function (tab) {
                    if (tab.contentWrapper) {
                        tab.contentWrapper.find('.data-content').hide();
                        $('#' + tab.dataContent).show();
                    }
                    renderTo.find('li').removeClass('active');
                    $(this).addClass('active');
                },
                itemAttr: function (item, $li) { $li.attr({ "data-content": item.dataContent }) },
                getItemContent: function (item) { return "<a>" + item.title + "</a>" },
                data: tabs
            });

            $.each(tabs, function () {
                if (this.renderContent) { this.renderContent(this); }
            });

            return $ul;
        }
    }

    return ui.tabs;

})(akbank.ui);

(function (ui) {
    ui.message = {
        showWarning: function (msg) {

            var $warningContent = $('<div class="warning-dialog"></div>');

            if (typeof (msg) === 'string') { $warningContent.html(msg) }

            ui.dialog.create({
                content: $warningContent[0],
                //title: ui.resources.dialog.title.warning,
                hasPadding: false,
                width: 330,
                actionButtons: [ // Footer butonları
                    akbank.ui.button.create({
                        text: ui.resources.button.close,
                        isClose: true // Bu buton popup ı kapatacak buton
                    })
                ]
            }).dialog('open');
        },
        showError: function (msg) {

            var $errorContent = $('<div class="error-dialog"></div>');

            if (typeof (msg) === 'string') { $errorContent.html(msg) }

            ui.dialog.create({
                content: $errorContent[0],
                //title: ui.resources.dialog.title.error,
                hasPadding: false,
                width: 505,
                actionButtons: [ // Footer butonları
                    akbank.ui.button.create({
                        text: ui.resources.button.close,
                        isClose: true // Bu buton popup ı kapatacak buton
                    })
                ]
            }).dialog('open');
        },
        showSessionError: function (msg) {
            window.parent.AKB.Popup.open({
                headline: "",
                hideCloseButton: true,
                type: AKB.Popup.TYPE_REGULAR,
                blockBackground: false,
                showFullScreen: false,
                disableDrag: false,
                blockFullScreen: true,
                centerPopup: true,
                text: msg,
                buttons: '&nbsp;<a class="akb_button_tr ok mr5">ok</a>'
            });

            var popupObj;

            if (parent.window != 'undefined' && parent.window.AKB != 'undefined' && parent.window.AKB.Popup != 'undefined')
                popupObj = parent.window.AKB.Popup;

            popupObj.$popup.find('a.ok').bind('click', function () {
                popupObj.close();
                parent.CloseWindowAndOpenThankPage();
            });
        }
    }

    return ui.message;
})(akbank.ui);

(function (ui) {

    akbank.ui.size = {
        calculate: function (fontSize, content) {
            var $dummy = $('<div style="font-size:{0}px;display:inline-block"></div>'.format(fontSize)).appendTo(document.body);
            $dummy.html(content);
            var w = $dummy.width();
            var h = $dummy.height();
            $dummy.remove();
            return { height: h, width: w }
        }
    }

    return akbank.ui.size;

})(akbank.ui);

(function (ui) {
    var timeoutDuration = 500;
    var template = '<ul class="iwantto-vertical">' +
                    '<li class="btn-iwantto-has-menu">' +
                        '<a  class="btn-iwantto" href="javascript:void(0)" onclick="return false;">' +
                            '<div class="btn-iwantto-text clearfix"><span class="text">Text</span><span class="arrow"></span></div>' +
                            '<div class="btn-iwantto-bg-north-west"></div>' +
                            '<div class="btn-iwantto-bg-repeat-west"></div>' +
                            '<div class="btn-iwantto-bg-south-west"></div>' +
                            '<div class="btn-iwantto-bg-north-east"></div>' +
                            '<div class="btn-iwantto-bg-repeat-east"></div>' +
                            '<div class="btn-iwantto-bg-south-east"></div>' +
                        '</a>' +
                        '<div class="btn-iwantto-menu">' +
                            '<ol class="btn-iwantto-menu-list">' +
                            '</ol>' +
                            '<div class="btn-iwantto-menu-bottom"></div>' +
                        '</div>' +
                    '</li>' +
                  '</ul>';

    ui.dropdown = {
        create: function (items, renderTo) {
            var $renderTo = akbank.tojQueryObj(renderTo);
            $renderTo.html(template);
            var dropdown = $renderTo.find('.iwantto-vertical')[0],
                $window = $(window),
                $iframeScroll = $('#iframe-scroll'),
                isMobile = $(document.body).hasClass('is-mobile'),
                $akbContent = $('#akb_content');

            dropdown.button = $('.btn-iwantto', dropdown);
            dropdown.menu = $(".btn-iwantto-menu", dropdown);
            dropdown.toggle = function () {
                if (this.timeout) { clearTimeout(this.timeout); }

                if (this.menu.parent()[0] !== document.body) {
                    this.menu.appendTo(document.body);
                }

                var buttonOffset = this.button.offset(),
                    buttonHeight = this.button.height(),
                    menuHeight = this.menu.height(),
                    scrollTop = isMobile ? 0 : $window.scrollTop(),
                    x = buttonOffset.left - 10,
                    y = buttonOffset.top + buttonHeight;

                if (buttonOffset.top - scrollTop + buttonHeight + menuHeight > $window.innerHeight()) {
                    y = buttonOffset.top - menuHeight + 5;
                }

                this.menu.css({ top: y, left: x }).show();
            };
            dropdown.collapse = function (duration) {
                var self = this;
                if (typeof (duration) === 'undefined') {
                    duration = timeoutDuration;
                }
                var self = this;
                this.timeout = setTimeout(function () { self.menu.hide(); }, duration);
            };
            dropdown.timeout = null;

            var menulist = dropdown.menu.find(".btn-iwantto-menu-list");

            $(items).each(function () {
                if (this.selected === true) {
                    dropdown.button.find('.text').text(this.text);
                }

                menulist.append('<li><a href="javascript:void(0)" data-class="{1}">{0}</a></li>'.format(this.text, this.value));
            });

            $(".btn-iwantto-menu a", dropdown).click(function (e) {
                dropdown.collapse(1);
                dropdown.button.find('.text').html($(this).text());
                dropdown.selectedValue = $(this).attr('data-class');

                if (dropdown.select) {
                    dropdown.select.apply(this, [$(this).attr('data-class')])
                }
            });

            dropdown.button.unbind('mouseover').bind('mouseover', function (e) {
                e.preventDefault();
                dropdown.toggle();
            });

            dropdown.button.unbind('mouseout').bind('mouseout', function (e) {
                e.preventDefault();
                dropdown.collapse();
            });

            dropdown.menu.unbind('mouseover').bind('mouseover', function (e) {
                e.preventDefault();
                dropdown.toggle();
            });

            dropdown.menu.unbind('mouseout').bind('mouseout', function (e) {
                e.preventDefault();
                dropdown.collapse();
            });

            return dropdown;
        }
    };

    return ui.dropdown;
})(akbank.ui);

(function (ui) {
    ui.layout = {
        simpleLayout: {
            create: function (pairs, cssClass) {
                var sb = [];
                sb.push("<table>");

                $(pairs).each(function () {
                    sb.push("<tr>");
                    sb.push("<td class='l'>");
                    sb.push(this.name);
                    sb.push("</td>");
                    sb.push("<td class='r'>");
                    sb.push(this.value);
                    sb.push("</td>");
                    sb.push("</tr>");
                });

                sb.push("</table>");

                var $table = $(sb.join(""))
                if (cssClass) {
                    $table.addClass(cssClass);
                }
                return $table;
            }
        }
    }

    return ui.layout;
})(akbank.ui);

(function ($) {

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *     the user visible viewport of a web browser.
     *     only accounts for vertical position, not horizontal.
     */

    $.fn.visible = function (partial) {

        var $t = $(this),
            $w = $(window),
            viewTop = $w.scrollTop(),
            viewBottom = viewTop + $w.height(),
            _top = $t.offset().top,
            _bottom = _top + $t.outerHeight(),
            compareTop = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;

        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };

})(jQuery);

(function ($) {

    $.fn.centralize = function (animate, noMouseWheel, topGap) {
        var $t = $(this),
            $w = $(window),
            $wh = $w.height(),
            viewTop = $w.scrollTop(),
            viewBottom = viewTop + $wh,
            _top = $t.offset().top,
            _height = $t.outerHeight(),
            _bottom = _top + _height,
            fnMouseWheel = function (e) {
                e.preventDefault();
                return false;
            };

        if (noMouseWheel) {
            $(window).unbind('mousewheel').bind('mousewheel', fnMouseWheel);
        }

        _height = _height + 20;

        if (_height < $wh) {
            if (animate) {
                $('html, body').stop(true).animate({ scrollTop: (_top - +(($wh - _height) / 2) + 20 - topGap) }, 400, function () {
                    if (noMouseWheel) {
                        $(window).unbind('mousewheel');
                    }
                });
            }
            else {
                $('html, body').stop(true).scrollTop(_top - +(($wh - _height) / 2) + 20 - topGap);
            }
        }
        else {
            if (animate) {
                $('html, body').stop(true).animate({ scrollTop: (_top + 20 - topGap) }, 400, function () {
                    if (noMouseWheel) {
                        $(window).unbind('mousewheel');
                    }
                });
            }
            else {
                $('html, body').stop(true).scrollTop(_top + 20 - topGap);
            }
        }
    };

})(jQuery);
