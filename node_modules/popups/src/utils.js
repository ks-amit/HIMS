    /**
     * context binding
     * @param   {Function}  ctx     context
     * @param   {Function}  fn      function
     */
    function _bind(ctx, fn) {
        var args = [].slice.call(arguments, 2);
        return  fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function () {
            return fn.apply(ctx, args.concat([].slice.call(arguments)));
        };
    }
    /**
     * Object iterator
     *
     * @param  {Object|Array}  obj
     * @param  {Function}      iterator
     */
    function _each(obj, iterator) {
        if (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator(obj[key], key, obj);
                }
            }
        }
    }
    /**
     * Copy all of the properties in the source objects over to the destination object
     *
     * @param   {...Object}     out
     *
     * @return  {Object}
     */
    function _extend(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    }
    /**
     * Bind events to elements
     *
     * @param  {HTMLElement}    el
     * @param  {Event}          event
     * @param  {Function}       fn
     */
    function _on(el, event, fn) {
        if (typeof el.addEventListener === "function") {
            el.addEventListener(event, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + event, fn);
        }
    }
    /**
     * Unbind events from element
     *
     * @param  {HTMLElement}    el
     * @param  {Event}          event
     * @param  {Function}       fn
     */
    function _off(el, event, fn) {
        if (typeof el.removeEventListener === "function") {
            el.removeEventListener(event, fn, false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + event, fn);
        }
    }
