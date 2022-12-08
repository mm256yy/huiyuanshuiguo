<template>
	<view class="content">
		<view class="headerBox">
			<view class="user">
				<view class="avatar">
					<image :src="userInfo.avatar_url" mode="aspectFill"></image>
				</view>
				<view class="nameBox">
					<view class="nickname">{{userInfo.cname}}</view>
					<view v-if="shopData.level_type=='score'" class="totle">累计获得{{userInfo.total_score}}分<span>（订单需确认收货后才计入）</span></view>
					<view v-if="shopData.level_type=='money'" class="totle">累计消费{{userInfo.total_money}}元<span>（订单需确认收货后才计入）</span></view>
					<view v-if="shopData.level_type=='order'" class="totle">累计购买{{userInfo.total_order}}次<span>（订单需确认收货后才计入）</span></view>
				</view>
			</view>
			<view class="status">
				<view v-if="userInfo.level_id" class="name">{{userInfo.level_title}}</view>
				<view v-else class="name">非会员</view>
				<view class="text" v-if="shopData.level_type=='score'">累计积分达指定分数可自动成为会员</view>
				<view class="text" v-if="shopData.level_type=='money'">累计消费达指定金额可自动成为会员</view>
				<view class="text" v-if="shopData.level_type=='order'">累计购买达指定次数可自动成为会员</view>
			</view>
			<view class="bgImg">
				<aicon type="crownfill" size="100" color="#fff"></aicon>
			</view>
		</view>
		<view v-if="userLevelList.length>0" class="agentListBox">
			<view class="header">会员成长体系</view>
			<view class="menuBox">
				<view class="menu">级别名称</view>
				<view class="menu">购物折扣</view>
				<view class="menu">
					<text v-if="shopData.level_type=='score'">累计积分(分)</text>
					<text v-if="shopData.level_type=='money'">累计消费(元)</text>
					<text v-if="shopData.level_type=='order'">累计购买(次)</text>
				</view>
			</view>
			<view class="listBox" v-for="(item, index) in userLevelList" :key="index">
				<view class="list">{{item.title}}</view>
				<view class="list">{{item.discount}}%</view>
				<view class="list">
					<text v-if="shopData.level_type=='score'">{{item.level_score}}</text>
					<text v-if="shopData.level_type=='money'">{{item.level_money}}</text>
					<text v-if="shopData.level_type=='order'">{{item.level_order}}</text>
				</view>
			</view>
			<view v-if="shopData.level_type=='score'" class="text">注：当累计积分达指定标准则自动成为该级别会员</view>
			<view v-if="shopData.level_type=='money'" class="text">注：当累计消费达指定标准则自动成为该级别会员</view>
			<view v-if="shopData.level_type=='order'" class="text">注：当累计购买次数达指定标准则自动成为该级别会员</view>
		</view>



	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				shopData: uni.getStorageSync('__ddminiShopInfo'),
				userInfo: {
					moneys: 0,
					score: 0,
					total_money: 0,
					total_order: 0,
					total_score: 0
				},
				userLevelList: []
			}
		},
		onShow() {
			let self = this;
			self.getUserInfo();
			self.getUserLevelList();
		},
		methods: {
			getUserInfo(){
				let self = this;
				self.Get(self.Url.userInfo, {}).then(res => {
					if(res.code === 0){
						self.userInfo = res.data;
					}
				});
			},
			getUserLevelList(){
				let self = this;
				self.Get(self.Url.userLevelList, {}).then(res => {
					if(res.code === 0){
						self.userLevelList = res.data;
					}
				})
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
		margin: 0 auto;
		height: 350rpx;
		position: relative;
		overflow: hidden;
		// background-image: linear-gradient(to right, #e3ba64, #edd08c);
		background-image: linear-gradient(to right, #F54319, #FF6D20);

		.bgImg {
			position: absolute;
			top: 0;
			right: 0;
			width: 300rpx;
			height: 320rpx;
			opacity: 0.12;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.user {
			display: flex;
			width: 90%;
			margin: 0 auto;
			height: 150rpx;
			align-items: center;

			.avatar {
				width: 120rpx;
				image{
					width: 100rpx;
					height: 100rpx;
					border-radius: 100%;
				}
			}

			.nameBox {
				color: #fff;
				flex: 1;
				height: 90rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.nickname {
					font-size: 30rpx;
					font-weight: bold;
				}

				.totle {
					font-size: 28rpx;
					span{
						font-size: 24rpx;
						opacity: .5;
					}
				}
			}
		}

		.status {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #fff;
			padding-top: 20rpx;

			.name {
				font-size: 46rpx;
			}

			.text {
				font-size: 26rpx;
				padding-top: 12rpx;
				opacity: .5;
			}
		}
	}

	.agentListBox {
		width: 90%;
		margin: 0 auto;
		margin-top: 30rpx;

		.header {
			color: #1c1c1c;
			display: flex;
			width: 100%;
			height: 100rpx;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			margin-bottom: 20rpx;
			font-weight: bold;
		}

		.menuBox {
			display: flex;
			width: 100%;
			height: 80rpx;
			align-items: center;
			// background-image: linear-gradient(to left, #e3ba64, #edd08c);
			background-image: linear-gradient(to right, #F54319, #FF6D20);

			.menu {
				flex: 1;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 80rpx;
			}

			.menu:nth-child(1),
			.menu:nth-child(2) {
				border-right: 2rpx solid rgba(255, 255, 255, .3);
			}
		}

		.listBox {
			display: flex;
			width: 100%;
			height: 80rpx;
			align-items: center;

			.list {
				flex: 1;
				color: #1c1c1c;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 80rpx;
			}

			.list:nth-child(1),
			.list:nth-child(2) {
				border-right: 2rpx solid #efefef;
			}
		}

		.listBox:nth-child(odd) {
			border-bottom: 2rpx solid #efefef;
			border-left: 2rpx solid #efefef;
			border-right: 2rpx solid #efefef;
		}

		.listBox:nth-child(even) {
			border-bottom: 2rpx solid #efefef;
			border-left: 2rpx solid #efefef;
			border-right: 2rpx solid #efefef;
			background-color: #f7f7f7;
		}

		.text {
			display: flex;
			height: 80rpx;
			align-items: center;
			justify-content: center;
			color: #999;
			font-size: 24rpx;
		}
	}
</style>
