<template>
	<view class="content">
		<view class="paypal_box">
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>提货方式</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="delivery_box">
					<u-radio-group v-model="deliveryType" placement="row" @change="paypalOrderTap()">
						<u-radio v-for="(item, index) in shopInfoData.shop_delivery" :key="index" activeColor="#F54319" :name="item.lid" :label="item.cname" shape="square"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view v-if="deliveryType===1" class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>收货地址</span>
					</view>
					<view class="right">
						<span v-if="addressData" @click="getPathTap('/pages/user/addressEdit?id='+addressData.id)">编辑地址</span>
						<span v-else @click="getPathTap('/pages/user/addressList?type=select')">请选择收货地址</span>
					</view>
				</view>
				<view class="address_box" @click="getPathTap('/pages/user/addressList?type=select')">
					<view v-if="addressData" class="address">
						<view class="left">
							<view class="tit">{{addressData.cname}}<span>{{addressData.phone}}</span></view>
							<view class="txt">{{provinceText(addressData.province)}}{{addressData.address}}</view>
						</view>
						<view class="right">
							<aicon type="arrow-right-s-line" size="25" color="#999"></aicon>
						</view>
					</view>
					<view v-else class="none_address">
						<aicon type="location" size="25"></aicon>
						<span>选择地址</span>
					</view>
				</view>
			</view>
			
			<view v-if="deliveryType===2" class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>联系电话</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="phone_box">
					<view class="input">
						<input type="number" v-model="userPhoneNumber" placeholder="请输入联系电话"/>
					</view>
					<view class="btn">获取当前号码<button open-type="getPhoneNumber" @getphonenumber="getBindWechatPhoneTap"></button></view>
				</view>
			</view>
			
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>商品信息</span>
					</view>
					<view class="right"><!-- 共{{cardNumTotal}}件商品 --></view>
				</view>
				<view class="goods_box">
					<view class="goods" v-for="(item, index) in shopCartList" :key="index">
						<view class="left">
							<image :src="item.pic" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="title">{{item.title}}</view>
							<view class="text" v-if="item.spec_name">
								<span v-for="(itm, idx) in item.spec_name" :key="idx">{{itm}}</span>
							</view>
							<view class="price">
								<view class="num" v-if="item.ctype==='score'" :style="{color: '#F54319'}">{{item.mini_score}}<span>积分</span></view>
								<view class="num" v-else :style="{color: '#F54319'}">{{item.mini_price}}<span>元</span></view>
								<view class="buy">x{{item.num}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-if="couponsList.length>0 && !goodsScoreStatus" class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>使用优惠</span>
					</view>
					<view class="right"><!-- 共{{couponsList.length}}张优惠券可用 --></view>
				</view>
				<view class="coupons_box">
					<view class="label" v-for="(item, index) in couponsList" :key="index" @click="selectCouponsTap(index)">
						<view class="price" :style="{color: '#F54319'}">{{item.moneys}}<span>元</span></view>
						<view class="info">
							<view class="title">{{item.title}}</view>
							<view class="text">{{diaplayTime(item.update_time)}}领取</view>
						</view>
						<view class="button">
							<aicon v-if="couponsIndex===index" size="25" type="checkbox-circle-fill" color="#F54319"></aicon>
							<aicon v-else size="25" type="checkbox-blank-circle-line" color="#bbb"></aicon>
						</view>
					</view>
				</view>
			</view>
			
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>支付信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="order_info_box">
					<view class="order_head">
						<view class="label">
							<view class="tit">商品合计</view>
							<view class="txt" v-if="goodsScoreStatus">{{orderData.goods_score}}积分</view>
							<view class="txt" v-else>¥{{orderData.goods_money}}</view>
						</view>
						<view v-if="orderData.coupons_money>0" class="label">
							<view class="tit">优惠金额</view>
							<view class="txt">-¥{{orderData.coupons_money}}</view>
						</view>
						<view v-if="orderData.user_level && !goodsScoreStatus" class="label">
							<view class="tit">会员折扣</view>
							<view class="txt">-¥{{orderData.user_money}}</view>
						</view>
						<view v-if="orderData.freight_money>0" class="label">
							<view class="tit">运费</view>
							<view class="txt">¥{{orderData.freight_money}}</view>
						</view>
					</view>
					<view class="order_foot">
						<view class="label">
							<view class="tit">实际应付</view>
							<view class="txt" v-if="goodsScoreStatus">{{orderData.total_score}}积分</view>
							<view class="txt" v-else>¥{{orderData.total_money}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<paypalType :paypalShow="paypalShow" :money="userData.moneys" :countDownTime="orderData.count_down_time" @close="paypalShow=false" @paypal="getPaypalOrder"></paypalType>
		
		<view class="seat_box">
			<view class="seat"></view>
		</view>
		<view class="footer box_shadow">
			<view class="label">
				<view v-if="orderData.order_id" class="button" @click="getPaypalOrder()" :style="{backgroundColor: '#F54319'}">
					<span>请在</span>
					<u-count-down :time="orderData.count_down_time" format="mm:ss"></u-count-down>
					<span>内完成支付</span>
				</view>
				<view v-else class="button" @click="paypalOrderTap('form')" :style="{backgroundColor: '#F54319', opacity: orderData.goods_number?1:0.4}">
					<span v-if="orderType==='pintuan'">确认支付并{{pintuanId?'参团':'开团'}}</span>
					<span v-else>确认下单并{{goodsScoreStatus?'兑换':'支付'}}</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				shopInfoData: uni.getStorageSync('__ddminiShopInfo'),
				shopCartList: uni.getStorageSync('__ddminiShopCart'),
				goodsTotal: -1,
				cardNumTotal: 0,
				couponsIndex: -1,
				couponsList: [],
				addressData: '',
				orderData: {
					goods_score: 0,
					goods_number: 0,
					goods_money: 0,
					total_money: 0,
					total_score: 0
				},
				goodsOrderList: [],
				deliveryType: 1,
				userPhoneNumber: '',
				orderType: '',
				pintuanId: '',
				goodsScoreStatus: false,
				paypalShow: false,
				userData: ''
			}
		},
		onLoad(e) {
			let self = this;
			let cart = self.shopCartList;
			let nums = 0;
			let mony = 0;
			let goods = [];
			if(e.type){
				self.orderType = e.type;
			}
			if(e.pintuanId){
				self.pintuanId = e.pintuanId;
			}
			cart.forEach(itm => {
				nums += itm.num;
				mony += itm.mini_price * itm.num;
				goods.push({
					id: itm.id,
					spec: itm.spec_id,
					num: itm.num
				});
				if(itm.ctype==='score'){
					self.goodsScoreStatus = true;
				}
			})
			self.cardNumTotal = nums;
			self.goodsTotal = mony;
			self.goodsOrderList = goods;
			uni.$on('selectAddress', function(data){
				if(data){
					self.addressData = data;
				}else{
					self.getAddressList(self.addressData.id);
				}
			})
			self.getAddressList();
			self.getUserInfo();
		},
		methods: {
			getUserInfo(){
				let self = this;
				self.Get(self.Url.userInfo).then(res => {
					if(res.code === 0){
						self.userData = res.data;
						self.userPhoneNumber = res.data.phone;
					}
				})
			},
			provinceText(text){
				if(text){
					let str = text.replace(/,/g, '');
					return str
				}
			},
			specNameText(data){
				let list = Object.keys(data);
				let str = '';
				list.forEach((itm, idx) => {
					str += `${data[itm]}${(idx+1)===list.length?'':','}`
				})
				return str
			},
			getCouponsUserList() {
				let self = this;
				self.Get(self.Url.couponsUserList, {status: 1, goods: self.goodsListId}).then(res => {
					if(res.code === 0){
						let list = res.data.filter(itm => self.goodsTotal >= itm.min_money);
						self.couponsList = list;
						if(list.length>0){
							self.couponsIndex = 0;
						}
						self.paypalOrderTap();
					}
				})
			},
			getAddressList(id) {
				let self = this;
				let postData = {};
				if(id){
					postData.id = id;
				}else{
					postData.default = true;
				}
				self.Get(self.Url.addressList, postData).then(res => {
					if(res.code === 0){
						let data = res.data;
						if(data.length>0){
							self.addressData = data[0];
							self.userPhoneNumber = self.userPhoneNumber||data[0].phone;
						}
						self.getCouponsUserList();
					}
				})
			},
			selectCouponsTap(index){
				let self = this;
				if(index===self.couponsIndex){
					self.couponsIndex = -1;
				}else{
					self.couponsIndex = index;
				}
				self.paypalOrderTap();
			},
			paypalOrderTap(e){
				let self = this;
				let fzid = uni.getStorageSync('__ddminiFenzUid');
				let store = uni.getStorageSync('__ddminiStoreInfo');
				uni.showLoading({title: '订单准备中',mask: true});
				if(self.deliveryType===1 && !self.addressData){
					uni.showModal({
						title: '订单提示',
						content: '还没有收货地址，请先选择或添加收货地址！',
						confirmText: '选择地址',
						success(res) {
							if(res.confirm){
								uni.navigateTo({url: '/pages/user/addressList?type=select'});
							}
						}
					})
					uni.hideLoading();
					return
				}else if(self.deliveryType===2 && !self.userPhoneNumber && e==='form'){
					uni.showModal({
						title: '订单提示',
						content: '请输入联系电话'
					})
					uni.hideLoading();
					return
				}
				let postData = {
					goods: self.goodsOrderList,
					delivery_type: self.deliveryType,
					yprint: true,
					store: store.id
					// remark: self.remarkText
				}
				if(e!='form'){
					postData.calculate = true;
				}
				if(self.deliveryType===1){
					postData.address_id = self.addressData.id;
				}else{
					postData.user_phone = self.userPhoneNumber;
				}
				if(self.couponsIndex>=0){
					postData.coupons_id = self.couponsList[self.couponsIndex].id;
				}
				if(fzid){
					postData.profitsharing = fzid;
				} 
				if(self.orderType==='pintuan'){
					postData.pintuan_order = true;
					if(self.pintuanId){
						postData.pintuan_id = self.pintuanId;
					}
				}
				self.Post(self.Url.orderCreate, postData).then(res => {
					uni.hideLoading();
					if(res.code === 0){
						let data = res.data;
						if(e==='form'){
							data.count_down_time = data.order_time_stamp - new Date().getTime();
							self.orderData = data;
							if(!self.goodsScoreStatus){
								self.paypalShow = true;
							}else{
								uni.showToast({title: '积分支付成功'});
								setTimeout(function () {
									uni.switchTab({url: '/pages/user/index?order=-1'});
								}, 600);
							}
						}else{
							self.orderData = data;
						}
					}else{
						uni.showModal({
							title: '订单提示',
							content: res.msg,
							showCancel: false
						});
						return
					}
				});
			},
			getPaypalOrder(type) {
				let self = this;
				// pay_type
				// 1 微信支付
				// 2 货到付款
				// 3 余额支付
				let postData = {
					pay_type: type,
					order_id: self.orderData.order_id,
					platform: 1,
				}
				uni.showLoading({title: '支付准备中',mask: true});
				self.Get(self.Url.orderPaypal, postData).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						uni.requestPayment({
						    provider: 'wxpay',
						    timeStamp: res.data.wechat.timeStamp,
						    nonceStr: res.data.wechat.nonceStr,
						    package: res.data.wechat.package,
						    signType: res.data.wechat.signType,
						    paySign: res.data.wechat.paySign,
						    success: function (res) {
								uni.showToast({title: '微信支付成功'});
								setTimeout(function () {
									uni.switchTab({url: '/pages/user/index?order=-1'});
								}, 600);
						    },
						    fail: function (err) {
						        uni.showModal({
						        	title: '支付失败',
									content: '订单支付失败，请重新进行支付。如对订单金额有疑问请联系客服人员',
									showCancel: false
						        })
								return
						    }
						});
					}else{
						uni.hideLoading();
						uni.showModal({
							title: '支付失败',
							content: res.msg,
							showCancel: false
						})
					}
				})
			},
			getBindWechatPhoneTap(e){
				let self = this;
				uni.login({
					provider:"weixin",
					success(les) {
						let postData = {
							iv: e.detail.iv,
							code: les.code,
							encryptedData: e.detail.encryptedData,
						}
						self.Post(self.Url.userBindWechat, postData).then(res => {
							if(res.code === 0){
								self.getUserInfo();
							}else{
								uni.showModal({
									title: '绑定失败',
									content: res.msg,
									showCancel: false
								})
							}
						})
					}
				})
			},
			getPathTap(path){
				uni.navigateTo({url: path});
			}
		}
	}
