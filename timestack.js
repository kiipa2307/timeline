(function () {
    (function (jQuery) {
        var $; $ = jQuery; return $.fn.extend({
            timestack: function (options) {
                var between, defaults, findEnds, parseDom, useData; defaults = {
                    click: function () {
                    },
                    parse: function (s) {
                        return moment(s)
                    },
                    renderDates: function (item) {
                        var dateFormat, endFormated, startFormated; dateFormat = this.dateFormats[options.span]; startFormated = item.start.format(dateFormat);
                        endFormated = item.tilNow ? "": item.end.format(dateFormat);
                        return this.formatRange(startFormated, endFormated)
                    },
                    formatRange: function (startStr, endStr) {
                        return "" + startStr + " - " + endStr
                    },
                    span: "year", dateFormats: {
                        year: "MMM YYYY", month: "MMM YYYY", day: "MMM DD", hour: "h:mm a"
                    },
                    intervalFormats: {
                        year: "YYYY", month: "DD MMM YYYY", day: "MMM DD", hour: "h:mm a"
                    }
                };
                options = $.extend(defaults, options);
                if (!([ "year", "month", "day", "hour"].indexOf(options.span) > -1)) {
                    throw "" + options.span + " is not a valid span option"
                }
                parseDom = function ($obj) {
                    var $ul; $ul = $obj.children("ul:not(.timestack-events)");
                    if ($ul.length === 0) {
                        return[]
                    }
                    return[$ul, $ul.children("li").map(function () {
                        var $li, i; $li = $(this);
                        return i = {
                            start: $li.attr("data-start"), end: $li.attr("data-end"), title: $li.contents().filter(function () {
                                return this.nodeType === 3
                            }).remove().text(), color: $li.attr("data-color"), li: $li, content: $li.children().remove()
                        }
                    })]
                };
                useData = function ($obj, items) {
                    var $ul; $obj.empty();
                    $ul = $("<ul></ul>");
                    $obj.append($ul);
                    return[$ul, items]
                };
                findEnds = function (items) {
                    var earliest, i, latest, _i, _len; earliest = null; latest = null; for (_i = 0, _len = items.length; _i < _len; _i++) {
                        i = items[_i]; i.start = options.parse(i.start);
                        i.tilNow = i.end == null; i.end = i.tilNow ? moment(): options.parse(i.end);
                        if (!(i.start <= i.end)) {
                            throw "Start times must be before end times"
                        }
                        if (!(earliest && earliest < i.start)) {
                            earliest = i.start.clone()
                        }
                        if (!(latest && latest > i.end)) {
                            latest = i.end.clone()
                        }
                    }
                    return[earliest, latest]
                };
                between = function (start, end) {
                    var index, results; results =[]; index = start.clone().startOf(options.span);
                    while (index < end) {
                        results.push(index.clone());
                        index.add(options.span + "s", 1)
                    }
                    return results
                };
                return this.each(function () {
                    var $intervals, $li, $obj, $ul, date, dates, diff, earliest, format, i, items, labelspan, latest, offset, timespan, titlespan, width, _i, _j, _len, _len1, _ref, _ref1, _ref2; $obj = $(this);
                    if (options.data) {
                        _ref = useData($obj, options.data), $ul = _ref[0], items = _ref[1]
                    } else {
                        _ref1 = parseDom($obj), $ul = _ref1[0], items = _ref1[1]
                    }
                    if (items.length === 0) {
                        return
                    }
                    if (! $ul) {
                        throw "Timestack requires either a data object or a UL for progressive enhancement."
                    }
                    $ul.css("width", options.width).addClass("timestack-events");
                    _ref2 = findEnds(items), earliest = _ref2[0], latest = _ref2[1]; earliest.startOf(options.span);
                    if (latest.valueOf() !== latest.clone().startOf(options.span).valueOf()) {
                        latest.endOf(options.span)
                    }
                    diff = latest - earliest; for (_i = 0, _len = items.length; _i < _len; _i++) {
                        i = items[_i]; $li = i.li; if (! $li) {
                            $li = $("<li></li>");
                            $ul.append($li)
                        }
                        i.timeDisplay = options.renderDates(i);
                        timespan = $("<em>(" + i.timeDisplay + ")</em>").addClass("timestack-time");
                        titlespan = $("<span>" + i.title + " </span>").addClass("timestack-title");
                        labelspan = $("<span></span>").addClass("timestack-label").append(titlespan).append(timespan);
                        width =((i.end - i.start) / diff * 100 -.01).toFixed(3);
                        offset =((i.start - earliest) / diff * 100 -.01).toFixed(3);
                        $li.prepend(labelspan).css("margin-left", "" + offset + "%").css("width", "" + width + "%").click(function (i) {
                            return function () {
                                return options.click(i)
                            }
                        }
                        (i));
                        if (i.color) {
                            $li.css("background-color", i.color)
                        }
                        if (options.click) {
                            $li.css("cursor", "pointer")
                        }
                        if (i[ "class"] != null) {
                            $li.addClass(i[ "class"])
                        }
                    }
                    dates = between(earliest, latest);
                    width =(100 / dates.length -.01).toFixed(3) + "%"; format = options.intervalFormats[options.span]; $intervals = $("<ul></ul>").addClass("intervals");
                    for (_j = 0, _len1 = dates.length; _j < _len1; _j++) {
                        date = dates[_j]; $("<li></li>").text(date.format(format)).css("width", width).appendTo($intervals)
                    }
                    return $obj.append($intervals)
                })
            }
        })
    })(jQuery)
}).call(this);
