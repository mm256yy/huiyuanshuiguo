<template>
	<view class="content">
		<view class="headerBox">
			<view class="vipBox" v-if="userDetails">
				<view class="user">
					<image class="avatar" :src="userDetails.avatar_url" mode="widthFix"></image>
					<view class="nameBox">
						<view class="nickname">{{userDetails.cname}}</view>
						<view v-if="shopData.level_type=='score'" class="totle">累计获得{{userDetails.total_score}}分</view>
						<view v-if="shopData.level_type=='money'" class="totle">累计消费{{userDetails.total_money}}元</view>
						<view v-if="shopData.level_type=='order'" class="totle">累计购买{{userDetails.total_order}}次</view>
					</view>
				</view>
				<block v-if="userDetails.level_id">
					<view class="tips" v-if="userDetails.id">
						<view class="title">当前等级为{{userDetails.level_title}}</view>
						<u-line-progress v-if="userLevelList.length>0" active-color="#f8d4ad" :percent="getTotalLine()" :height="10" :show-percent="false" striped striped-active></u-line-progress>
						<block v-if="userDetails.level_time">
							<view class="text">
								<span>有效期至：{{userDetails.level_time}}</span>
								<span>享{{userDetails.discount/10}}折</span>
							</view>
						</block>
						<block v-else>
							<block v-if="userLevelList.length>0 && (nextLevelIdx+1)<=userLevelList.length">
								<view v-if="shopData.level_type=='score'" class="text">
									<span>还差{{userLevelList[nextLevelIdx+1].level_score-userDetails.total_score}}分升级到{{userLevelList[nextLevelIdx+1].title}}</span>
									<span>{{userLevelList[nextLevelIdx+1].level_score}}分</span>
								</view>
								<view v-if="shopData.level_type=='money'" class="text">
									<span>还差{{userLevelList[nextLevelIdx+1].level_money-userDetails.total_money}}元升级到{{userLevelList[nextLevelIdx+1].title}}</span>
									<span>{{userLevelList[nextLevelIdx+1].level_money}}元</span>
								</view>
								<view v-if="shopData.level_type=='order'" class="text">
									<span>还差{{userLevelList[nextLevelIdx+1].level_order-userDetails.total_order}}单升级到{{userLevelList[nextLevelIdx+1].title}}</span>
									<span>{{userLevelList[nextLevelIdx+1].level_order}}单</span>
								</view>
							</block>
						</block>
					</view>
				</block>
				<block v-else>
					<view class="noneTips">非会员</view>
				</block>
				<icons class="bgImg" type="vip" size="78" color="#fff"></icons>
			</view>
		</view>
		<view class="contentBox">
			<view class="bigBox" v-if="buyLevelList.length>0">
				<view class="header" :style="'color:'+template.color.color2">购买会员</view>
				<view class="hover">
					<view class="label" v-for="(item, index) in buyLevelList" :key="index" :class="buyLevelActive===index?'active':''" @click="buyLevelActive=index">
						<view class="title" :style="buyLevelActive===index?'':'color:'+template.color.color3">{{item.title}}</view>
						<view class="text" :style="buyLevelActive===index?'':'color:'+template.color.color4">
							<span v-if="item.level_payday===30">{{item.level_payment}}元/月</span>
							<span v-else-if="item.level_payday===365">{{item.level_payment}}元/年</span>
							<span v-else>{{item.level_payment}}元/{{item.level_payday}}天</span>
						</view>
						<view class="price" :style="buyLevelActive===index?'':'color:'+template.color.color4"><span>¥</span>{{item.level_payment}}</view>
					</view>
					<view class="label" style="opacity: 0;" v-if="buyLevelList.length%3===2"></view>
				</view>
				<block v-if="userDetails.level_id>buyLevelList[buyLevelActive].id">
					<view class="button none">您已是{{userDetails.level_title}}，无需购买</view>
				</block>
				<block v-else-if="buyLevelList[buyLevelActive].level_payment===0">
					<view class="button none">无需购买，达到条件后自动升级</view>
				</block>
				<block v-else-if="userDetails.level_id===buyLevelList[buyLevelActive].id">
					<view class="button none" @click="getBuyLevelTap()">您已是{{userDetails.level_title}}，继续购买可续期</view>
				</block>
				<block v-else>
					<view class="button" @click="getBuyLevelTap()">立即支付{{buyLevelList[buyLevelActive].level_payment}}元，升级{{buyLevelList[buyLevelActive].title}}</view>
				</block>
			</view>
			<view v-else class="agentListBox">
				<view class="header" :style="'color:'+template.color.color2">会员成长体系</view>
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
			<view class="interestsBox" v-if="currentLevel.interests_list.length>0">
				<view class="header" :style="'color:'+template.color.color2">会员权益</view>
				<view class="listBox" :style="'color:'+template.color.color2">
					<view class="list" v-for="(item, index) in currentLevel.interests_list" :key="index">
						<view class="image">
							<image :src="item.icons" mode="widthFix"></image>
						</view>
						<view class="title">{{item.cname}}</view>
						<view class="text">{{item.intro}}</view>
					</view>
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
				shopData: uni.getStorageSync('__ddminiShopInfo'),
				userDetails: {
					moneys: 0,
					score: 0,
					total_money: 0,
					total_order: 0,
					total_score: 0
				},
				currentLevel: '',
				nextLevelIdx: 0,
				userLevelList: [],
				buyLevelActive: 0,
				buyLevelList: []
			}
		},
		onShow() {
			let self = this;
			self.getUserDetails();
			
		},
		methods: {
			getUserDetails() {
				let self = this;
				self.Get(self.Url.userInfo, {}).then(res => {
					if(res.code === 0){
						self.userDetails = res.data;
						self.getUserLevelList();
					}
				});
			},
			getUserLevelList() {
				let self = this;
				self.Get(self.Url.userLevelList, {}).then(res => {
					if(res.code === 0){
						let data = res.data;
						if(self.shopData.level_type==='score'){
							let index = data.findIndex(itm => self.userDetails.total_score < itm.level_score);
							self.nextLevelIdx = index;
						}
						if(self.shopData.level_type==='order'){
							let index = data.findIndex(itm => self.userDetails.total_order < itm.level_order);
							self.nextLevelIdx = index;
						}
						if(self.shopData.level_type==='money'){
							let index = data.findIndex(itm => self.userDetails.total_money < itm.level_money);
							self.nextLevelIdx = index;
						}
						let buyList = data.filter(itm => itm.buy_status);
						let current = data.find(itm => self.userDetails.level_id === itm.id);
						self.userLevelList = res.data;
						self.buyLevelList = buyList;
						self.currentLevel = current;
					}
				})
			},
			getBuyLevelTap() {
				let self = this;
				let data = self.buyLevelList[self.buyLevelActive];
				if(self.userDetails.level_id>data.id){
					uni.showModal({
						content: '您已是'+self.userDetails.level_title+'，无需购买。',
						showCancel: false
					})
					return
				}
				uni.showLoading({title: '准备支付中', mask: true});
				self.Get(self.Url.buyUserLevel, {id: data.id}).then(res => {
					if(res.code === 0){
						let orderData = res.data;
						let postData = {
							order_id: orderData.order_id,
							pay_type: 1,
							platform: 1,
							type: 2
						}
						self.Get(self.Url.orderPaypal, postData).then(pes => {
							if(pes.code === 0){
								uni.hideLoading();
								uni.requestPayment({
								    provider: 'wxpay',
								    timeStamp: pes.data.wechat.timeStamp,
								    nonceStr: pes.data.wechat.nonceStr,
								    package: pes.data.wechat.package,
								    signType: pes.data.wechat.signType,
								    paySign: pes.data.wechat.paySign,
								    success: function () {
										uni.showToast({title: '微信支付成功'});
										self.getUserDetails();
								    },
								    fail: function (err) {
								        uni.showModal({
								        	title: '支付失败',
											content: '订单支付失败，请重新进行支付。如对订单金额有疑问请联系客服人员',
											showCancel: false
								        })
								    }
								});
							}else{
								uni.hideLoading();
								uni.showModal({
									content: res.msg,
									showCancel: false
								})
							}
						})
					}else{
						uni.hideLoading();
						uni.showModal({
							content: res.msg,
							showCancel: false
						})
					}
				})
			},
			getTotalLine() {
				let self = this;
				let shop = self.shopData;
				let user = self.userDetails;
				let leve = self.userLevelList[self.nextLevelIdx+1];
				if(user.level_time){
					return 100
				}else{
					let number = 0;
					if(shop.level_type==='score'){
						number = (user.total_score/leve.level_score)*100;
					}else if(shop.level_type==='money'){
						number = (user.total_money/leve.level_money)*100;
					}else if(shop.level_type==='order'){
						number = (user.total_order/leve.level_order)*100;
					}
					return number
				}
			}
		}
	}