</script>

<style lang="less">
	.menu_box{
		width: 100%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		.head{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100rpx;
			width: 90%;
			margin: 0 auto;
			.left{
				color: #1c1c1c;
				font-size: 30rpx;
				font-weight: bold;
				line-height: 30rpx;
				display: flex;
				align-items: center;
			}
			.right{
				color: #999;
				display: flex;
				align-items: center;
				font-size: 26rpx;
				line-height: 26rpx;
			}
		}
		.delivery_box{
			width: 90%;
			margin: 0 auto;
			padding: 10rpx 0 50rpx;
			/deep/.u-radio{
				flex: 1;
			}
		}
		.phone_box{
			width: 90%;
			margin: 0 auto;
			padding: 10rpx 0 50rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			.input{
				flex: 1;
				height: 70rpx;
				border: 1px solid #eee;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				input{
					width: 92%;
					color: #1c1c1c;
					font-size: 30rpx;
					height: 100%;
				}
			}
			.btn{
				color: #F54319;
				border: 1px solid #F54319;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 20rpx;
				font-size: 28rpx;
				border-radius: 10rpx;
				margin-left: 20rpx;
				position: relative;
				button{
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					opacity: 0;
				}
			}
		}
		.address_box{
			width: 90%;
			margin: 0 auto;
			padding-bottom: 30rpx;
			.address{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left{
					flex: 1;
					min-width: 0;
					.tit{
						color: #1c1c1c;
						font-size: 32rpx;
						span{
							color: #666;
							padding-left: 20rpx;
							font-size: 28rpx;
						}
					}
					.txt{
						font-size: 28rpx;
						color: #666;
						padding-top: 10rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				.right{
					width: 80rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}
			}
			.none_address{
				width: 100%;
				height: 150rpx;
				border: 1px dashed #e5e5e5;
				border-radius: 10rpx;
				color: #bbb;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				span{
					font-size: 26rpx;
				}
			}
		}
		.goods_box{
			padding-bottom: 2rpx;
			.goods{
				width: 90%;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 40rpx;
				.left{
					width: 200rpx;
					image{
						width: 180rpx;
						height: 180rpx;
						border-radius: 20rpx;
					}
				}
				.right{
					flex: 1;
					min-width: 0;
					height: 170rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.title{
						color: #1c1c1c;
						font-size: 30rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.text{
						color: #999;
						font-size: 28rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.price{
						display: flex;
						align-items: center;
						justify-content: space-between;
						.num{
							color: #f14b5b;
							font-size: 34rpx;
							font-weight: bold;
							display: flex;
							align-items: center;
							span{
								font-size: 28rpx;
								padding-left: 2rpx;
							}
						}
						.buy{
							color: #F54319;
							padding: 0 10rpx;
							border-radius: 10rpx;
							font-size: 28rpx;
							font-weight: bold;
						}
					}
				}
			}
		}
		
		.coupons_box{
			padding: 0 0 20rpx;
			.label{
				width: 90%;
				height: 120rpx;
				margin: 0 auto;
				border: 1px solid #f5f5f5;
				border-radius: 20rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				.price{
					width: 150rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #f14b5b;
					font-size: 38rpx;
					font-weight: bold;
					line-height: 38rpx;
					span{
						font-size: 24rpx;
						padding-left: 2rpx;
						margin-bottom: -4rpx;
					}
				}
				.info{
					flex: 1;
					min-width: 0;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.title{
						color: #1c1c1c;
						font-size: 30rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.text{
						font-size: 26rpx;
						color: #999;
						padding-top: 4rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				.button{
					width: 110rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
		
		.order_info_box{
			.order_head{
				width: 90%;
				margin: 0 auto;
				.label{
					display: flex;
					align-items: center;
					padding-bottom: 30rpx;
					justify-content: space-between;
					font-size: 28rpx;
					color: #999;
				}
			}
			.order_foot{
				border-top: 1px solid #f5f5f5;
				.label{
					display: flex;
					align-items: center;
					width: 90%;
					margin: 0 auto;
					justify-content: space-between;
					height: 100rpx;
					font-weight: bold;
					font-size: 30rpx;
				}
			}
		}
	}
	
	.pay_type_box{
		width: 92%;
		margin: 0 auto;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 20rpx;
		height: 100rpx;
		.icons{
			width: 100rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.title{
			flex: 1;
			color: #1c1c1c;
			font-size: 28rpx;
		}
		.right{
			width: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
	}
	
	.footer{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 100;
		background-color: #fff;
		padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		.label{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 120rpx;
			width: 100%;
			.button{
				width: 92%;
				margin: 0 auto;
				height: 80rpx;
				border-radius: 100rpx;
				color: #fff;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				/deep/.u-count-down__text{
					color: #fff;
					line-height: 30rpx;
					padding: 0 4rpx;
				}
			}
		}
	}
</style>
