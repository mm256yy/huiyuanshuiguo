<template>
	<view class="content">
		<view v-if="couponsBannerList.length>0" class="swiper_box box_show">
			<swiper class="swiper" circular autoplay interval="6000" duration="500" @change="swiperChange">
				<swiper-item v-for="(item, index) in couponsBannerList" :key="index">
					<image @click="getPathTap(item.target_data)" lazy-load="true" mode="aspectFill" :src="item.pic" />
				</swiper-item>
			</swiper>
			<view class="swiper_dots">
				<block v-for="(item, index) in couponsBannerList" :key="index">
					<view class="dot" :class="swiperCurrent==index?'active':''"></view>
				</block>
			</view>
		</view>
		<view class="coupons_list_box">
			<block v-if="couponsList.length>0">
				<view class="head_tit">可领取的优惠券</view>
				<view class="label box_shadow" v-for="(item, index) in couponsList" v-if="item.ctype<=2" :key="index">
					<view class="price">{{item.moneys}}<span>元</span></view>
					<view class="info">
						<view class="title">{{item.title}}</view>
						<view class="text">消费满{{item.min_money}}元可使用，{{item.goods_type===1?'全场商品可用':'指定商品可用'}}</view>
						<view class="intro">共发放{{item.numbers}}张，已有{{item.user_number}}人领取</view>
						<view class="btn_box">
							<view v-if="item.user_status" class="btn" @click="couponsUserTap(item)">立即领取</view>
							<view v-else class="btn" style="opacity: .5;">已领取过</view>
						</view>
					</view>
				</view>
			</block>
			<view class="none_list_box" v-if="couponsList.length===0">
				<image src="../../static/images/none_data_icon_04.png" mode="widthFix"></image>
				<span>暂无可领优惠券</span>
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
				swiperCurrent: 0,
				couponsBannerList: [],
				couponsList: []
			}
		},
		onLoad() {
			let self = this;
			self.getBannerList();
			self.getCouponsGoods();
		},
		methods: {
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
			},
			getBannerList(){
				let self = this;
				self.Get(self.Url.bannerList, {ctype: 'couponTop'}).then(res => {
					if(res.code === 0){
						self.couponsBannerList = res.data;
					}
				})
			},
			getCouponsGoods(){
				let self = this;
				self.Post(self.Url.couponsGoods, {}).then(res => {
					if(res.code === 0){
						self.couponsList = res.data;
					}
				})
			},
			couponsUserTap(data){
				let self = this;
				if(data.ctype===2){
					uni.showModal({
						title: '兑换优惠券',
						editable: true,
						placeholderText: '请输入兑换口令',
						cancelColor: '#999',
						confirmColor: '#da0a79',
						success(ces){
							console.log(ces)
							if(!ces.content){
								return uni.showToast({title: '请输入兑换口令', icon: 'none'});
							}else{
								let postData = {
									id: data.id,
									code: ces.content
								}
								self.getCouponsUserAdd(postData);
							}
						}
					})
				}else{
					let postData = {
						id: data.id
					}
					self.getCouponsUserAdd(postData);
				}
			},
			getCouponsUserAdd(data){
				let self = this;
				self.Get(self.Url.couponsUserAdd, data).then(res => {
					if(res.code === 0){
						uni.showToast({title: '领取成功'});
						self.getCouponsGoods();
					}else{
						uni.showModal({
							title: '领取失败',
							content: res.msg,
							showCancel: false
						})
					}
				})
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #fff;
	}
	.swiper_box{
		width: 100%;
		position: relative;
		background-color: #ffffff;
		swiper{
			width: 90%;
			height: 200rpx;
			margin: 0 auto;
			border-radius: 20rpx;
			overflow: hidden;
			padding: 10rpx 0 30rpx;
			image{
				width: 100%;
				height: 200rpx;
				margin: 0 auto;
				border-radius: 20rpx;
			}
		}
		.swiper_dots{
			position: absolute;
			bottom: 50rpx;
			display: flex;
			justify-content: center;
			width: 92%;
			z-index: 6;
			left: 0;
			right: 0;
			margin: 0 auto;
			.dot {
				margin: 0 4rpx;
				width: 10rpx;
				height: 10rpx;
				background: #fff;
				border-radius: 20rpx;
				transition: all 0.1s;
				opacity: 0.5;
			}		
			.active {
				opacity: 1;
				background: #da0a79;
			}
		}
	}
	.coupons_list_box{
		.head_tit{
			width: 90%;
			margin: 0 auto;
			color: #da0a79;
			font-size: 32rpx;
			font-weight: bold;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 20rpx;
		}
		.label{
			width: 90%;
			margin: 0 auto;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;
			background-color: #da0a7905;
			padding: 20rpx 0;
			border: 1px solid #da0a7920;
			.price{
				width: 180rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #da0a79;
				font-size: 46rpx;
				font-weight: bold;
				line-height: 46rpx;
				span{
					font-size: 26rpx;
					padding-left: 4rpx;
					margin-bottom: -6rpx;
				}
			}
			.info{
				flex: 1;
				min-width: 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 200rpx;
				.title{
					color: #1c1c1c;
					font-size: 30rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.text{
					font-size: 28rpx;
					color: #666;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.intro{
					font-size: 26rpx;
					color: #999;
				}
				.btn_box{
					padding-top: 10rpx;
					.btn{
						width: 150rpx;
						background-color: #da0a79;
						color: #fff;
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 100rpx;
						font-size: 26rpx;
					}
				}
				
			}
			.button{
				width: 160rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.btn{
					background-color: #f14b5b;
					color: #fff;
					padding: 6rpx 14rpx;
					border-radius: 100rpx;
					font-size: 26rpx;
				}
			}
		}
	}
</style>
