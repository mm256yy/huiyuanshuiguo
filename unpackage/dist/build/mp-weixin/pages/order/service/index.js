(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/order/service/index"],{"5f1e":function(e,t,i){"use strict";(function(e){i("d37c");n(i("66fd"));var t=n(i("8c2b"));function n(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=i,e(t.default)}).call(this,i("543d")["createPage"])},"7ad2":function(e,t,i){"use strict";var n;i.d(t,"b",(function(){return r})),i.d(t,"c",(function(){return c})),i.d(t,"a",(function(){return n}));var r=function(){var e=this,t=e.$createElement;e._self._c},c=[]},"8c2b":function(e,t,i){"use strict";i.r(t);var n=i("7ad2"),r=i("cabd");for(var c in r)"default"!==c&&function(e){i.d(t,e,(function(){return r[e]}))}(c);i("ac62");var o,a=i("f0c5"),s=Object(a["a"])(r["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],o);t["default"]=s.exports},ac62:function(e,t,i){"use strict";var n=i("b7af"),r=i.n(n);r.a},b7af:function(e,t,i){},cabd:function(e,t,i){"use strict";i.r(t);var n=i("cf0d"),r=i.n(n);for(var c in n)"default"!==c&&function(e){i.d(t,e,(function(){return n[e]}))}(c);t["default"]=r.a},cf0d:function(e,t,i){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;getApp();var i={data:function(){return{template:e.getStorageSync("__ddminiTemplateConfig"),orderMenu:[{id:6,name:"处理中"},{id:1,name:"申请退款"},{id:5,name:"申请售后"}],orderActive:6,page:1,orderList:[],serviceList:[]}},onShow:function(){var e=this;e.getOrderList(),e.getServiceList()},methods:{selectMenuTap:function(e){this.orderActive=e,this.getOrderList(),this.getServiceList()},getServiceList:function(){var e=this,t={status:0,page:1,sizes:100};6===e.orderActive&&e.Get(e.Url.serviceList,t).then((function(t){0===t.code&&(e.serviceList=t.data.list)}))},getOrderList:function(){var t=this,i={sizes:100,order_type:1,page:t.page,status:t.orderActive};6!=t.orderActive?(e.showLoading({title:"数据加载中"}),t.Get(t.Url.orderList,i).then((function(i){t.loading=!1,0===i.code?(e.hideLoading(),t.orderList=i.data.list):e.hideLoading()}))):t.orderList=[]},getOrderDetail:function(t){e.navigateTo({url:"/pages/order/details?id="+t})},getSericeTap:function(t,i){e.navigateTo({url:"/pages/order/service/selectgoods?id="+t+"&type="+i})},getServicerDetail:function(t,i){var n=this,r=n.serviceList[t];1===i?e.showModal({content:"正等待客服处理中，是否取消申请？",success:function(e){e.confirm&&n.getServiceDel({id:r.id,type:i})}}):2===i&&e.showModal({content:"是否删除该申请？",success:function(e){e.confirm&&n.getServiceDel({id:r.id,type:i})}})},getServiceDel:function(t){var i=this;i.Get(i.Url.serviceDel,t).then((function(n){0===n.code?(1===t.type?e.showToast({title:"取消申请成功"}):2===t.type&&e.showToast({title:"申请删除成功"}),i.getServiceList()):e.showModal({content:n.msg,showCancel:!1})}))}}};t.default=i}).call(this,i("543d")["default"])}},[["5f1e","common/runtime","common/vendor"]]]);