(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/category"],{"041f":function(t,e,n){"use strict";var r=n("f117"),a=n.n(r);a.a},"12c9":function(t,e,n){"use strict";(function(t){n("d37c");r(n("66fd"));var e=r(n("b480"));function r(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},4196:function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){return r}));var r={aicon:function(){return n.e("components/aicon/aicon").then(n.bind(null,"6387"))}},a=function(){var t=this,e=t.$createElement;t._self._c},i=[]},b480:function(t,e,n){"use strict";n.r(e);var r=n("4196"),a=n("b774");for(var i in a)"default"!==i&&function(t){n.d(e,t,(function(){return a[t]}))}(i);n("041f");var o,c=n("f0c5"),u=Object(c["a"])(a["default"],r["b"],r["c"],!1,null,null,null,!1,r["a"],o);e["default"]=u.exports},b774:function(t,e,n){"use strict";n.r(e);var r=n("c16e"),a=n.n(r);for(var i in r)"default"!==i&&function(t){n.d(e,t,(function(){return r[t]}))}(i);e["default"]=a.a},c16e:function(t,e,n){"use strict";(function(t){function n(t){return o(t)||i(t)||a(t)||r()}function r(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function a(t,e){if(t){if("string"===typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(t,e):void 0}}function i(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function o(t){if(Array.isArray(t))return c(t)}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var u=getApp(),f={data:function(){return{template:t.getStorageSync("__ddminiTemplateConfig"),categoryId:"",allGoodsList:[],userInfoData:""}},onLoad:function(e){var n=this;n.categoryId=e.id,n.getUserInfo(),n.Get(n.Url.categoryList,{pid:e.id}).then((function(e){if(0===e.code){var n=e.data[0];n&&t.setNavigationBarTitle({title:n.title})}}))},methods:{getUserInfo:function(){var t=this;t.Get(t.Url.userInfo).then((function(e){0===e.code&&(t.userInfoData=e.data),t.getGoodsList()}))},getGoodsList:function(){var t=this,e={page:1,sizes:100,category:t.categoryId,order:3};t.Get(t.Url.goodsList,e).then((function(e){0===e.code&&(t.allGoodsList=e.data.list)}))},getAddCartTap:function(e){var n=this;if(e.specs_status)n.getPathTap("/pages/index/details?id="+e.id);else if(e.pintuan_id||"score"===e.ctype)n.getPathTap("/pages/index/details?id="+e.id);else{var r={id:e.id,number:1};n.Get(n.Url.cartAdd,r).then((function(e){0===e.code&&t.showToast({title:"已加入购物车"})}))}},getPathTap:function(t){u.globalData.getPathTap(t)},getMemberPriceTap:function(t){var e=this,r=e.userInfoData;if(r.level_id){var a=t.vip_price.find((function(t){return t.id===r.level_id}));return a.price}var i=t.vip_price.map((function(t){return t.price})),o=Math.max.apply(Math,n(i));return o}}};e.default=f}).call(this,n("543d")["default"])},f117:function(t,e,n){}},[["12c9","common/runtime","common/vendor"]]]);