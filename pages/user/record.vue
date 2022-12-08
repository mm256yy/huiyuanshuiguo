<template>
	<view class="content">
		<view class="headerBox">
			<view class="menu">
				<view class="label" :class="current==2?'active':''" @click="selectMenuTap(2)">
					<text>消费记录</text>
				</view>
				<view class="label" :class="current==1?'active':''" @click="selectMenuTap(1)">
					<text>充值记录</text>
				</view>
			</view>
			<view class="header">
				<view class="label" style="flex: 0 0 30%;">日期</view>
				<view class="label" style="flex: 0 0 25%;">{{current===2?'消费':'充值'}}金额</view>
				<view class="label" style="flex: 0 0 20%;" v-if="current===1">赠送金额</view>
				<view class="label" style="flex: 0 0 25%;">当前余额</view>
				<view class="label" style="flex: 0 0 20%;" v-if="current===2">订单号</view>
			</view>
		</view>
		<view class="recordList">
			<view class="list" v-for="(item, index) in userRecord.list" :key="index">
				<view class="label" style="flex: 0 0 30%;">{{item.dates}}</view>
				<view class="label" style="flex: 0 0 25%;">{{item.moneys}}</view>
				<view class="label" style="flex: 0 0 20%;" v-if="current===1">{{item.gives}}</view>
				<view class="label" style="flex: 0 0 25%;">{{item.balance}}</view>
				<view class="label" v-if="item.orders && current===2" style="flex: 0 0 20%;" @click="copyOrderTap(item.orders)">
					<view class="text">复制</view>
				</view>
			</view>
			<view class="none_list_box" v-if="userRecord.list.length===0">
				<image src="../../static/images/none_data_icon_02.png" mode="aspectFill"></image>
				<span>暂无{{current===2?'消费':'充值'}}记录</span>
			</view>
		</view>
		<view class="footer">
			<view class="label">
				<view class="text" v-if="current===2">累计余额消费：¥{{userRecord.money}}</view>
				<view class="text" v-if="current===1">累计余额充值：¥{{userRecord.money}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				current: 2,
				userRecord: {
					money: 0,
					list: []
				}
			}
		},
		onLoad() {
			let self = this;
			self.getUserRecord();
		},
		methods: {
			selectMenuTap(id) {
				this.current = id;
				this.getUserRecord();
			},
			getUserRecord() {
				let self = this;
				let postData = {
					type: self.current,
					page: 1,
					sizes: 100
				}
				self.Get(self.Url.userRecord, postData).then(res => {
					if(res.code === 0){
						self.userRecord = res.data;
					}
				})
			},
			copyOrderTap(number) {
				uni.setClipboardData({data: number});
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #FFFFFF;
	}
	.headerBox{
		width: 100%;
		background-color: #fff;
		z-index: 1000;
		border-bottom: 1px solid #efefef;
		position: sticky;
		top: 0;
		left: 0;
		.menu{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100rpx;
			position: relative;
			.label{
				flex: 1;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				text{
					border-bottom: 2px solid transparent;
					padding: 0 10rpx;
					font-size: 30rpx;
					height: 70%;
					display: flex;
					align-items: center;
					color: #999;
				}
			}
			.active{
				text{
					border-color: #F54319;
					color: #F54319;
					font-weight: bold;
				}
			}
		}
		.header{
			width: 100%;
			height: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			.label{
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	.recordList{
		padding-top: 20rpx;
		background-color: #FFFFFF;
		.list{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 80rpx;
			font-size: 26rpx;
			.label{
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				.text{
					border: 1px solid;
					padding: 2rpx 14rpx;
					border-radius: 100rpx;
					font-size: 22rpx;
				}
			}
		}
		.list:nth-child(even){
			background-color: #f5f5f5;
		}
	}
	.footer{
		display: flex;
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		z-index: 999;
		border-top: 1px solid #f5f5f5;
		padding-bottom: env(safe-area-inset-bottom);
		.label{
			display: flex;
			width: 95%;
			height: 100rpx;
			margin: 0 auto;
			align-items: center;
			justify-content: center;
			font-weight: bold;
		}
	}
</style>
