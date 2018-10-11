# simple-http-jsonp


## 使用

支持 AMD,CMD,浏览器写法。

```javascript
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
```


## 参数


url

> (一个用来包含发送请求的URL字符串。)

data

> (发送到服务器的数据。将自动转换为请求字符串格式。GET 请求中将附加在 URL 后。查看 processData 选项说明以禁止此自动转换。
必须为 Key/Value 格式。如果为数组，jQuery 将自动为不同值对应同一个名称。如 {foo:[“bar1”, “bar2”]} 转换为 “&foo=bar1&foo=bar2”。)


scriptCharset

> 编码格式


success

> 请求成功后的回调函数。

error

> 请求失败之后的回调函数。

timeout

> 设置请求超时时间（毫秒）。

jsonp

> 在一个jsonp请求中重写回调函数的名字。这个值用来替代在”callback=?”这种GET或POST请求中URL参数里的”callback”部分，
比如{jsonp:’onJsonPLoad’}会导致将”onJsonPLoad=?”传给服务器。

jsonpCallback

> 为jsonp请求指定一个回调函数名。这个值将用来取代jQuery自动生成的随机函数名。这主要用来让jQuery生成度独特的函数名，
这样管理请求更容易，也能方便地提供回调函数和错误处理。你也可以在想让浏览器缓存GET请求的时候，指定这个回调函数名。