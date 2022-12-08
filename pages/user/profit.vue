<template>
	<view class="content">
		<view class="headerBox">
			<view class="label">
				<view class="number" :style="'color:'+template.color.color1"><span>¥</span>{{profitsharingData.money}}</view>
				<view class="text" :style="'color:'+template.color.color3">总推广金额</view>
			</view>
			<view class="label">
				<view class="number" :style="'color:'+template.color.color1">{{profitsharingData.total}}</view>
				<view class="text" :style="'color:'+template.color.color3">总推广次数</view>
			</view>
			<view class="tips" @click="getFenzhangCodeTap()"><aicon size="13" type="information-line"></aicon>推广说明</view>
		</view>
		<view class="tabelBox" v-if="profitsharingData.list.length>0">
			<view class="tips" :style="'color:'+template.color.color5">Tips：点击对应行可复制推广订单号</view>
			<view class="theader">
				<view class="text">推广订单</view>
				<view class="text">订单金额</view>
				<view class="text">佣金金额</view>
				<view class="text">推广状态</view>
			</view>
			<view class="tbody" :style="'color:'+template.color.color3">
				<view class="label" v-for="(item, index) in profitsharingData.list" :key="index" :style="profitsharingData.list.length===(index+1)?'border-bottom: none':''" @click="copyOrderTap(item.order_id)">
					<view class="text"><span>{{item.order_id}}</span></view>
					<view class="text">¥{{item.order_money}}</view>
					<view class="text">¥{{item.moneys}}</view>
					<view class="text" :style="item.status?'color: #19be6b':'color: #ff9900'">{{item.status?'已分账':'待分账'}}</view>
				</view>
			</view>
		</view>
		<view class="none_list_box" v-else>
			<image src="../../static/images/none_data_icon_01.png" mode="aspectFill"></image>
			<span>暂无推广记录</span>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				profitsharingData: {
					page: 0,
					total: 0,
					money: 0,
					list: []
				}
				
			}
		},
		onLoad() {
			let self = this;
			self.getWxprofitsharingList();
		},
		onShareAppMessage() {
			let self = this;
			let shop = uni.getStorageSync('__ddminiShopInfo');
			let user = uni.getStorageSync('__ddminiUserInfo');
			return {
				title: shop.shop_share_title,
				imageUrl: shop.shop_share_pic,
				path: 'pages/index/index?fenz='+user.uid
			}
		},
		methods: {
			getWxprofitsharingList() {
				let self = this;
				let postData = {
					page: 1,
					sizes: 100
				}
				self.Get(self.Url.wxprofitsharingList, postData).then(res => {
					if(res.code === 0){
						self.profitsharingData = res.data;
					}
				})
			},
			getFenzhangCodeTap() {
				let self = this;
				uni.showModal({
					title: '邀请得现金奖励',
					content: '将此小程序分享给您的好友或者好友通过您的二维码进入小程序下单后，您将获得现金奖励（现金将会直接转入您的微信零钱内）。\r\n注：您的好友下单需要使用微信支付您才能获得现金奖励哦～',
					showCancel: false,
					confirmText: '我知道了'
				})
			},
			copyOrderTap(data) {
				uni.setClipboardData({
				    data: data,
				    success: function () {
				        console.log('订单号复制成功！');
				    }
				});
			}
		}
	}
</script>

<style lang="less">
	.headerBox{
		display: flex;
		align-items: center;
		height: 300rpx;
		background-color: #f0f0f0;
		justify-content: center;
		position: relative;
		.label{
			flex: 0 0 45%;
			height: 50%;
			margin-bottom: 40rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			.number{
				font-size: 60rpx;
				display: flex;
				align-items: center;
				span{
					font-size: 34rpx;
					padding-right: 8rpx;
					margin-top: 18rpx;
				}
			}
			.text{
				font-size: 24rpx;
				padding-top: 10rpx;
			}
		}
		.label:nth-child(1){
			border-right: 1px solid #e0e0e0;
		}
		.tips{
			position: absolute;
			bottom: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			color: #999;
			aicon{
				padding-right: 6rpx;
			}
		}
	}
	.tabelBox{
		width: 93%;
		margin: 0 auto;
		margin-top: 30rpx;
		background-color: #fff;
		.tips{
			padding-bottom: 10rpx;
			font-size: 22rpx;
		}
		.theader{
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #e5e5e5;
			height: 80rpx;
			font-size: 24rpx;
			color: #666;
			.text{
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
			}
			.text:nth-child(1){
				flex: 0 0 40%;
			}
			.text:nth-child(2){
				flex: 0 0 20%;
			}
			.text:nth-child(3){
				flex: 0 0 20%;
			}
			.text:nth-child(4){
				flex: 0 0 20%;
			}
		}
		.tbody{
			border: 1px solid #f0f0f0;
			border-top: none;
			.label{
				display: flex;
				align-items: center;
				justify-content: center;
				height: 80rpx;
				font-size: 24rpx;
				border-bottom: 1px solid #f0f0f0;
				.text{
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100%;
					min-width: 0;
					span{
						width: 80%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
				.text:nth-child(1){
					flex: 0 0 40%;
				}
				.text:nth-child(2){
					flex: 0 0 20%;
				}
				.text:nth-child(3){
					flex: 0 0 20%;
				}
				.text:nth-child(4){
					flex: 0 0 20%;
				}
			}
		}
	}
	
	
	
	
	
	
	
	.noneGoodsBox{
	    width:100%;
	    height:600rpx;
	    display:flex;
	    align-items:center;
	    justify-content:center;
	    .none{
	        font-size:38rpx;
	        color:#c5c9ca;
	        display:flex;
	        align-items:center;
	        justify-content:center;
	        position: relative;
	        font-weight: normal;
	        icon{
	            position: absolute;
	            right:-20rpx;
	        	top: 0;
	        }
	    }
	}
</style>
