    module.exports = (function() {
        var t, type;
        var supported = false;
        var el = document.createElement("fakeelement");
        var transitions = {
            "WebkitTransition": "webkitTransitionEnd",
            "MozTransition": "transitionend",
            "OTransition": "otransitionend",
            "transition": "transitionend"
        };

        for(t in transitions) {
            if (transitions.hasOwnProperty(t) && el.style[t] !== undefined) {
                type = transitions[t];
                supported = true;
                break;
            }
        }

        return {
            type: type,
            supported: supported
        };
    })();
