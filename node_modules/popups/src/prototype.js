    module.exports = {
        constructor: PopupS,

        _open: function(options) {
            //error catching
            if (typeof options.mode !== "string") throw new Error("mode must be a string");
            if (typeof options.title !== "undefined" && typeof options.title !== "string") throw new Error("title must be a string");
            if (typeof options.placeholder !== "undefined" && typeof options.placeholder !== "string") throw new Error("placeholder must be a string");

            this.options = options = _extend({}, options);

            // Set default options
            for (var name in _defaults) {
                !(name in options) && (options[name] = _defaults[name]);
            }

            // trail all classes divided by periods
            _each(['additionalBaseClass', 'additionalButtonHolderClass', 'additionalButtonOkClass', 'additionalButtonCancelClass', 'additionalCloseBtnClass', 'additionalFormClass', 'additionalOverlayClass', 'additionalPopupClass'], function(option) {
                var string = options[option].split(' ').join('.');
                options[option] = '.' + string;
            });

            // Bind all private methods
            for (var fn in this) {
                if (fn.charAt(0) === '_') {
                    this[fn] = _bind(this, this[fn]);
                }
            }

            //initialize if it hasn't already been done
            this._init();

            // if it is forced, close all others
            if(options.force === true) {
                while (queue.length > 0) queue.pop();
            }
            queue.push(options);

            if(!isOpen || options.force === true) this._create();
        },
        _init: function() {
            // if i passed a opacity attribute to the layer onClose, remove it on initialization
            if(this.$layerEl && this.$layerEl.style.opacity) this.$layerEl.style.opacity = "";
            if(!this.$wrapEl){
                this.$wrapEl = _buildDOM({
                    tag: 'div.' + this.options.baseClassName + '-base' + (this.options.additionalBaseClass ? this.options.additionalBaseClass : ''),
                    css: {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: 'fixed',
                        textAlign: 'center',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        outline: 0,
                        whiteSpace: 'nowrap',
                        zIndex: this.options.zIndex
                    },
                    children: {
                        css: {
                            height: '100%',
                            display: 'inline-block',
                            verticalAlign: 'middle'
                        }
                    }
                });
                _appendChild(this.$wrapEl, this._getOverlay());
                _appendChild(this.$wrapEl, this._getLayer());
            }
        },
        _getOverlay: function () {
            if (!this.$overlayEl) {
                this.$overlayEl = _buildDOM({
                    tag: '#popupS-overlay.' + this.options.baseClassName + '-overlay' + (this.options.additionalOverlayClass ? this.options.additionalOverlayClass : ''),
                    css: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        position: 'fixed',
                        overflowX: 'hidden',
                        userSelect: 'none',
                        webkitUserSelect: 'none',
                        MozUserSelect: 'none'
                    }
                });
            }
            this.$overlayEl.setAttribute("unselectable", "on");
            return this.$overlayEl;
        },
        _getLayer: function () {
            if(!this.$layerEl){
                this.$layerEl = _buildDOM({
                    css: {
                        display: 'inline-block',
                        position: 'relative',
                        textAlign: 'left',
                        whiteSpace: 'normal',
                        verticalAlign: 'middle',
                        maxWidth: '100%',
                        overflowX: 'hidden',
                        transform: 'translate3d(0,0,0)'
                    },
                    children: {
                        tag: '.' + this.options.baseClassName + '-layer' + (this.options.additionalPopupClass ? this.options.additionalPopupClass : '')
                    }
                });
            }
            return this.$layerEl;
        },
        _resetLayer: function(){
            this.$layerEl.childNodes[0].innerHTML = '';
        },
        /**
         * Takes the first item from the queue
         * creates or overwrites the Overlay and adds Events.
         */
        _create: function () {
            var self = this;
            var item = queue[0];
            var mode = item.mode;
            isOpen = true;
            // Creates the Popup. Overwrites the old one if one exists.
            if (mode != 'modal-ajax') {
                this._createPopup(item);
            } else {
                this._loadContents(item);
            }
            // this is very important for the callback function.
            // these lines make sure callbacks on the same function object will be displayed.
            var transitionDone = function(event) {
                event.stopPropagation();
                _unbind(self.$layerEl, transition.type, transitionDone);
            };
            if(transition.supported){
                _bind(self.$layerEl, transition.type, transitionDone);
            }
        },
        _createPopup: function(item) {
            var btnOk, btnCancel, htmlObj;
            var mode        = item.mode;
            var title       = item.title;
            var content     = item.content;
            var className   = (item.className ? '.' + item.className : '');
            var contentObj  = ((content instanceof Object) ? true : false);

            this.callbacks = {
                onOpen: item.onOpen,
                onSubmit: item.onSubmit,
                onClose: item.onClose
            };

            btnOk = {
                tag:  'button#popupS-button-ok.' + this.options.baseClassName + '-button-ok' + (this.options.additionalButtonOkClass ? this.options.additionalButtonOkClass : ''),
                text: this.options.labelOk };
            btnCancel = {
                tag:  'button#popupS-button-cancel.' + this.options.baseClassName + '-button-ok' + (this.options.additionalButtonCancelClass ? this.options.additionalButtonCancelClass : ''),
                text: this.options.labelCancel };

            htmlObj = [
                { html: content },
                mode != 'modal' && mode != 'modal-ajax' && mode == 'prompt' && {
                    tag: 'form.' + this.options.baseClassName + '-form' + (this.options.additionalFormClass ? this.options.additionalFormClass : ''),
                    children: [
                        item.placeholder && { tag:     'label',
                          htmlFor: 'popupS-input',
                          text:    item.placeholder },
                        { tag:  'input#popupS-input',
                          type: 'text' }
                    ]
                },
                mode != 'modal' && mode != 'modal-ajax' && { tag: 'nav.' + this.options.baseClassName + '-buttons' + (this.options.additionalButtonHolderClass ? this.options.additionalButtonHolderClass : ''),
                  children:
                    (
                        (mode == 'prompt' || mode == 'confirm')
                            ? (!this.options.flagButtonReverse ? [btnCancel, btnOk] : [btnOk, btnCancel] )
                            : [btnOk]
                    )
                }
            ];

            content = _buildDOM({
                children:[
                    { tag: 'a#popupS-resetFocusBack.' + this.options.baseClassName + '-resetFocus',
                      href:'#',
                      text:'Reset Focus' },
                    (this.options.flagShowCloseBtn && {
                        tag: 'span#popupS-close.' + this.options.baseClassName + '-close' + (this.options.additionalCloseBtnClass ? this.options.additionalCloseBtnClass : ''),
                        html: this.options.closeBtn
                    }),
                    (title && {
                        tag:  'h5.' + this.options.baseClassName + '-title' + className,
                        text: title }),
                    { tag:      '.' + this.options.baseClassName + '-content' + className,
                      children: (contentObj && content || htmlObj) },
                    { tag:'a#popupS-resetFocus.' + this.options.baseClassName + '-resetFocus',
                      href:'#',
                      text:'Reset Focus'}
                ]
            });

            this._resetLayer();
            _appendChild(this.$layerEl.childNodes[0], content);
            this._appendPopup();
            this.$contentEl = this.$layerEl.getElementsByClassName(this.options.baseClassName + '-content')[0];

            this.$btnReset     = document.getElementById('popupS-resetFocus');
            this.$btnResetBack = document.getElementById('popupS-resetFocusBack');

            // handle reset focus link
            // this ensures that the keyboard focus does not
            // ever leave the dialog box until an action has
            // been taken
            _on(this.$btnReset, 'focus', this._resetEvent);
            _on(this.$btnResetBack, 'focus', this._resetEvent);

            // focus the first input in the layer Element
            _autoFocus(this.$layerEl);

            // make sure which buttons or input fields are defined for the EventListeners
            this.$btnOK = document.getElementById('popupS-button-ok') || undefined;
            this.$btnCancel = document.getElementById('popupS-button-cancel') || undefined;
            this.$input = document.getElementById('popupS-input') || undefined;
            if(typeof this.$btnOK !== "undefined")     _on(this.$btnOK, "click", this._okEvent);
            if(typeof this.$btnCancel !== "undefined") _on(this.$btnCancel, "click", this._cancelEvent);


            // eventlisteners for overlay and x
            if (this.options.flagShowCloseBtn)   _on(document.getElementById('popupS-close'), "click", this._cancelEvent);
            if (this.options.flagCloseByOverlay) _on(this.$overlayEl, "click", this._cancelEvent);

            // listen for keys
            if (this.options.flagCloseByEsc) _on(document.body, "keyup", this._keyEvent);

            // callback onOpen
            if(typeof this.callbacks.onOpen === "function") this.callbacks.onOpen.call(this);

        },
        _appendPopup : function(){
            // Determine the target Element and add the Element to the DOM
            this.$targetEl = this.options.appendLocation;
            _appendChild(this.$targetEl, this.$wrapEl);
            // append the element level style for overflow if the option was set.
            if ((this.$targetEl === (document.body || document.documentElement)) && this.options.flagBodyScroll === false) {
                _css(this.$targetEl, {
                    overflow: 'hidden'
                });
            }
            // after adding elements to the DOM, use computedStyle
            // to force the browser to recalc and recognize the elements
            // that we just added. This is so that our CSS Animation has a start point.
            if(window.getComputedStyle) window.getComputedStyle(this.$wrapEl, null).height;
            var classReg = function (className) {
                return new RegExp("(|\\s+)" + className + "(\\s+|$)");
            };
            // if the class *-open doesn't exists in the wrap Element append it.
            if (!(classReg(' ' + this.options.baseClassName + '-open').test(this.$wrapEl.className))) {
                this.$wrapEl.className += ' ' + this.options.baseClassName + '-open';
            }
            if (!(classReg(' ' + this.options.baseClassName + '-open').test(this.$layerEl.childNodes[0].className))) {
                this.$layerEl.childNodes[0].className += ' ' + this.options.baseClassName + '-open';
            }
        },
        _hide: function () {
            var self = this;
            // remove item from queue
            queue.splice(0,1);
            // check if last item in queue
            if (queue.length > 0) this._create();
            else{
                isOpen = false;

                var removeWrap = function() {
                    // remove the wrap element from the DOM
                    _removeElement(self.$wrapEl);
                    // remove the element level style for overflow if the option was set.
                    if ((self.$targetEl === (document.body || document.documentElement)) && self.options.flagBodyScroll === false) {
                        if (self.$targetEl.style.removeProperty) {
                            self.$targetEl.style.removeProperty('overflow');
                        } else {
                            self.$targetEl.style.removeAttribute('overflow');
                        }
                    }
                };

                var transitionDone = function(event) {
                    event.stopPropagation();
                    // unbind event so function only gets called once
                    _off(self.$wrapEl, transition.type, transitionDone);
                    // remove the Element from the DOM after Transition is Done
                    removeWrap();
                };

                var transitionDoneLayer = function(event) {
                    event.stopPropagation();
                    // unbind event so function only gets called once
                    _off(self.$layerEl, transition.type, transitionDone);
                };

                // removes the open class from the wrap & layer Element
                // and adds an EventListener to this Element
                // which removes it from the DOM after the Transition is done.

                this.$wrapEl.className = this.$wrapEl.className.replace(' ' + this.options.baseClassName + '-open', '');
                if (transition.supported){
                    _on(self.$wrapEl, transition.type, transitionDone);
                } else {
                    removeWrap();
                }
                this.$layerEl.childNodes[0].className = this.$layerEl.childNodes[0].className.replace(' ' + this.options.baseClassName + '-open', '');
                if (transition.supported) _on(self.$layerEl, transition.type, transitionDoneLayer);

            }
        },



        ///////////////
        //// Async ////
        ///////////////


        /**
         * sets the state of the loading Layer
         * and appends it to the Dom
         *
         * @param   {Bool}  state
         */
        _loading: function(state) {
            this.$loadingEl = _buildDOM({
                tag: 'div.' + this.options.baseClassName + '-loading.' + this.options.loader
            });
            if (state){
                this._resetLayer();
                _css(this.$layerEl.childNodes[0],{
                    height: '60px',
                    width: '60px',
                    borderRadius: '30px'
                });
                _appendChild(this.$layerEl.childNodes[0], this.$loadingEl);
                this._appendPopup();
            } else {
                _css(this.$layerEl.childNodes[0],{
                    height: null,
                    width: null,
                    borderRadius: null
                });
            }
        },
        /**
         * load Asynchronous Files
         * can be Images or Files via Ajax
         *
         * @param   {Object}    item
         */
        _loadContents: function(item) {
            var url = item.ajax.url,
                str = (typeof item.ajax.str != "undefined")? item.ajax.str : '',
                post = (typeof item.ajax.post != "undefined")? item.ajax.post : true,
                self = this;

            // Match image file
            if (url.match(R_IMG)) {//.exec(url) !== null
                // Create the image Element, not visible
                var imgElement = _buildDOM({
                    children: {
                        tag :   'img',
                        src :   url
                    }
                });
                this._loading(true);
                this._preLoadImage(imgElement, function(){
                    self._loading(false);
                    item.content = imgElement;
                    self._createPopup(item);
                });
            } else {
                // get url via ajax
                this._ajax(url, str, post, function(e){
                    // turn the result in a HTMLElement
                    var ajaxElement = _buildDOM({
                        html: this
                    });
                    // check if the newly created HTMLElement got any Images within it.
                    self._preLoadImage(ajaxElement, function(){
                        self._loading(false);
                        item.content = ajaxElement;
                        self._createPopup(item);
                    });
                }, function(){
                    //before Sending
                    self._loading(true);
                });
            }
        },
        _preLoadImage : function(parentNode, callback) {
            var items = _getElementsByTagName(parentNode, 'img');
            var i = items.length;
            var queue = i;
            var img;
            var self = this;

            while (i--){
                img = items[i];
                //in case the're already cached by the browser decrement queue
                if(img.complete) {
                    queue--;
                } else {
                    _on(img, 'load', complete);
                    _on(img, 'error', complete);
                }
            }
            //in case the're already cached by the browser
            !queue && complete();

            var complete = function(){
                if(--queue <= 0){
                    i = items.length;
                    while(i--){
                        img = items[i];
                        _off(img, 'load', complete);
                        _off(img, 'error', complete);
                    }
                    callback();
                }
            };
        },
        /**
         * ajax request
         * with callback and beforeSend
         *
         * @param   {String}    filename
         * @param   {String}    str
         * @param   {Bool}      post
         * @param   {Function}  callback
         * @param   {Function}  beforeSend
         */
        _ajax: function(filename, str, post, callback, beforeSend) {
            var ajax;
            if (window.XMLHttpRequest){
                ajax = new XMLHttpRequest();//IE7+, Firefox, Chrome, Opera, Safari
            } else if (ActiveXObject("Microsoft.XMLHTTP")){
                ajax = new ActiveXObject("Microsoft.XMLHTTP");//IE6/5
            }else if (ActiveXObject("Msxml2.XMLHTTP")){
                ajax = new ActiveXObject("Msxml2.XMLHTTP");//other
            }else{
                alert("Error: Your browser does not support AJAX.");
                return false;
            }
            ajax.onreadystatechange=function(){
                if (ajax.readyState == 4 && ajax.status == 200){
                    if (callback) callback.call(ajax.responseText);
                }
            };
            if(post === false) {
                ajax.open("GET", filename + str, true);
                ajax.send(null);
            } else {
                ajax.open("POST", filename, true);
                ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                ajax.send(str);
            }
            if(beforeSend) beforeSend.call();
            return ajax;
        },



        ////////////////
        //// Events ////
        ////////////////



        //ok event handler
        _okEvent: function(event) {
            // preventDefault
            if (typeof event.preventDefault !== "undefined") event.preventDefault();
            // call the callback onSubmit if one is defined. this references to _popupS
            if(typeof this.callbacks.onSubmit === "function") {
                if(typeof this.$input !== "undefined") {
                    this.callbacks.onSubmit.call(this, this.$input.value);
                } else {
                    this.callbacks.onSubmit.call(this);
                }
            }
            // hide popup and detach event handlers
            this._commonEvent();
        },
        // cancel event handler
        _cancelEvent: function(event) {
            if (typeof event.preventDefault !== "undefined") event.preventDefault();
            // call the callback onClose if one is defined. this references to _popupS
            if(typeof this.callbacks.onClose === "function") {
                this.callbacks.onClose.call(this);
            }
            this._commonEvent();
        },
        // common event handler (keyup, ok and cancel)
        _commonEvent: function() {
            // remove event handlers
            if(typeof this.$btnOK !== "undefined")     _off(this.$btnOK, "click", this._okEvent);
            if(typeof this.$btnCancel !== "undefined") _off(this.$btnCancel, "click", this._cancelEvent);
            if (this.options.flagShowCloseBtn)   _off(document.getElementById('popupS-close'), "click", this._cancelEvent);
            if (this.options.flagCloseByOverlay) _off(this.$overlayEl, "click", this._cancelEvent);
            if (this.options.flagCloseByEsc)     _off(document.body, "keyup", this._keyEvent);

            this._hide();
        },
        // reset focus to first item in the popup
        _resetEvent: function(event) {
            _autoFocus(this.$layerEl);
        },
        // keyEvent Listener for Enter and Escape
        _keyEvent: function(event) {
            var keyCode = event.keyCode;
            if(typeof this.$input !== "undefined" && keyCode === 13) this._okEvent(event);
            if(keyCode === 27) this._cancelEvent(event);
        },

    };
