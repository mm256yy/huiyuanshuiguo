(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/about/about"],{"191f":function(n,t,o){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o={name:"about",props:{},data:function(){return{brandInfo:"",version:n.getAccountInfoSync().miniProgram.version?n.getAccountInfoSync().miniProgram.version:"1.0.0"}},onReady:function(){var n=this;n.Get(n.Url.brandInfo,{}).then((function(t){0===t.code&&(n.brandInfo=t.data)}))},methods:{getAboutTap:function(){n.navigateTo({url:"/pages/about"})}}};t.default=o}).call(this,o("543d")["default"])},"3d04":function(n,t,o){"use strict";var u;o.d(t,"b",(function(){return e})),o.d(t,"c",(function(){return a})),o.d(t,"a",(function(){return u}));var e=function(){var n=this,t=n.$createElement;n._self._c},a=[]},"414c":function(n,t,o){"use strict";var u=o("957b"),e=o.n(u);e.a},"8e41":function(n,t,o){"use strict";o.r(t);var u=o("3d04"),e=o("f1c8");for(var a in e)"default"!==a&&function(n){o.d(t,n,(function(){return e[n]}))}(a);o("414c");var r,c=o("f0c5"),f=Object(c["a"])(e["default"],u["b"],u["c"],!1,null,null,null,!1,u["a"],r);t["default"]=f.exports},"957b":function(n,t,o){},f1c8:function(n,t,o){"use strict";o.r(t);var u=o("191f"),e=o.n(u);for(var a in u)"default"!==a&&function(n){o.d(t,n,(function(){return u[n]}))}(a);t["default"]=e.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/about/about-create-component',
    {
        'components/about/about-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("8e41"))
        })
    },
    [['components/about/about-create-component']]
]);
