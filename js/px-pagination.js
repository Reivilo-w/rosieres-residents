(function ($) {
    $.fn.pxpaginate = function (_options, _callback) {
        var _self = $(this);
        var _op = _options;

        var defaults = {
            currentpage: 1,
            totalPageCount: 10,
            maxBtnCount: 5,

            align: 'center',

            nextPrevBtnShow: true,
            firstLastBtnShow: true,

            prevPageName: '<',
            nextPageName: '>',
            lastPageName: '<<',
            firstPageName: '>>',

            callback: null
        }

        if (_op !== undefined && _op != null)
            _op = $.extend(defaults, _op);
        else
            _op = defaults;

        if (_callback !== undefined)
            _op.callback = _callback;

        if (_op.maxBtnCount <= 0) {
            _op.maxBtnCount = 5;
        }
        if ("left|center|right".indexOf(_op.align) == -1) {
            console.error("aling error -> current = " + _op.align + " , [left, center, right]");
            _op.align = "left";
        }

        _op.currentpage = Math.ceil(_op.currentpage);
        _op.maxBtnCount = Math.ceil(_op.maxBtnCount);
        _op.totalPageCount = Math.ceil(_op.totalPageCount);

        _self.attr("data-total", _op.totalPageCount).attr("data-max", _op.maxBtnCount);

        _self.addClass("px-paginate-container").addClass("px-" + _op.align);
        _self.html('');

        if (_op.totalPageCount > _op.maxBtnCount) {
            _self.append('<span class="px-points d-none" data-point="0">...</span>');
        }

        for (let i = 0; i < (_op.totalPageCount > _op.maxBtnCount ? _op.maxBtnCount : _op.totalPageCount); i++) {
            _self.append(__templaterow(0, (i + 1), " px-btn-page px-btn-" + i));
        }


        if (_op.totalPageCount > _op.maxBtnCount) {
            _self.append('<span class="px-points d-none" data-point="1">...</span>');
            _self.append(__templaterow(_op.totalPageCount, _op.totalPageCount, " px-btn-page"));
        }

        if (_op.nextPrevBtnShow) {
            _self.prepend(__templaterow(0, _op.prevPageName, "px-btn-prev"));
            _self.append(__templaterow(0, _op.nextPageName, "px-btn-next"));
        }

        if (_op.firstLastBtnShow) {
            _self.prepend(__templaterow(1, _op.lastPageName, "px-btn-last"));
            _self.append(__templaterow(_op.totalPageCount, _op.firstPageName, "px-btn-first"));
        }

        __calcpagenumber(_op.currentpage, true);

        $("body").on("click", ".px-btn[data-page]", function () {
            __calcpagenumber($(this).attr("data-page"), false);
        });

        function __templaterow(_pageno, _pagetext, _class = "") {
            return '<span class="px-btn' + (_class != '' ? ' ' + _class : '') + '" data-page="' + _pageno + '">' + _pagetext + '</span>';
        }
        function __calcpagenumber(currentpage, isfirst) {

            if ($(".px-btn.selected").attr("data-page") == currentpage) {
                return;
            }

            let start = 0;

            if (_op.totalPageCount <= _op.maxBtnCount) {
                start = 0;
                for (let i = 0; i < _op.totalPageCount; i++) {
                    start++;
                    $(".px-btn-page.px-btn-" + i, _self).attr("data-page", start).html(start);
                }

            } else {
                let prev = parseInt(currentpage) - 1;
                let next = parseInt(currentpage) + 1;

                if (prev < 1) prev = 1;
                if (next > _op.totalPageCount) next = _op.totalPageCount;

                if (_op.nextPrevBtnShow) {
                    $(".px-btn-prev", _self).attr("data-page", prev);
                    $(".px-btn-next", _self).attr("data-page", next);
                }

                let _blockchange = ($(".px-btn-page[data-page='" + prev + "']", _self).length == 0 || $(".px-btn-page[data-page='" + next + "']", _self).length == 0);
                if (_blockchange) {
                    let lastpagenm = (_op.totalPageCount - 1);
                    start = prev - Math.round(_op.maxBtnCount / 2);

                    if (start < 0) {
                        start = 0;
                    }
                    if ((start + _op.maxBtnCount) > lastpagenm) {
                        start = (_op.totalPageCount - 1) - _op.maxBtnCount;
                    }

                    for (let i = 0; i < _op.maxBtnCount; i++) {
                        start++;
                        $(".px-btn-page.px-btn-" + i, _self).attr("data-page", start).html(start);
                    }

                    let blockfirst = parseInt($(".px-btn-page.px-btn-0", _self).attr("data-page"));
                    let blocklast = parseInt($(".px-btn-page.px-btn-" + (_op.maxBtnCount - 1), _self).attr("data-page"));

                    let pointzero = ".px-points[data-point='0']";
                    let pointone = ".px-points[data-point='1']";

                    if (blockfirst == 1) {
                        if (!$(pointzero, _self).hasClass("d-none"))
                            $(pointzero, _self).addClass("d-none");
                    } else {
                        if ($(pointzero, _self).hasClass("d-none"))
                            $(pointzero, _self).removeClass("d-none");
                    }

                    if (blocklast == lastpagenm) {
                        if (!$(pointone, _self).hasClass("d-none"))
                            $(pointone, _self).addClass("d-none");
                    } else {
                        if ($(pointone, _self).hasClass("d-none"))
                            $(pointone, _self).removeClass("d-none");
                    }
                }
            }

            $(".selected", _self).removeClass("selected");
            $(".px-btn-page[data-page=" + currentpage + "]").addClass("selected");

            if (!isfirst && _op.callback != undefined && _op.callback != null) {
                if (_op.callback.length > 0) {
                    _op.callback(currentpage);
                } else {
                    _op.callback();
                }
            }
        }
    }
})(jQuery);
