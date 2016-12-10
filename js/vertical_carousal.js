/**
 * Created by a7268 on 2016/12/6.
 */

/* ========================================================================
 * Bootstrap: vertical_carousel.js v1.0.0
 * ========================================================================
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
    'use strict';

    // VERTICAL_CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
        this.$element = $(element);
        this.$indicators = this.$element.find('.vertical-carousel-indicators');
        this.$box = this.$element.find(".vertical-carousel-box");
        this.options = options;
        this.sliding = null;
        this.$items = null;

        this.options.mousewheel && $(this.options.wheelTarget)
            .on('mousewheel.bs.vertical_carousel', $.proxy(this.mousewheel, this));
    };

    Carousel.VERSION = "1.0.0";

    Carousel.TRANSITION_DURATION = 600;

    Carousel.DEFAULTS = {
        mousewheel: true,
        wheelTarget: document
    };

    Carousel.prototype.mousewheel = function (e) {
        if (this.sliding) {
            return;
        }
        var activeIndex = this.getItemIndex(this.$element.find('.item.active'));

        switch (e.originalEvent.wheelDelta > 0) {
            case true:
                this.to(activeIndex - 1);
                break;
            case false:
                this.to(activeIndex + 1);
                break;
            default:
                return
        }
        e.preventDefault()
    };

    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item');
        return this.$items.index(item)
    };

    Carousel.prototype.to = function (pos) {
        var that = this;

        if (!this.$items) {
            this.$items = this.$box.children('.item');
        }

        if (pos > (this.$items.length - 1) || pos < 0) {
            return;
        }

        // if (this.sliding) {
        //     return this.$element.one('slid.bs.verticalCarousel', function () {
        //         that.to(pos)
        //     }); // yes, "slid"
        // }

        return this.slide(pos, this.$items.eq(pos))
    };

    Carousel.prototype.next = function () {
        if (this.sliding) {
            return;
        }
        return this.to(this.getItemIndex(this.$element.find('.item.active')) + 1);
    };

    Carousel.prototype.prev = function () {
        if (this.sliding) {
            return;
        }
        return this.to(this.getItemIndex(this.$element.find('.item.active')) - 1);
    };

    Carousel.prototype.slide = function (pos, next) {
        var $active = this.$element.find('.item.active');
        var $next = next;
        var that = this;

        if ($next.hasClass('active')) return (this.sliding = false);

        var relatedTarget = $next[0];
        var slideEvent = $.Event('slide.bs.verticalCarousel', {
            relatedTarget: relatedTarget,
            pos: pos
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) {
            return;
        }

        this.sliding = true;

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active');
            var $nextIndicator = $(this.$indicators.children()[pos]);
            $nextIndicator && $nextIndicator.addClass('active')
        }

        if (this.options["restsIndicators"]) {
            $(this.options["restsIndicators"] + ".active").removeClass("active");
            $($(this.options["restsIndicators"])[pos]).addClass("active");
        }//外部指示器

        var slidEvent = $.Event('slid.bs.verticalCarousel', {
            relatedTarget: relatedTarget,
            pos: pos
        }); // yes, "slid"
        this.$box.css({
            transform: "translateY(-" + this.$element.attr("data-item-height") * pos + "px)"
        });
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass("active");
            $active
                .one('bsTransitionEnd', function () {
                    $active.removeClass('active');
                    that.sliding = false;
                    location.hash = "#" + $next.prop("id");
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0)
                })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION);
        } else {
            $active.removeClass('active');
            $next.addClass('active');
            this.sliding = false;
            location.hash = "#" + $next.prop("id");
            this.$element.trigger(slidEvent)
        }

        return this
    };

    // VERTICAL_CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.vertical_carousel');
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option);
            var action = typeof option == 'string' ? option : options.slide;

            if (!data) $this.data('bs.vertical_carousel', (data = new Carousel(this, options)));
            if (typeof option == 'number') data.to(option);
            else if (action) data[action]();
        })
    }

    var old = $.fn.vertical_carousel;

    $.fn.vertical_carousel = Plugin;
    $.fn.vertical_carousel.Constructor = Carousel;


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.vertical_carousel.noConflict = function () {
        $.fn.vertical_carousel = old;
        return this
    };

    // VERTICAL_CAROUSEL DATA-API
    // =================

    var clickHandler = function (e) {
        var href;
        var $this = $(this);
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
        if (!$target.hasClass('vertical-carousel')) return;
        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr('data-slide-to');

        Plugin.call($target, options);

        if (slideIndex) {
            $target.data('bs.vertical_carousel').to(slideIndex)
        }

        e.preventDefault()
    };

    $(document)
        .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);


    $(window).on('load', function () {
        $('.vertical-carousel').each(function () {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        })
    })

}(jQuery);