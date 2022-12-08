<template>
	<view>
		<u-popup :show="paypalShow" mode="bottom" :round="10" @close="close()">
			<view class="showBox">
				<view class="pheader">请选择支付方式</view>
				<view class="payTime" v-if="countDownTime">
					<view class="time_box">
						剩余支付时间：<u-count-down :time="countDownTime" format="HH:mm:ss"></u-count-down>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="paypalList">
					<view class="paypal" v-for="(item, index) in shopData.shop_paypal" v-if="item.lid!=5" :key="index" @click="getPaypalOrder(item.lid)">
						<view class="left">
							<aicon v-if="item.lid==1" type="weixin1" size="30" color="#00c250"></aicon>
							<aicon v-else-if="item.lid==2" type="deliver_fill" size="30" color="#ff9900"></aicon>
							<aicon v-else-if="item.lid==3" type="moneybagfill" size="30" color="#ff2a36"></aicon>
						</view>
						<view class="right">
							<view class="title">{{item.cname}}</view>
							<view v-if="item.lid==1" class="info">简单快捷，推荐使用</view>
							<view v-if="item.lid==2" class="info">购物零风险，更安全</view>
							<view v-if="item.lid==3" class="info">可用余额：¥{{money}}</view>
						</view>
						<view class="icon">
							<aicon type="unfold-copy" size="18" color="#e2e2e2"></aicon>
						</view>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="paypalList">
					<view class="paypal" v-for="(item, index) in shopData.shop_paypal" v-if="item.lid!=5 && item.lid!=1" :key="index" @click="getPaypalOrder(item.lid)">
						<view class="left">
							<aicon v-if="item.lid==1" type="weixinzhifu" size="30" color="#00c250"></aicon>
							<aicon v-else-if="item.lid==2" type="undelivery_fill" size="30" color="#ff9900"></aicon>
							<aicon v-else-if="item.lid==3" type="yue" size="30" color="#ff2a36"></aicon>
						</view>
						<view class="right">
							<view class="title">{{item.cname}}</view>
							<view v-if="item.lid==1" class="info">简单快捷，推荐使用</view>
							<view v-if="item.lid==2" class="info">购物零风险，更安全</view>
							<view v-if="item.lid==3" class="info">可用余额：¥{{money}}</view>
						</view>
						<view class="icon">
							<aicon type="right" size="18" color="#e2e2e2"></aicon>
						</view>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</u-popup>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		name: 'paypalType',
		props: {
			paypalShow: {
				type: Boolean,
				default: false
			},
			countDownTime: {
				type: Number,
				default: 0
			},
			money: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				shopData: uni.getStorageSync('__ddminiShopInfo'),
			}
		},
		methods: {
			close(){
				this.$emit('close', false);
			},
			getPaypalOrder(id){
				this.$emit('paypal', id);
			}
		}
	}
</script>

<style lang="less">
	.showBox{
		.pheader{
			font-size: 32rpx;
			color: #1f1f1f;
			font-weight: b;
			width: 1;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.payTime{
			display: flex;
			align-items: center;
			justify-content: center;
			.time_box{
				width: 360rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 28rpx;
				background-color: #ff2a36;
				border-radius: 6rpx;
				/deep/.u-count-down__text{
					color: #fff;
				}
			}
		}
		.paypalList{
			padding-top: 30rpx;
			width: 100%;
			padding-bottom: 100rpx;
			.paypal{
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 90%;
				margin: 0 auto;
				position: relative;
				padding: 20rpx 0;
				.left{
					flex-basis: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.right{
					flex: 1;
					min-width: 0;
					.title{
						color: #1f1f1f;
						font-size: 28rpx;
						font-weight: bold;
					}
					.info{
						color: #999;
						font-size: 28rpx;
						padding-top: 6rpx;
					}
				}
				.icon{
					flex-basis: 80rpx;
					display: flex;
					justify-self: flex-end;
					align-items: center;
				}
			}
		}
	}
</style>