/*
* author: wancheng
* date: 10/11/18
* desc: 
*/

!(function () {

    function noop() {

    }

    var _settings = {
        success: noop,
        error: noop
    };

    // extend
    function extend(target) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 1);
        //
        for (var i = 0, length = args.length; i < length; i++) {
            var source = args[i];
            for (var key in  args[i]) {
                if (source[key] !== undefined) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    }

    function appendQuery(url, query) {
        return (url + '&' + query).replace(/[&?]{1,2}/, '?');
    }

    function param(obj, traditional) {
        var params = [];
        //
        params.add = function (k, v) {
            this.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        };
        serialize(params, obj, traditional);
        return params.join('&').replace('%20', '+');
    }


    // serialize
    function serialize(params, obj, traditional, scope) {
        var _isArray = isArray(obj);

        for (var key in obj) {
            var value = obj[key];

            if (scope) {
                key = traditional ? scope : scope + '[' + (_isArray ? '' : key) + ']';
            }

            // handle data in serializeArray format
            if (!scope && _isArray) {
                params.add(value.name, value.value);

            }
            else if (traditional ? _isArray(value) : isObject(value)) {
                serialize(params, value, traditional, key);
            }
            else {
                params.add(key, value);
            }
        }

    }

    // is object
    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    // is array
    function isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    }


    function serializeData(options) {
        // 排除掉 formData
        if (isObject(options)) {
            options.data = param(options.data);
        }

        if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) {
            options.url = appendQuery(options.url, options.data);
        }
    }


    function jsonp(options) {

        var settings = extend({}, options || {});
        //
        for (var key in _settings) {
            if (settings[key] === undefined) {
                settings[key] = _settings[key];
            }
        }

        var hasPlaceholder = /=\?/.test(settings.url);
        if (!hasPlaceholder) {
            var jsonpCallback = (settings.jsonp || 'callback') + '=?';
            settings.url = appendQuery(settings.url, jsonpCallback)
        }


        var callbackName = settings.jsonpCallback || 'jsonp' + (new Date().getTime());
        var script = window.document.createElement('script');

        var abort = function () {
            // 设置 window.xxx = noop
            if (callbackName in window) {
                window[callbackName] = noop;
            }
        };

        var xhr = {abort: abort};
        var abortTimeout;

        var head = window.document.getElementsByTagName('head')[0] || window.document.documentElement;

        // ie8+
        script.onerror = function (error) {
            _error(error);
        };

        function _error(error) {
            window.clearTimeout(abortTimeout);
            xhr.abort();
            settings.error(error);
            _removeScript();
        }

        window[callbackName] = function (data) {
            window.clearTimeout(abortTimeout);
            settings.success(data);
            _removeScript();
        };

        //
        serializeData(settings);

        script.src = settings.url.replace(/=\?/, '=' + callbackName);
        //
        script.src = appendQuery(script.src, '_=' + (new Date()).getTime());

        script.async = true;

        // script charset
        if (settings.scriptCharset) {
            script.charset = settings.scriptCharset;
        }

        head.insertBefore(script, head.firstChild);

        if (settings.timeout > 0) {
            abortTimeout = window.setTimeout(function () {
                xhr.abort();
                settings.error('timeout');
                _removeScript();
            }, settings.timeout);
        }

        //
        function _removeScript() {
            if (script.clearAttributes) {
                script.clearAttributes();
            } else {
                script.onload = script.onreadystatechange = script.onerror = null;
            }

            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            //
            script = null;

            delete window[callbackName];
        }
    }


    // RequireJS && SeaJS
    if (typeof define === 'function') {
        define(function () {
            return jsonp;
        });
        // NodeJS
    } else if (typeof exports !== 'undefined') {
        module.exports = jsonp;
    } else {
        // browser
        window.jsonp = jsonp;
    }

})();