</script>

<style lang="less">
	.headerBox{
		width: 100%;
		height: 350rpx;
		background-color: #f5f5f5;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		.vipBox{
			width: 90%;
			height: 310rpx;
			background: linear-gradient(-45deg, #c68c50, #f8d4ad);
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			position: relative;
			.user{
				display: flex;
				align-items: center;
				width: 90%;
				margin: 0 auto;
				margin-top: 20rpx;
				justify-content: space-between;
				.avatar{
					height: 100rpx;
					width: 100rpx;
					border-radius: 100rpx;
				}
				.nameBox{
					width: 77%;
					min-width: 0;
					.nickname{
					color: #fff;
					font-weight: bold;
					font-size: 30rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					}
					.totle{
						color: #fff;
						font-size: 24rpx;
						padding-top: 6rpx;
					}
				}
			}
			.tips{
				width: 90%;
				padding-bottom: 30rpx;
				.title{
					color: #fff;
					font-size: 30rpx;
					margin-bottom: -8rpx;
				}
				.text{
					color: #fff;
					font-size: 26rpx;
					display: flex;
					justify-content: space-between;
				}
			}
			.noneTips{
				height: 180rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				font-size: 60rpx;
				color: #f8d4ad;
				padding-bottom: 20rpx;
			}
			.bgImg{
				position: absolute;
				top: 50rpx;
				right: 0;
				opacity: .2;
			}
		}
	}
	.contentBox{
		box-shadow: 0 -30rpx 30rpx #00000010;
		position: absolute;
		width: 100%;
		padding-top: 20rpx;
		.bigBox{
			width: 90%;
			margin: 0 auto;
			padding-bottom: 50rpx;
			.header{
				display: flex;
				align-items: center;
				font-size: 34rpx;
				font-weight: bold;
				height: 80rpx;
			}
			.hover{
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				padding-top: 20rpx;
				.label{
					background-color: #f5f5f5;
					flex: 0 0 30%;
					height: 200rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-radius: 10rpx;
					border: 1px solid #f5f5f5;
					margin-bottom: 30rpx;
					.title{
						color: #c68c50;
						font-weight: bold;
						font-size: 26rpx;
					}
					.text{
						color: #c68c50;
						font-size: 22rpx;
						padding-top: 10rpx;
					}
					.price{
						color: #c68c50;
						font-weight: bold;
						font-size: 46rpx;
						height: 80rpx;
						display: flex;
						align-items: center;
						span{
							font-size: 30rpx;
							margin-bottom: -8rpx;
							margin-right: 4rpx;
						}
					}
				}
				.active{
					border-color: #c68c5070;
					background-color: #c68c5010;
				}
			}
			.button{
				background: #ffdfb2;
				width: 100%;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 100rpx;
				margin-top: 30rpx;
				color: #c68c50;
				font-weight: bold;
				font-size: 28rpx;
			}
			.none{
				background-color: #eee;
				color: #999;
			}
		}
		.interestsBox{
			width: 90%;
			margin: 0 auto;
			padding-bottom: 50rpx;
			.header{
				display: flex;
				align-items: center;
				font-size: 34rpx;
				font-weight: bold;
				height: 80rpx;
			}
			.listBox{
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.list{
					flex: 0 0 23%;
					margin-bottom: 50rpx;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					min-width: 0;
					.image{
						background-color: #c68c5010;
						border-radius: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 120rpx;
						height: 120rpx;
						image{
							width: 80rpx;
							height: 80rpx;
						}
					}
					.title{
						padding-top: 10rpx;
						font-size: 26rpx;
						text-align: center;
						font-weight: bold;
						width: 95%;
						margin: 0 auto;
					}
					.text{
						color: #999;
						font-size: 24rpx;
						text-align: center;
						width: 95%;
						margin: 0 auto;
						padding-top: 10rpx;
					}
				}
			}
		}
	}
	
	
	.headerBoxa {
		width: 90%;
		margin: 0 auto;
		height: 320rpx;
		margin-top: 30rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, .08);
		position: relative;
		overflow: hidden;
		font-weight: normal;
		border-radius: 6rpx;
		.bgImg {
			position: absolute;
			top: 0;
			right: -10rpx;
			width: 300rpx;
			height: 320rpx;
			opacity: 0.05;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.user {
			display: flex;
			width: 90%;
			margin: 0 auto;
			height: 120rpx;
			align-items: flex-end;

			.avatar {
				width: 90rpx;
				height: 90rpx;
				display: block;
				border-radius: 100%;
				overflow: hidden;
			}

			.nameBox {
				color: #fff;
				width: 80%;
				height: 96rpx;
				padding-left: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;

				.nickname {
					font-size: 28rpx;
				}

				.totle {
					font-size: 24rpx;
					padding-top: 4rpx;
				}
			}
		}

		.status {
			width: 100%;
			height: 200rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #fff;

			.name {
				font-size: 46rpx;
			}

			.text {
				font-size: 26rpx;
				padding-top: 12rpx;
			}
		}
	}

	.agentListBox {
		width: 90%;
		margin: 0 auto;
		margin-top: 30rpx;
		font-weight: normal;

		.header {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 34rpx;
			font-weight: bold;
			height: 80rpx;
			margin-bottom: 20rpx;
		}

		.menuBox {
			display: flex;
			width: 100%;
			height: 80rpx;
			align-items: center;
			background: linear-gradient(-45deg, #c68c50, #f8d4ad);

			.menu {
				flex: 0 0 33.33%;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 80rpx;
			}

			.menu:nth-child(1),
			.menu:nth-child(2) {
				border-right: 2rpx solid #f8d4ad50;
			}
		}

		.listBox {
			display: flex;
			width: 100%;
			height: 80rpx;
			align-items: center;

			.list {
				flex: 0 0 33.33%;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 80rpx;
				font-size: 26rpx;
			}

			.list:nth-child(1),
			.list:nth-child(2) {
				border-right: 2rpx solid #f8d4ad50;
			}
		}

		.listBox:nth-child(odd) {
			border-bottom: 2rpx solid #f8d4ad50;
			border-left: 2rpx solid #f8d4ad50;
			border-right: 2rpx solid #f8d4ad50;
		}

		.listBox:nth-child(even) {
			// border-bottom: 2rpx solid #f8d4ad50;
			border-left: 2rpx solid #f8d4ad50;
			border-right: 2rpx solid #f8d4ad50;
			background-color: #f8d4ad50;
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
