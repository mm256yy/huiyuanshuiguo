(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/specPicker/specPicker"],{"59c7":function(e,t,i){"use strict";i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return o})),i.d(t,"a",(function(){return c}));var c={uPopup:function(){return Promise.all([i.e("common/vendor"),i.e("node-modules/uview-ui/components/u-popup/u-popup")]).then(i.bind(null,"4556"))},uNumberBox:function(){return Promise.all([i.e("common/vendor"),i.e("node-modules/uview-ui/components/u-number-box/u-number-box")]).then(i.bind(null,"0c28"))}},n=function(){var e=this,t=e.$createElement;e._self._c},o=[]},"64ae":function(e,t,i){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=getApp(),c={name:"specPicker",props:{goods:{type:Object},orderType:{type:String,default:"buy"},kaituanId:{type:String},cardShow:{type:Boolean,default:!1}},data:function(){return{shopData:e.getStorageSync("__ddminiShopInfo"),storeData:e.getStorageSync("__ddminiStoreInfo"),template:e.getStorageSync("__ddminiTemplateConfig"),goodsDetail:"",timeData:{},buyNumber:1,buyNumMax:0,selectMaxPrice:0,selectSizePrice:0,selectPintuanPrice:0,propertyChildIds:"",propertyChildNames:"",childProductData:"",buyActive:!1,canSubmit:!1}},watch:{cardShow:function(e){if(e){var t=this,i=JSON.parse(JSON.stringify(t.goods));t.buyNumMax=i.stock_number,t.selectMaxPrice=i.max_price,t.selectSizePrice=i.mini_price,i.stock_number>0&&(t.buyActive=!0),i.specs_list&&(t.canSubmit=!0),i.pintuan_id&&(t.selectPintuanPrice=i.pintuan_price),t.goodsDetail=i,t.goodsDetail.specs_list&&t.goodsDetail.specs_list.specification.forEach((function(e,i){t.selectSpecsTap(i,0)}))}}},methods:{onChange:function(e){this.timeData=e},selectSpecsTap:function(t,i){for(var c=this,n=c.goodsDetail.specs_list.specification,o=0;o<n.length;o++)if(o==t){n[o].active=!0;for(var a=0;a<n[o].value.length;a++)n[o].value[a].active=a==i}c.$set(c.goodsDetail.specs_list.specification,t,c.goodsDetail.specs_list.specification[t]);for(var r=0,u={},s=0;s<n.length;s++)if(n[s].active){r++;for(var l=0;l<n[s].value.length;l++)n[s].value[l].active&&(u[n[s].name]=n[s].value[l].name)}r==n.length?c.canSubmit=!1:c.canSubmit=!0;for(var d=c.goodsDetail.specs_list.childProductArray,p=function(t){!c.canSubmit&&Object.keys(u).every((function(e){return d[t].child_product_spec[e]===u[e]}))&&(c.buyActive=!0,c.childProductData=d[t],c.buyNumber=1,c.buyNumMax=d[t].child_product_stock,c.selectMaxPrice=d[t].child_product_cost,c.selectSizePrice=d[t].child_product_price,c.selectPintuanPrice=d[t].child_product_pintuan,c.propertyChildNames=d[t].child_product_spec,0==d[t].child_product_stock&&(c.buyActive=!1,c.buyNumber=0,e.showToast({title:"该商品库存不足",icon:"none"})))},f=0;f<d.length;f++)p(f)},getBuyShopCart:function(){var t=this,c=t.orderType,n=t.goodsDetail,o=t.childProductData;if(i.globalData.user){if(n.specs_status&&!o)return e.showToast({title:"请选择商品规格",icon:"none"});if(o&&0===o.child_product_stock)return e.showToast({title:"选择的规格库存不足",icon:"none"});var a=e.getStorageSync("__ddminiStoreInfo"),r={id:n.id,number:1};a&&(r.store=a.id),o&&(r.spec=o.child_product_id),t.Get(t.Url.cartAdd,r).then((function(i){if(0==i.code){if("cart"==c)return e.showToast({title:"加入成功"}),t.cartShow=!1,t.$emit("close",!0),t.$emit("cart",!0),void e.$emit("cart");var a={id:n.id,num:1,pic:n.pic_list[0].pic,shelve_status:n.shelve_status,stock_number:n.stock_number,title:n.title,active:!0,mini_price:t.selectPintuanPrice||t.selectSizePrice};o&&(a.spec_id=o.child_product_id,a.spec_name=o.child_product_spec,a.mini_price=o.child_product_price,a.stock_number=o.child_product_stock),t.$emit("close",!0),e.setStorage({key:"__ddminiShopCart",data:[a]});var r="/pages/order/paypal";return"pintuan"!==c||t.kaituanId?"pintuan"===c&&t.kaituanId&&(r="/pages/order/paypal?type=pintuan&pintuanId="+t.kaituanId):r="/pages/order/paypal?type=pintuan",void e.navigateTo({url:r})}e.showModal({content:i.msg,showCancel:!1})}))}else e.navigateTo({url:"/pages/user/login"})},closeShow:function(){this.$emit("close",!0)}}};t.default=c}).call(this,i("543d")["default"])},7673:function(e,t,i){"use strict";i.r(t);var c=i("64ae"),n=i.n(c);for(var o in c)"default"!==o&&function(e){i.d(t,e,(function(){return c[e]}))}(o);t["default"]=n.a},"9dfa":function(e,t,i){},a86f:function(e,t,i){"use strict";var c=i("9dfa"),n=i.n(c);n.a},cdd3:function(e,t,i){"use strict";i.r(t);var c=i("59c7"),n=i("7673");for(var o in n)"default"!==o&&function(e){i.d(t,e,(function(){return n[e]}))}(o);i("a86f");var a,r=i("f0c5"),u=Object(r["a"])(n["default"],c["b"],c["c"],!1,null,"8b266758",null,!1,c["a"],a);t["default"]=u.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/specPicker/specPicker-create-component',
    {
        'components/specPicker/specPicker-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("cdd3"))
        })
    },
    [['components/specPicker/specPicker-create-component']]
]);
