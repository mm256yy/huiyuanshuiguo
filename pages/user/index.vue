<template>
	<view class="content">
		<view class="user_bg_box" :class="{none_user_bg_box: !userInfoData}">
			<view v-if="userInfoData" class="user_box">
				<view class="avatar">
					<image :src="userInfoData.avatar_url" mode="aspectFill"></image>
					<view class="edit">
						<aicon type="camerafill" size="14" color="#fff"></aicon>
					</view>
					<button open-type="chooseAvatar" @chooseavatar="chooseavatar"></button>
				</view>
				<view class="info">
					<view class="name">
						<block v-if="!editNameStatus">
							<view class="tit">{{userNickName}}</view>
							<view class="edit" @click="editNameStatus=true">
								<aicon type="post" size="18" color="#fff"></aicon>
							</view>
						</block>
						<block v-else>
							<input type="nickname" :value="userNickName" confirm-type="send" @confirm="updatenickname"/>
						</block>
					</view>
					<view class="text">UID:{{userInfoData.id}}</view>
				</view>
			</view>
			<view v-else class="user_box" @click="getPathTap('/pages/user/login')">
				<view class="avatar">
					<image src="../../static/images/avatar.png" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="name">
						<view class="tit">{{userNickName}}</view>
					</view>
					<view class="text">您还未登录哦～</view>
				</view>
			</view>
			<view class="money_box">
				<view class="label" @click="getPathTap('/pages/user/money')">
					<view class="number money_num"><span>¥</span>{{userInfoData.moneys||0}}</view>
					<view class="name">余额</view>
				</view>
				<view class="label" @click="getPathTap('/pages/index/score')">
					<view class="number">{{userInfoData.score||0}}<span>分</span></view>
					<view class="name">积分</view>
				</view>
				<view class="label" @click="getPathTap('/pages/user/coupons')">
					<view class="number">{{couponsNumber}}<span>张</span></view>
					<view class="name">优惠券</view>
				</view>
			</view>
			<view v-if="userInfoData" class="vip_box">
				<view class="vip" @click="getPathTap('/pages/user/member')">
					<view class="left">
						<aicon type="crownfill" size="18" color="#F54319"></aicon>
						<span v-if="userInfoData.level_id">尊贵的{{userInfoData.level_title}}，购物可享{{userInfoData.discount}}折优惠</span>
						<span v-else>您还不是会员，升级会员可享优惠</span>
					</view>
					<view class="right">
						<aicon type="unfold-copy" size="16" color="#F54319"></aicon>
					</view>
				</view>
			</view>
		</view>
		
		<view class="order_list_box">
			<view class="label" v-for="(item, index) in orderList" :key="index" @click="getPathTap(item.path)">
				<view class="image">
					<aicon :type="item.icon" size="25" color="#F54319"></aicon>
				</view>
				<view class="text">{{item.name}}</view>
			</view>
		</view>
		<view v-if="myBannerData" class="banner_box">
			<view class="pic">
				<image @click="getPathTap(myBannerData.target_data)" :src="myBannerData.pic" mode="widthFix"></image>
			</view>
		</view>
		<view class="menu_box">
			<view class="label" v-for="(item, index) in menuList" :key="index" @click="getPathTap(item.path)">
				<view class="icons">
					<aicon :type="item.icon" size="22" color="#1c1c1c"></aicon>
				</view>
				<view class="name">{{item.name}}</view>
				<view class="right">
					<aicon type="unfold-copy" size="20" color="#bbb"></aicon>
				</view>
				<button v-if="item.id===4" open-type="contact"></button>
			</view>
		</view>
		<view class="power_by">
			<about></about>
		</view>
		
		
		
		<tabbar :current="3" :cart="cartNums"></tabbar>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				userInfoData: '',
				userNickName: '微信用户',
				editNameStatus: false,
				orderList: [{
					icon: 'formfill',
					name: '全部订单',
					path: '/pages/order/list'
				}, {
					icon: 'card_fill',
					name: '待付款',
					path: '/pages/order/list?status=0'
				}, {
					icon: 'deliver_fill',
					name: '待收货',
					path: '/pages/order/list?status=2'
				}, {
					icon: 'sponsorfill',
					name: '退款/售后',
					path: '/pages/order/service/index'
				}],
				menuList: [{
					id: 5,
					icon: 'appreciatefill',
					name: '推荐返现',
					path: '/pages/user/profit'
				}, {
					id: 6,
					icon: 'fapiao',
					name: '申请开票',
					path: '/pages/order/invoice_list'
				}, {
					id: 2,
					icon: 'favorfill',
					name: '商品收藏',
					path: '/pages/user/favorite'
				}, {
					id: 3,
					icon: 'locationfill',
					name: '收货地址',
					path: '/pages/user/addressList'
				}, {
					id: 4,
					icon: 'servicefill',
					name: '在线客服',
					path: ''
				}],
				myBannerData: '',
				cartNums: 0,
				couponsNumber: 0
			}
		},
		onLoad() {
			let self = this;
			self.getBannerList();
		},
		onShow() {
			let self = this;
			self.getUserInfo();
			self.getCartList();
			self.getCouponsUserList();
		},
		methods: {
			getCouponsUserList() {
				let self = this;
				let postData = {
					status: 1
				}
				self.Get(self.Url.couponsUserList, postData).then(res => {
					if(res.code === 0){
						self.couponsNumber = res.data.length;
					}
				})
			},
			getCartList(){
				let self = this;
				self.Get(self.Url.cartList).then(res => {
					if(res.code === 0){
						let num = 0;
						res.data.forEach(itm => {
							num += itm.num;
						})
						self.cartNums = num;
					}
				})
			},
			getBannerList(){
				let self = this;
				self.Get(self.Url.bannerList, {ctype: 'myTop'}).then(res => {
					if(res.code === 0){
						if(res.data.length>0){
							self.myBannerData = res.data[0];
						}
					}
				})
			},
			getUserInfo(){
				let self = this;
				self.Get(self.Url.userInfo).then(res => {
					if(res.code === 0){
						self.userInfoData = res.data;
						self.userNickName = res.data.cname;
					}
				})
			},
			chooseavatar(img){
				let self = this;
				self.editNameStatus = false;
				uni.showLoading({title: '头像更新中', mask: true});
				self.Upload(self.Url.uploadFile, img.detail.avatarUrl).then(res => {
					if(res.code === 0){
						self.Post(self.Url.userEdit, {avatar_url: res.url}).then(ues => {
							if(ues.code === 0){
								self.userInfoData.avatar_url = res.url;
								self.editNameStatus = false;
								uni.hideLoading();
								uni.showToast({title: '更新成功'});
							}
						})
					}else{
						uni.hideLoading();
						uni.showModal({content: res.msg,showCancel: false});
					}
				})
			},
			updatenickname(e){
				let self = this;
				uni.showLoading({title: '昵称更新中', mask: true});
				self.Post(self.Url.userEdit, {cname: e.detail.value}).then(ues => {
					if(ues.code === 0){
						self.editNameStatus = false;
						self.userNickName = e.detail.value;
						uni.hideLoading();
						uni.showToast({title: '更新成功'});
					}
				})
			},
			getPathTap(path){
				if(path==='fenzhang'){
					uni.showModal({
						title: '邀请得现金奖励',
						content: '将此小程序分享给您的好友或者好友通过您的二维码进入小程序下单后，您将获得现金奖励（现金将会直接转入您的微信零钱内）。\r\n注：您的好友下单需要使用微信支付您才能获得现金奖励哦～',
						showCancel: false,
						confirmText: '我知道了'
					})
				}else if(path){
					app.globalData.getPathTap(path);
				}
			}
		}
	}
