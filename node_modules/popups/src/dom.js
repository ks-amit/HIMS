    /**
     * Selector RegExp
     *
     * @const   {RegExp}
     */
    // orig: /^(\w+)?(#\w+)?((?:\.[\w_-]+)*)/i;
    var R_SELECTOR = /^(\w+)?(#[\w_-]+)?((?:\.[\w_-]+)*)/i;

    /**
     * build DOM Nodes
     *
     * @example
     *  _buildDOM({
     *      tag:'div#id.class.class2',
     *      css:{
     *          opacity:'1',
     *          width:'100px'
     *      },
     *      text:'test',
     *      html:'<p>Hello</p>',
     *      children:[{
     *          tag:'div#id_child.class.class2',
     *          css:{opacity:'1', height:'200px'},
     *          text:'test',
     *          html:'<p>World</p>'
     *      }]
     *  });
     *
     * @param   {String|Object} spec
     *
     * @return  {HTMLElement}
     */
    function _buildDOM(spec) {
        // Spec Defaults
        if (spec === null) {
            spec = 'div';
        }
        if (typeof spec === 'string') {
            spec = {
                tag: spec
            };
        }
        var el, classSelector;
        var fragment = document.createDocumentFragment();
        var children = spec.children;
        var selector = R_SELECTOR.exec(spec.tag || '');

        delete spec.children;

        spec.tag = selector[1] || 'div';
        spec.id = spec.id || (selector[2] || '').substr(1);
        // split ClassNames
        classSelector = (selector[3] || '').split('.');
        classSelector[0] = (spec.className || '');
        spec.className = classSelector.join(' ');


        el = document.createElement(spec.tag);
        _appendChild(fragment, el);
        delete spec.tag;

        // For every
        // key => spec[key];
        _each(spec, function(value, key) {
            if (key === 'css') {
                _css(el, spec.css);
            } else if (key === 'text') {
                (value !== null) && _appendChild(el, document.createTextNode(value));
            } else if (key === 'html') {
                (value !== null) && (el.innerHTML = value);
            } else if (key in el) {
                try {
                    el[key] = value;
                } catch (e) {
                    el.setAttribute(key, value);
                }
            } else if (/^data-/.test(key)) {
                el.setAttribute(key, value);
            }
        });
        // if the children is already an HTML Element, append it to el
        if (children && children.appendChild) {
            _appendChild(el, children);
        } else if (children) {
            if (children instanceof Array) {
                _each(children, function(value, key) {
                    if(value instanceof Object) {
                        _appendChild(el, _buildDOM(value));
                    }
                });
            } else if (children instanceof Object) {
                _appendChild(el, _buildDOM(children));
            }
        }
        return el;
    }
    /**
     * appendChild
     *
     * @param   {HTMLElement}   parent
     * @param   {HTMLElement}   el
     */
    function _appendChild(parent, el) {
        try {
            parent && el && parent.appendChild(el);
        } catch (e) {}
    }
    /**
     * Focus First Item in Parent Node
     * submit > text,password > button
     *
     * @param  {HTMLElement}    parentNode
     */
    function _autoFocus(parentNode) {
        var items = _getElementsByTagName(parentNode, 'input');
        var i = 0;
        var n = items.length;
        var el, element;

        for (; i < n; i++) {
            el = items[i];

            if (el.type === 'submit') {
                !element && (element = el);
            } else if (!/hidden|check|radio/.test(el.type) && el.value === '') {
                element = el;
                break;
            }
        }

        if (!element) {
            element = _getElementsByTagName(parentNode, 'button')[0];
        }

        try {
            element.focus();
        } catch (err) {}
    }
    /**
     * get Elements with Tag () from Parent
     *
     * @param   {HTMLElement}  el
     * @param   {String}       name
     *
     * @return  {NodeList}
     */
    function _getElementsByTagName(el, name) {
        return el.getElementsByTagName(name);
    }
    /**
     * remove Element from Parent
     *
     * @param   {HTMLElement}   el
     */
    function _removeElement(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
