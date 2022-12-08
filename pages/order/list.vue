<template>
	<view class="content">
		<view class="head_box box_shadow">
			<view class="label" :class="{alabel: orderActive===item.id}" v-for="(item, index) in orderMenu" :key="index" @click="selectMenuTap(item.id)">
				<view class="tit" :style="{borderColor: orderActive===item.id?'#F54319':'#fff'}">{{item.name}}</view>
			</view>
		</view>
		<view class="order_list_box">
			<view class="order box_shadow" v-for="(item, index) in orderList" :key="index" @click="getDetailsTap(item.id)">
				<view class="head">
					<view class="left">
						{{diaplayTime(item.create_time)}}下单
						<span v-if="item.pintuan_order" class="tag">团</span>
					</view>
					<view class="right">
						<span v-if="item.order_status===0">待支付</span>
						<span v-else-if="item.order_status===1 && item.pintuan_order && item.pintuan_status===1">拼团中</span>
						<span v-else-if="item.order_status===1">待发货</span>
						<span v-else-if="item.order_status===2">待收货</span>
						<span v-else-if="item.order_status===3">已完成</span>
						<span v-else-if="item.order_status===4 && !item.paypal_type">已过期</span>
						<span v-else-if="item.order_status===4 && item.paypal_type">已关闭</span>
					</view>
				</view>
				<view class="goods_box">
					<view class="goods" v-for="(itm, idx) in item.goods_list" :key="idx">
						<view class="left">
							<image :src="itm.goods_pic" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="title">{{itm.goods_title}}</view>
							<view class="text">{{specNameText(itm.goods_spec_name)}}</view>
							<view class="box">
								<view class="num">{{itm.goods_price}}<span>元</span></view>
								<view class="buy">x{{itm.buy_num}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="foot">
					<view class="left">实际支付：<span :style="{color: '#F54319'}">{{item.total_money}}元</span></view>
					<view class="right">
						<view v-if="item.order_status===0" :style="{backgroundColor: '#F54319', borderColor: '#F54319', color: '#fff'}" @click.stop="[paypalOrder=item.id, paypalShow=true]" class="button">
							<span>立即支付</span>
							<u-count-down :time="totalCountDown(item.close_time_stamp)" format="mm:ss"></u-count-down>
						</view>
						<view v-else-if="item.order_status===1" class="button">联系客服<button open-type="contact"></button></view>
						<view v-else-if="item.order_status===2" :style="{backgroundColor: '#F54319'}" @click.stop="confirmOrder(item.id)" class="button">确认收货</view>
						<view v-else-if="item.order_status===4" @click.stop="getOrderDel(index)" class="button">删除订单</view>
					</view>
				</view>
			</view>
			
			<view class="none_list_box" v-if="orderList.length===0">
				<image src="../../static/images/none_data_icon_02.png" mode="widthFix"></image>
				<span>暂无相关订单</span>
			</view>
		</view>
		
		<view class="seat_box">
			<view class="seat"></view>
		</view>
		
		<paypalType :paypalShow="paypalShow" :money="userData.moneys" @close="paypalShow=false" @paypal="getPaypalOrder"></paypalType>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				paypalShow: false,
				userData: '',
				paypalOrder: '',
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				orderMenu: [{
					id: -1,
					name: '全部'
				}, {
					id: 0,
					name: '待支付'
				}, {
					id: 1,
					name: '待发货'
				}, {
					id: 2,
					name: '待收货'
				}, {
					id: 3,
					name: '已完成'
				}],
				orderActive: -1,
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
				orderList: []
			}
		},
		onLoad(e) {
			let self = this;
			if(e.status){
				self.orderActive = Number(e.status);
			}
		},
		onShow() {
			let self = this;
			self.orderPage.page = 1;
			self.orderList = [];
			self.getOrderList();
			self.getUserInfo();
		},
		onReachBottom() {
			let self = this;
			if(self.orderPage.total>self.orderPage.page){
				self.orderPage.page++;
				self.getOrderList();
			}
		},
		methods: {
			getUserInfo(){
				let self = this;
				self.Get(self.Url.userInfo).then(res => {
					if(res.code === 0){
						self.userData = res.data;
					}
				})
			},
			specNameText(data){
				if(data){
					let list = Object.keys(data);
					let str = '';
					list.forEach((itm, idx) => {
						str += `${data[itm]}${(idx+1)===list.length?'':','}`
					})
					return str
				}
			},
			totalCountDown(time){
				let date = new Date().getTime();
				return time - date
			},
			getOrderList(){
				let self = this;
				let postData = {
					order_type: 1,
					status: self.orderActive,
					page: self.orderPage.page,
					sizes: self.orderPage.sizes,
					// pintuan_status: 3
				}
				self.Get(self.Url.orderList, postData).then(res => {
					if(res.code === 0){
						self.orderPage.total = res.data.page;
						let data = res.data.list;
						if(self.orderList.length>0){
							let list = self.orderList.concat(data);
							self.orderList = list;
						}else{
							self.orderList = data;
						}
					}
				})
			},
			selectMenuTap(id){
				let self = this;
				self.orderActive = id;
				self.orderPage.page = 1;
				self.orderList = [];
				self.getOrderList();
			},
			getPaypalOrder(id) {
				let self = this;
				// pay_type
				// 1 微信支付
				// 2 货到付款
				// 3 余额支付
				let postData = {
					pay_type: id,
					order_id: self.paypalOrder,
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
								self.orderPage.page = 1;
								self.orderList = [];
								self.getOrderList();
						    },
						    fail: function (err) {
						        uni.showModal({
						        	title: '支付失败',
									content: '订单支付失败，请重新进行支付。如针对订单金额有疑问请联系客服人员',
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
			getOrderDel(index){
				let self = this;
				uni.showModal({
					title: '订单删除确认',
					content: '订单删除后不可恢复，是否继续删除？',
					success(ces){
						if(ces.confirm){
							let id = self.orderList[index].id;
							uni.showLoading({title: '准备删除中', mask: true});
							self.Get(self.Url.orderDel, {id: id}).then(res => {
								if(res.code === 0){
									uni.hideLoading();
									uni.showToast({title: '订单删除成功'});
									self.orderList.splice(index, 1);
								}else{
									uni.hideLoading();
									uni.showModal({
										title: '订单删除失败',
										content: res.msg,
										showCancel: false
									})
								}
							})
						}
					}
				})
			},
			confirmOrder(id) {
				let self = this;
				uni.showLoading({title: '确认收货中', mask: true});
				self.Get(self.Url.orderConfirm, {id: id}).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						uni.showToast({title: '确认收货成功'});
						self.orderPage.page = 1;
						self.orderList = [];
						self.getOrderList();
					}else{
						uni.hideLoading();
						uni.showModal({
							title: '确认收货失败',
							content: res.msg,
							showCancel: false
						})
					}
				});
			},
			getDetailsTap(id){
				uni.navigateTo({
					url: `/pages/order/details?id=${id}`
				})
			}
		}
	}
