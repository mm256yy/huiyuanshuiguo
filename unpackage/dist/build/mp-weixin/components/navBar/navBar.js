(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/navBar/navBar"],{"4c86":function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){return a}));var a={aicon:function(){return n.e("components/aicon/aicon").then(n.bind(null,"6387"))}},r=function(){var t=this,e=t.$createElement;t._self._c},i=[]},"545c":function(t,e,n){},"5c00":function(t,e,n){"use strict";n.r(e);var a=n("4c86"),r=n("8a84");for(var i in r)"default"!==i&&function(t){n.d(e,t,(function(){return r[t]}))}(i);n("dec5");var u,o=n("f0c5"),c=Object(o["a"])(r["default"],a["b"],a["c"],!1,null,"4f7a6138",null,!1,a["a"],u);e["default"]=c.exports},"8a84":function(t,e,n){"use strict";n.r(e);var a=n("eb78"),r=n.n(a);for(var i in a)"default"!==i&&function(t){n.d(e,t,(function(){return a[t]}))}(i);e["default"]=r.a},dec5:function(t,e,n){"use strict";var a=n("545c"),r=n.n(a);r.a},eb78:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=getApp(),a={props:{logo:{type:String},back:{type:Boolean,default:!1},store:{type:Object},title:{type:String},color:{type:String,default:"#ffffff"},position:{type:String,default:"relative"}},data:function(){return{statusBarHeight:"",pagesLength:getCurrentPages().length}},computed:{height:function(){var e=t.getSystemInfoSync(),n=e.platform,a=e.statusBarHeight,r=(e.windowHeight,a+4);"android"==n.toLowerCase()&&(r+=4),this.statusBarHeight=r-4+"px";var i=r+44;return this.$emit("height",i),i}},methods:{getBackTap:function(){return this.pagesLength>1?t.navigateBack():t.switchTab({url:"/pages/index/index"})},getPathTap:function(t){n.globalData.getPathTap(t)}}};e.default=a}).call(this,n("543d")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/navBar/navBar-create-component',
    {
        'components/navBar/navBar-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("5c00"))
        })
    },
    [['components/navBar/navBar-create-component']]
]);