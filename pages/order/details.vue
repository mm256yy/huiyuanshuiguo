<template>
	<view class="content" :style="{backgroundColor: template.color.back_color}">
		<view class="details_box" v-if="orderDetail">
			<view v-if="orderDetail.order_status===0" class="order_head_box">
				<view class="status">
					<aicon type="timefill" :color="template.color.price_color" size="35"></aicon>
					<span>待支付</span>
				</view>
				<view class="text">
					<span>请在</span>
					<u-count-down :time="totalCountDown(orderDetail.close_time_stamp)" format="mm:ss"></u-count-down>
					<span>内完成支付，否则订单将自动取消</span>
				</view>
			</view>
			<view v-else-if="orderDetail.pintuan_order && orderDetail.pintuan_status===1" class="order_head_box">
				<view class="status">
					<aicon type="pintuan" :color="template.color.price_color" size="35"></aicon>
					<span>拼团中</span>
				</view>
				<view class="text">
					<span>如拼团失败会自动退款</span>
				</view>
			</view>
			<view v-else-if="orderDetail.order_status===1 || orderDetail.order_status===2" class="order_head_box">
				<view class="status">
					<aicon type="deliver_fill" :color="template.color.price_color" size="35"></aicon>
					<span>{{orderDetail.order_status===1?'待发货':'待收货'}}</span>
				</view>
				<view class="text">
					<span v-if="orderDetail.order_status===1">订单正在备货中，请耐心等待发货</span>
					<span v-else>订单已发货，请注意接听快递来电</span>
				</view>
			</view>
			<view v-else-if="orderDetail.order_status===3" class="order_head_box">
				<view class="status">
					<aicon type="roundcheckfill" :color="template.color.price_color" size="35"></aicon>
					<span>已完成</span>
				</view>
				<view class="text">
					<span>订单已完成，期待您的下次光临</span>
				</view>
			</view>
			<view v-else-if="orderDetail.order_status===4" class="order_head_box">
				<view class="status">
					<aicon type="roundclosefill" :color="template.color.price_color" size="35"></aicon>
					<span v-if="orderDetail.paypal_type">已关闭</span>
					<span v-else>已过期</span>
				</view>
				<view class="text">
					<span v-if="orderDetail.paypal_type">订单已关闭，如有退款将会原路退回</span>
					<span v-else>订单因超时未支付，已被自动取消</span>
				</view>
			</view>
			
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>商品信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="goods_box">
					<view class="goods" v-for="(item, index) in orderDetail.goods_list" :key="index">
						<view class="left">
							<image :src="item.goods_pic" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="title">{{item.goods_title}}</view>
							<view class="text" v-if="item.goods_spec_name">{{specNameText(item.goods_spec_name)}}</view>
							<view class="price">
								<view class="num">{{item.goods_price}}<span>元</span></view>
								<view class="buy">x{{item.buy_num}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>收件信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="info_box">
					<view class="label">
						<view class="tit">姓名</view>
						<view class="txt">{{orderDetail.address_data.cname}}</view>
					</view>
					<view class="label">
						<view class="tit">电话</view>
						<view class="txt">{{orderDetail.address_data.phone}}</view>
					</view>
					<view class="label">
						<view class="tit">地址</view>
						<view class="txt">{{provinceText(orderDetail.address_data.province)}}{{orderDetail.address_data.address}}</view>
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
				<view class="info_box" style="padding-bottom: 0;">
					<view class="label">
						<view class="tit">商品合计</view>
						<view class="txt">¥{{orderDetail.goods_total}}</view>
					</view>
					<view class="label" v-if="orderDetail.coupons_money">
						<view class="tit">优惠抵扣</view>
						<view class="txt">-¥{{orderDetail.coupons_money}}</view>
					</view>
					<view class="label" v-if="orderDetail.user_money">
						<view class="tit">会员折扣</view>
						<view class="txt">-¥{{orderDetail.user_money}}</view>
					</view>
					<view class="label" v-if="orderDetail.freight_money">
						<view class="tit">运费</view>
						<view class="txt">¥{{orderDetail.freight_money}}</view>
					</view>
					<view class="order_foot">
						<view class="label">
							<view class="tit">实际应付</view>
							<view class="txt">¥{{orderDetail.total_money}}</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>订单信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="info_box">
					<view class="label">
						<view class="tit">订单状态</view>
						<view class="txt">
							<span v-if="orderDetail.order_status==0">待付款</span>
							<span v-else-if="orderDetail.pintuan_order && orderDetail.pintuan_status===1">等待成团中</span>
							<span v-else-if="orderDetail.order_status==1">待发货</span>
							<span v-else-if="orderDetail.order_status==2">待收货</span>
							<span v-else-if="orderDetail.order_status==3">已完成</span>
							<span v-else-if="orderDetail.order_status==4 && !orderDetail.paypal_type">已过期</span>
							<span v-else-if="orderDetail.order_status==4 && orderDetail.paypal_type">已关闭</span>
						</view>
					</view>
					<view class="label" v-if="orderDetail.paypal_type">
						<view class="tit">支付方式</view>
						<view class="txt">
							<span v-if="orderDetail.paypal_type==1">微信支付</span>
							<span v-else-if="orderDetail.paypal_type==2">货到付款</span>
							<span v-else-if="orderDetail.paypal_type==3">余额支付</span>
							<span v-else-if="orderDetail.paypal_type==4">线下支付</span>
						</view>
					</view>
					<view class="label" v-if="orderDetail.paypal_time">
						<view class="tit">支付时间</view>
						<view class="txt">{{orderDetail.paypal_time}}</view>
					</view>
					<view class="label">
						<view class="tit">下单时间</view>
						<view class="txt">{{orderDetail.create_time}}</view>
					</view>
					<view class="label">
						<view class="tit">订单编号</view>
						<view class="txt">{{orderDetail.order_number}}</view>
					</view>
				</view>
			</view>
			
			
			
		</view>
		
		<view class="seat_box">
			<view class="seat"></view>
		</view>
		<view v-if="orderDetail && orderDetail.order_status!=3 && orderDetail.pintuan_status!=1" class="footer box_shadow">
			<view class="label">
				<view v-if="orderDetail.order_status===0" class="button" @click="paypalShow=true" :style="{backgroundColor: template.color.temp_color}">立即支付</view>
				<view v-else-if="orderDetail.order_status===1" class="button">联系客服<button open-type="contact"></button></view>
				<view v-else-if="orderDetail.order_status===2" @click="confirmOrder()" class="button">确认收货</view>
				<view v-else-if="orderDetail.order_status===4" :style="{backgroundColor: template.color.back_color, color: template.color.temp_color}" @click="getOrderDel()" class="button">删除订单</view>
			</view>
		</view>
		
		<paypalType :paypalShow="paypalShow" :money="userData.moneys" @close="paypalShow=false" @paypal="getPaypalOrder"></paypalType>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				id: '',
				orderDetail: '',
				paypalShow: '',
				userData: ''
			}
		},
		onLoad(e) {
			let self = this;
			self.id = e.id;
			self.getOrderDetail();
			self.getUserInfo();
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
			totalCountDown(time){
				let date = new Date().getTime();
				return time - date
			},
			getOrderDetail(){
				let self = this;
				uni.showLoading({title: '订单加载中',mask: true});
				self.Get(self.Url.orderDetail, {id: self.id}).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						self.orderDetail = res.data;
					}else{
						uni.hideLoading();
						uni.showModal({
							content: '订单已被删除，请重试',
							showCancel: false,
							success(ces){
								if(ces.confirm){
									uni.navigateBack();
								}
							}
						})
					}
				})
			},
			getPaypalOrder(type) {
				let self = this;
				let id = self.orderDetail.id;
				// pay_type
				// 1 微信支付
				// 2 货到付款
				// 3 余额支付
				let postData = {
					pay_type: type,
					order_id: id,
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
								self.getOrderDetail();
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
			confirmOrder() {
				let self = this;
				let id = self.orderDetail.id;
				uni.showLoading({title: '确认收货中', mask: true});
				self.Get(self.Url.orderConfirm, {id: id}).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						uni.showToast({title: '确认收货成功'});
						self.getOrderDetail();
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
			getOrderDel(){
				let self = this;
				uni.showModal({
					title: '订单删除确认',
					content: '订单删除后不可恢复，是否继续删除？',
					success(ces){
						if(ces.confirm){
							let id = self.orderDetail.id;
							uni.showLoading({title: '准备删除中', mask: true});
							self.Get(self.Url.orderDel, {id: id}).then(res => {
								if(res.code === 0){
									uni.hideLoading();
									uni.showToast({title: '订单删除成功'});
									self.$nextTick(function(){
										uni.navigateBack();
									})
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
			}
		}
	}
</script>

<style lang="less">
	.details_box, .content{
		min-height: 100vh;
	}
	.order_head_box{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
		.status{
			display: flex;
			align-items: center;
			color: #1c1c1c;
			font-size: 42rpx;
			font-weight: bold;
			line-height: 70rpx;
			aicon{
				width: 70rpx;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			span{
				padding-left: 10rpx;
			}
		}
		.text{
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #666;
			padding-top: 20rpx;
			/deep/.u-count-down__text{
				font-size: 26rpx;
				color: #666;
				padding: 0 4rpx;
			}
		}
	}
	
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
		
		.goods_box{
			padding-bottom: 30rpx;
			.goods{
				width: 90%;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left{
					width: 180rpx;
					image{
						width: 160rpx;
						height: 160rpx;
						border-radius: 20rpx;
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
							color: #1c1c1c;
							font-size: 32rpx;
							display: flex;
							align-items: center;
							span{
								font-size: 28rpx;
								padding-left: 2rpx;
							}
						}
						.buy{
							color: #1c1c1c;
							font-size: 28rpx;
						}
					}
				}
			}
		}
		
		.info_box{
			padding: 10rpx 0 20rpx;
			.label{
				width: 90%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 30rpx;
				margin-bottom: 30rpx;
				color: #666;
				.tit{
					width: 130rpx;
					color: #666;
				}
				.txt{
					flex: 1;
					min-width: 0;
					text-align: right;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #1c1c1c;
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
					margin-bottom: 0;
					.tit{
						color: #1c1c1c;
					}
				}
			}
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
	}
</style>
