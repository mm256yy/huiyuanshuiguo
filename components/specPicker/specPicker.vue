<template>
	<view>
		<u-popup :show="cardShow" round="10" mode="bottom" closeable @close="closeShow()">
			<view class="godos_show_box">
				<view class="goods_box">
					<view class="goods">
						<view class="image">
							<image :src="goodsDetail.pic||goodsDetail.pic_list[0].pic" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="lab_box">
								<view class="title">{{goodsDetail.title}}</view>
								<view class="text">{{buyNumMax>10?'库存充足':'库存仅剩'+buyNumMax+'件'}}</view>
								<view v-if="orderType==='pintuan'" class="price">¥{{selectPintuanPrice}} <span>¥{{selectSizePrice}}</span></view>
								<view v-else class="price">¥{{selectSizePrice}} <span v-if="selectMaxPrice">¥{{selectMaxPrice}}</span></view>
							</view>
						</view>
					</view>
					<scroll-view scroll-y scroll-with-animation class="labelBox">
						<view class="label" v-for="(item, index) in goodsDetail.specs_list.specification" :key="index">
							<view class="title">{{item.name}}</view>
							<view class="specBox">
								<view class="spec" :class="{active: itm.active}" @click="selectSpecsTap(index, idx)" v-for="(itm, idx) in item.value" :key="idx">{{itm.name}}</view>
							</view>
						</view>
					</scroll-view>
					<view class="picker">
						<view class="title">购买数量</view>
						<view class="buy">
							<u-number-box disabledInput buttonSize="27" integer :min="1" :max="buyNumMax" v-model="buyNumber"></u-number-box>
						</view>
					</view>
				</view>
				<view v-if="orderType==='pintuan'" class="button_box">
					<view v-if="buyActive" class="button" @click="getBuyShopCart()" >{{kaituanId?'立即参团':'立即开团'}}</view>
					<view v-else class="button" style="opacity: .5;">{{kaituanId?'立即参团':'立即开团'}}</view>
				</view>
				<view v-else class="button_box">
					<view v-if="buyActive" class="button" @click="getBuyShopCart()" >{{orderType==='buy'?'立即购买':'加入购物袋'}}</view>
					<view v-else class="button" style="opacity: .5;">{{orderType==='buy'?'立即购买':'加入购物袋'}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		name: 'specPicker',
		props: {
			goods: {
				type: Object,
			},
			orderType: {
				type: String,
				default: 'buy'
			},
			kaituanId: {
				type: String
			},
			cardShow: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				shopData: uni.getStorageSync('__ddminiShopInfo'),
				storeData: uni.getStorageSync('__ddminiStoreInfo'),
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				goodsDetail: '',
				timeData: {},
				buyNumber: 1,
				buyNumMax: 0,
				selectMaxPrice: 0,
				selectSizePrice: 0,
				selectPintuanPrice: 0,
				propertyChildIds: '',
				propertyChildNames: '',
				childProductData: '',
				buyActive: false,
				canSubmit: false,
			}
		},
		watch: {
			cardShow(status){
				if(status){
					let self = this;
					let data = JSON.parse(JSON.stringify(self.goods));
					self.buyNumMax = data.stock_number;
					self.selectMaxPrice = data.max_price;
					self.selectSizePrice = data.mini_price;
					if(data.stock_number>0){
						self.buyActive = true;
					}
					if(data.specs_list){
						self.canSubmit = true;
					}
					if(data.pintuan_id){
						self.selectPintuanPrice = data.pintuan_price;
					}
					self.goodsDetail = data;
					if(self.goodsDetail.specs_list){
						self.goodsDetail.specs_list.specification.forEach((itm, idx) => {
							self.selectSpecsTap(idx ,0);
						})
					}
				}
			}
		},
		methods: {
			onChange(e) {
				this.timeData = e
			},
			selectSpecsTap(index, idx) {
				let self = this;
				let specification = self.goodsDetail.specs_list.specification;
				for(let i = 0; i < specification.length; i++){
					if(i == index) {
						specification[i].active = true;
						for(let s = 0; s < specification[i].value.length; s++){
							if(s == idx) {
								specification[i].value[s].active = true;
							}else{
								specification[i].value[s].active = false
							}
						}
					}
				}
				self.$set(self.goodsDetail.specs_list.specification, index, self.goodsDetail.specs_list.specification[index])
				let curSelectNum = 0;
				let propertyChildIds = '';
				let propertyChildNames = '';
				let selectSpecification = {};
				for(let i = 0; i < specification.length; i++){
					if(specification[i].active){
						curSelectNum++
						for(let s = 0; s < specification[i].value.length; s++){
							if(specification[i].value[s].active){
								selectSpecification[specification[i].name] = specification[i].value[s].name;
							}
						}
					}
				}
				if(curSelectNum==specification.length){
					self.canSubmit = false;
				}else{
					self.canSubmit = true;
				}
				let childProductArray = self.goodsDetail.specs_list.childProductArray;
				for(let i = 0; i < childProductArray.length; i++){
					if(!self.canSubmit && Object.keys(selectSpecification).every(key => childProductArray[i].child_product_spec[key] === selectSpecification[key])){
						self.buyActive = true;
						self.childProductData = childProductArray[i];
						self.buyNumber = 1;
						self.buyNumMax = childProductArray[i].child_product_stock;
						self.selectMaxPrice = childProductArray[i].child_product_cost;
						self.selectSizePrice = childProductArray[i].child_product_price;
						self.selectPintuanPrice = childProductArray[i].child_product_pintuan;
						self.propertyChildNames = childProductArray[i].child_product_spec;
						if(childProductArray[i].child_product_stock==0){
							self.buyActive = false;
							self.buyNumber = 0;
							uni.showToast({title: '该商品库存不足',icon: 'none'});
						}
					}
				}
			},
			getBuyShopCart() {
				let self = this;
				let type = self.orderType;
				let goods = self.goodsDetail;
				let specs = self.childProductData;
				if(app.globalData.user){
					if(goods.specs_status && !specs){
						return uni.showToast({title: '请选择商品规格', icon: 'none'});
					}else if(specs && specs.child_product_stock===0){
						return uni.showToast({title: '选择的规格库存不足', icon: 'none'});
					}
					let store = uni.getStorageSync('__ddminiStoreInfo');
					let postData = {
						id: goods.id,
						number: 1,
					}
					if(store){
						postData.store = store.id;
					}
					if(specs){
						postData.spec = specs.child_product_id;
					}
					self.Get(self.Url.cartAdd, postData).then(res => {
						if(res.code == 0){
							if(type=='cart'){
								uni.showToast({title: '加入成功'});
								self.cartShow = false;
								self.$emit('close', true);
								self.$emit('cart', true);
								uni.$emit('cart');
								return
							}else{
								let resData = {
									id: goods.id,
									num: 1,
									pic: goods.pic_list[0].pic,
									shelve_status: goods.shelve_status,
									stock_number: goods.stock_number,
									title: goods.title,
									active: true,
									mini_price: self.selectPintuanPrice||self.selectSizePrice,
								}
								if(specs){
									resData.spec_id = specs.child_product_id;
									resData.spec_name = specs.child_product_spec;
									resData.mini_price = specs.child_product_price;
									resData.stock_number = specs.child_product_stock;
								}
								self.$emit('close', true);
								uni.setStorage({key: '__ddminiShopCart',data: [resData]});
								let path = '/pages/order/paypal';
								if(type==='pintuan' && !self.kaituanId){
									path = '/pages/order/paypal?type=pintuan';
								}else if(type==='pintuan' && self.kaituanId){
									path = '/pages/order/paypal?type=pintuan&pintuanId='+self.kaituanId;
								}
								uni.navigateTo({url: path});
								return
							}
						}else{
							uni.showModal({content: res.msg, showCancel: false});
						}
					});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			closeShow(){
				this.$emit('close', true);
			}
		}
	}
</script>

<style lang="less" scoped>
	.godos_show_box{
		padding-top: 30rpx;
		.goods_box{
			width: 100%;
			max-height: 70vh;
			.goods{
				width: 90%;
				margin: 0 auto;
				padding: 30rpx 0;
				display: flex;
				align-items: center;
				.image{
					width: 210rpx;
					image{
						width: 180rpx;
						height: 180rpx;
						border: 1px solid #f5f5f5;
						border-radius: 10rpx;
					}
				}
				.info{
					flex: 1;
					height: 170rpx;
					min-width: 0;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.lab_box{
						width: 100%;
						height: 100%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
					.title{
						color: #1c1c1c;
						font-size: 30rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
					.text{
						color: #999;
					}
					.price{
						font-size: 36rpx;
						color: #da0a79;
						span{
							color: #999;
							margin-left: 12rpx;
							text-decoration: line-through;
							font-size: 30rpx;
						}
					}
					.times{
						display: flex;
						align-items: center;
						color: #999;
						font-size: 26rpx;
					}
				}
			}
			.labelBox{
				width: 90%;
				margin: 0 auto;
				max-height: 400rpx;
				.label{
					padding-bottom: 20rpx;
					.title{
						color: #1c1c1c;
						font-size: 28rpx;
					}
					.specBox{
						padding-top: 20rpx;
						display: flex;
						flex-wrap: wrap;
						.spec{
							border: 1px solid #e5e5e5;
							color: #999;
							font-size: 26rpx;
							margin-bottom: 20rpx;
							page-break-inside: avoid;
							display: inline-block;
							padding: 12rpx 20rpx;
							margin-right: 20rpx;
							border-radius: 10rpx;
						}
						.active{
							color: #fff;
							background-color: #da0a79;
							border-color: #da0a79;
						}
					}
				}
			}
			.picker{
				width: 90%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 0 30rpx;
				.title{
					color: #1c1c1c;
					font-size: 28rpx;
				}
			}
		}
		.button_box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: 10rpx 0 30rpx;
			.button{
				width: 90%;
				margin: 0 auto;
				height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 100rpx;
				background-color: #da0a79;
			}
		}
	}
</style>