</script>

<style lang="less">
	.user_bg_box{
		width: 100%;
		background-color: #FF633D;
		background-size: cover;
		background-repeat: no-repeat;
		z-index: 1;
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
		.user_box{
			width: 90%;
			margin: 0 auto;
			display: flex;
			align-items: center;
			height: 220rpx;
			.avatar{
				width: 120rpx;
				height: 120rpx;
				position: relative;
				image{
					width: 120rpx;
					height: 120rpx;
					border-radius: 100%;
				}
				.edit{
					position: absolute;
					width: 40rpx;
					height: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 100%;
					bottom: 0;
					right: -6rpx;
					background-color: #F54319;
				}
				button{
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					opacity: 0;
				}
			}
			.info{
				flex: 1;
				min-width: 0;
				color: #fff;
				padding-left: 30rpx;
				.name{
					font-size: 32rpx;
					font-weight: bold;
					display: flex;
					align-items: center;
					.tit{
						max-width: 350rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					input{
						border: 1px solid #fff;
						height: 60rpx;
						padding-left: 20rpx;
						font-weight: normal;
						border-radius: 10rpx;
						line-height: 60rpx;
						font-size: 30rpx;
						width: 380rpx;
					}
					.edit{
						margin-left: 10rpx;
						width: 44rpx;
						height: 44rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						aicon{
							width: 100%;
							height: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
				.text{
					font-size: 26rpx;
					padding-top: 10rpx;
				}
			}
		}
		.vip_box{
			width: 90%;
			margin: 0 auto;
			left: 0;
			right: 0;
			height: 90rpx;
			color: #F54319;
			background-color: #fff;
			border-bottom: 1px solid #F5431920;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			.vip{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100%;
				width: 92%;
				margin: 0 auto;
				.left{
					flex: 1;
					display: flex;
					align-items: center;
					font-size: 28rpx;
					aicon{
						width: 44rpx;
						height: 44rpx;
					}
					span{
						padding-left: 6rpx;
					}
				}
			}
		}
		.money_box{
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			color: #fff;
			width: 100%;
			margin: 0 auto;
			height: 130rpx;
			.label{
				flex: 1;
				text-align: center;
				min-width: 0;
				.number{
					font-size: 40rpx;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					span{
						font-size: 30rpx;
						padding-left: 4rpx;
					}
				}
				.money_num{
					span{
						padding-left: 0;
						padding-right: 4rpx;
					}
				}
				.name{
					font-size: 28rpx;
					opacity: .6;
					color: #fff;
				}
			}
		}
	}
	.none_user_bg_box{
		// height: 220rpx;
		.user_box{
			padding-bottom: 0;
		}
	}
	.user_head_box{
		display: none;
		margin-top: -40rpx;
		z-index: 10;
		background-color: #fff;
		position: relative;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}
	
	.order_list_box{
		width: 90%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
		padding: 30rpx 0 0;
		.label{
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.image{
				aicon{
					background-color: #F5431915;
					width: 90rpx;
					height: 90rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 100%;
				}
			}
			.text{
				color: #1c1c1c;
				font-size: 28rpx;
				padding-top: 10rpx;
			}
		}
	}
	
	.banner_box{
		width: 90%;
		margin: 0 auto;
		margin-top: 40rpx;
		overflow: hidden;
		box-shadow: 0 0 10rpx #00000006;
		.pic{
			width: 100%;
			height: 100%;
			image{
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}
	
	.menu_box{
		width: 90%;
		margin: 0 auto;
		margin-top: 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		.label{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100rpx;
			width: 90%;
			margin: 0 auto;
			position: relative;
			.icons{
				width: 70rpx;
				aicon{
					width: 44rpx;
					height: 44rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			.name{
				flex: 1;
				min-width: 0;
				color: #1c1c1c;
				font-size: 30rpx;
			}
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
	
	.power_by{
		padding-top: 40rpx;
	}
</style>
