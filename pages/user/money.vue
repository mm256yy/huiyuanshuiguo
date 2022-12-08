<template>
	<view class="content">
		<view class="headerBox">
			<view class="title">可用余额</view>
			<view class="money"><text>¥</text>{{userDetails.moneys}}</view>
			<view class="tips" @click="getRecordTap()">充值&消费记录</view>
		</view>
		<view class="moneyBox">
			<view class="header">余额充值</view>
			<view v-if="ruleList.length>0" class="radioBox">
				<radio-group class="listBox" @change="radioChange">
					<label class="list" v-for="(item, index) in ruleList" :key="index">
						<view class="title">¥{{item.recharge}}</view>
						<view class="info"><text>送</text>¥{{item.moneys}}</view>
						<radio :checked="moneyNumber==item.recharge?true:false" :value="item.recharge" :color="template.color.temp_color"/>
					</label>
				</radio-group>
			</view>
			<view class="other">
				<view class="title">其它</view>
				<input type="digit" v-model="moneyNumber" placeholder="请输入充值金额" />
				<view class="info">元</view>
			</view>
			<view class="button" @click="getRechargeOrder()">确认充值</view>
		</view>



	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				userDetails: {
					moneys: 0,
					score: 0
				},
				moneyNumber: '',
				ruleList: [],
				rechargeOrder: ''
			}
		},
		onLoad() {
			let self = this;
			self.getRechargeList();
			self.getUserDetails();

		},
		methods: {
			getRechargeList() {
				let self = this;
				self.Get(self.Url.rechargeList, {}).then(res => {
					if(res.code === 0){
						self.ruleList = res.data;
					}
				})
			},
			getUserDetails() {
				let self = this;
				if (app.globalData.user) {
					self.Get(self.Url.userInfo, {}).then(res => {
						if (res.code === 0) {
							self.userDetails = res.data;
						}
					})
				}
			},
			radioChange(e) {
				this.moneyNumber = e.detail.value;
			},
			getRechargeOrder() {
				let self = this;
				let money = self.moneyNumber;
				if(money){
					uni.showLoading({title: '请稍等...'});
					self.Get(self.Url.rechargeOrder, {money: self.moneyNumber}).then(res => {
						if(res.code === 0){
							self.rechargeOrder = res.data;
							let postData = {
								order_id: res.data.order_id,
								pay_type: 1,
								platform: 1,
								type: 3
							}
							self.Get(self.Url.orderPaypal, postData).then(res => {
								uni.hideLoading();
								if(res.code === 0){
									uni.requestPayment({
									    provider: 'wxpay',
									    timeStamp: res.data.wechat.timeStamp,
									    nonceStr: res.data.wechat.nonceStr,
									    package: res.data.wechat.package,
									    signType: res.data.wechat.signType,
									    paySign: res.data.wechat.paySign,
									    success: function (res) {
											uni.showToast({title: '微信支付成功'});
											self.moneyNumber = '';
											self.getUserDetails();
									    },
									    fail: function (err) {
									        uni.showModal({
									        	title: '支付失败',
												content: '支付失败，请重新进行支付!',
												showCancel: false
									        })
											return
									    }
									});
								}
							})
						}else{
							uni.hideLoading();
							uni.showToast({title: res.msg, icon: 'none'});
						}
					})
				}else{
					uni.showToast({title: '请输入充值金额', icon: 'none'});
				}
			},
			getRecordTap() {
				uni.navigateTo({url: '/pages/user/record'});
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #FFFFFF;
	}
	.headerBox {
		width: 100%;
		height: 300rpx;
		background-color: #FF633D;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
		position: relative;
		justify-content: center;

		.title {
			font-size: 28rpx;
		}

		.money {
			font-size: 80rpx;
			font-weight: bold;
			display: flex;
			align-items: flex-end;
			padding-bottom: 20rpx;

			text {
				font-size: 40rpx;
				padding-right: 8rpx;
				padding-bottom: 20rpx;
			}
		}
		.tips{
			color: #fff;
			font-size: 26rpx;
			position: absolute;
			bottom: 30rpx;
			opacity: .6;
		}
	}

	.moneyBox {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		justify-content: center;

		.header {
			color: #1f1f1f;
			width: 100%;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-weight: bold;
		}

		.listBox {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin: 0 auto;
			width: 85%;
			justify-content: space-between;

			.list {
				width: 280rpx;
				display: flex;
				flex-direction: column;
				border: 2rpx solid #efefef;
				margin-bottom: 30rpx;
				justify-content: center;
				padding-left: 20rpx;
				position: relative;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				border-radius: 10rpx;

				.title {
					font-size: 36rpx;
					color: #F54319;
					font-weight: bold;
				}

				.info {
					color: #999;
					font-size: 28rpx;
					display: flex;
					align-items: center;

					text {
					    font-size: 26rpx;
					    padding-right: 4rpx;
					}
				}

				radio {
					position: absolute;
					right: 20rpx;
					zoom: 0.8;
				}
			}
		}

		.other {
			width: 85%;
			display: flex;
			border: 2rpx solid #efefef;
			height: 80rpx;
			align-items: center;
			margin: 0 auto;
			border-radius: 10rpx;

			.title {
				width: 120rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #1f1f1f;
				height: 100%;
				background-color: #efefef;
			}

			input {
				flex: 1;
				height: 100%;
				display: flex;
				padding-left: 20rpx;
				color: #1f1f1f;
			}

			.info {
				width: 100rpx;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #1f1f1f;
				background-color: #efefef;
			}
		}

		.button {
			width: 85%;
			height: 90rpx;
			margin: 0 auto;
			background-color: #F54319;
			color: #fff;
			margin-top: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			font-weight: bold;
			position: relative;
			border-radius: 10rpx;

			button {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				opacity: 0;
			}
		}
	}
</style>