</script>

<style lang="less">
	.head_box{
		display: flex;
		align-items: center;
		height: 120rpx;
		background-color: #fff;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 100;
		.label{
			flex: 1;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.tit{
				color: #666;
				transition: all 0.2s;
				padding-top: 6rpx;
				border-bottom: 3px solid transparent;
				padding-bottom: 10rpx;
				font-size: 30rpx;
			}
		}
		.alabel{
			.tit{
				color: #1c1c1c;
				font-weight: bold;
				border-color: #00d389;
			}
		}
	}
	
	.order_list_box{
		width: 100%;
		min-height: 72vh;
		.order{
			width: 100%;
			margin: 0 auto;
			border-radius: 20rpx;
			background-color: #fff;
			margin-bottom: 30rpx;
			.head{
				display: flex;
				align-items: center;
				width: 92%;
				margin: 0 auto;
				height: 80rpx;
				justify-content: space-between;
				.left{
					color: #999;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					span{
						background-color: #F54319;
						color: #fff;
						font-size: 24rpx;
						width: 36rpx;
						height: 36rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 6rpx;
						margin-left: 20rpx;
						line-height: 36rpx;
					}
				}
			}
			.goods_box{
				width: 92%;
				margin: 0 auto;
				background-color: #f5f5f5;
				border-radius: 20rpx;
				.goods{
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					.left{
						width: 190rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 150rpx;
							height: 150rpx;
							border-radius: 20rpx;
							background-color: #fff;
						}
					}
					.right{
						flex: 1;
						min-width: 0;
						height: 150rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.title{
							color: #1c1c1c;
							font-size: 28rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							width: 95%;
						}
						.text{
							color: #666;
							font-size: 26rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							width: 95%;
						}
						.box{
							display: flex;
							align-items: center;
							justify-content: space-between;
							width: 95%;
							padding-top: 10rpx;
							.num{
								color: #1c1c1c;
								font-size: 30rpx;
								display: flex;
								align-items: center;
								span{
									font-size: 26rpx;
									padding-left: 2rpx;
								}
							}
							.buy{
								color: #1c1c1c;
								padding: 0 10rpx;
								border-radius: 10rpx;
							}
						}
					}
				}
			}
			.foot{
				width: 92%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100rpx;
				.left{
					color: #1c1c1c;
					font-size: 28rpx;
					span{
						font-weight: bold;
						color: #f14b5b;
					}
				}
				.right{
					flex: 1;
					display: flex;
					justify-content: flex-end;
					.button{
						border: 1px solid #e5e5e5;
						color: #666;
						font-size: 28rpx;
						padding: 0 20rpx;
						border-radius: 100rpx;
						line-height: 28rpx;
						display: flex;
						align-items: center;
						height: 50rpx;
						position: relative;
						button{
							position: absolute;
							width: 100%;
							height: 100%;
							top: 0;
							left: 0;
							opacity: 0;
						}
						/deep/.u-count-down__text{
							font-size: 28rpx;
							color: #fff;
							padding-left: 4rpx;
						}
					}
				}
			}
		}
	}
</style>
