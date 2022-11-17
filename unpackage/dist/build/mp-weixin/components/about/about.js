(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/about/about"],{"02c0":function(n,t,a){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={name:"about",props:{},data:function(){return{brandInfo:"",version:n.getAccountInfoSync().miniProgram.version?n.getAccountInfoSync().miniProgram.version:"1.0.0"}},onReady:function(){var n=this;n.Get(n.Url.brandInfo,{}).then((function(t){0===t.code&&(n.brandInfo=t.data)}))},methods:{getAboutTap:function(){n.navigateTo({url:"/pages/about"})}}};t.default=a}).call(this,a("543d")["default"])},"06a9":function(n,t,a){"use strict";var o=a("5813"),u=a.n(o);u.a},"07fd":function(n,t,a){"use strict";a.r(t);var o=a("02c0"),u=a.n(o);for(var e in o)"default"!==e&&function(n){a.d(t,n,(function(){return o[n]}))}(e);t["default"]=u.a},"36a0":function(n,t,a){"use strict";a.r(t);var o=a("4611"),u=a("07fd");for(var e in u)"default"!==e&&function(n){a.d(t,n,(function(){return u[n]}))}(e);a("06a9");var r,c=a("f0c5"),f=Object(c["a"])(u["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],r);t["default"]=f.exports},4611:function(n,t,a){"use strict";var o;a.d(t,"b",(function(){return u})),a.d(t,"c",(function(){return e})),a.d(t,"a",(function(){return o}));var u=function(){var n=this,t=n.$createElement;n._self._c},e=[]},5813:function(n,t,a){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/about/about-create-component',
    {
        'components/about/about-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("36a0"))
        })
    },
    [['components/about/about-create-component']]
]);
