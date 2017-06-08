/**
 * # Event Handler
 */

var events = {},
    singles = {};

window.handler = {
    /**
     * ## handler.on(name, callback)
     * Bind a callback that executes as many times as the event fires.
     * @param {string} name Event name.
     * @param {function(object)} callback Receives the Anvato event object.
     */
    on: function (name, callback) {
        events[name] = events[name] || [];
        events[name].push(callback);
    },
    /**
     * ## handler.one(name, callback)
     * Bind a callback that executes only once.
     * @param {string} name Event name.
     * @param {function(object)} callback Receives the Anvato event object.
     */
    one: function (name, callback) {
        singles[name] = singles[name] || [];
        singles[name].push(callback);
    },
    /**
     * ## handler.off(name)
     * Remove callbacks by event name or remove all callbacks for all events.
     * @param {string} name Event name. Undefined to clear all callbacks
     * from the system.
     */
    off: function (name) {
        if (name) {
            events[name] = [];
            singles[name] = [];
        } else {
            events = {};
            singles = {};
        }
    },
    /**
     * ## handler.trigger(name, event)
     * @param {string} name Event name.
     * @param {object} event Anvato event object.
     */
    trigger: function (name, event) {
        // Handle one-time bindings.
        if (name in singles) {
            singles[name].forEach(function (callback) {
                callback(event);
            });
            singles[name] = [];
        }

        // Handle regular bindings.
        if (name in events) {
            events[name].forEach(function (callback) {
                callback(event);
            });
        }
    }
};
