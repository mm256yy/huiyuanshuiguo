<template>
	<view class="content">
		<view v-if="swiperList.length>0" class="swiperBpx">
			<swiper class="swiper" circular autoplay interval="6000" duration="500" @change="swiperChange">
				<swiper-item v-for="(item, index) in swiperList" :key="index" @click="getPathTap(item.target_data)">
					<image lazy-load="true" mode="aspectFill" :src="item.pic" />
				</swiper-item>
			</swiper>
			<view class="swiperDots">
				<block v-for="(item, index) in swiperList" :key="index">
					<view class="dot" :class="swiperCurrent==index?'active':''"></view>
				</block>
			</view>
		</view>
		<view class="score_box">
			<view class="left">
				<view class="tit">我的积分</view>
				<view class="number">{{userScore}}</view>
			</view>
			<view class="right">
				<view class="txt" @click="getPathTap('/pages/user/score_list')">积分消费明细</view>
			</view>
		</view>
		<view class="goods_list">
			<view class="goods" v-for="(item, index) in goodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
				<view class="image">
					<image :src="item.pic" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="title">{{item.title}}</view>
					<view class="box">
						<view class="left">
							<view class="price">{{item.mini_score}}<span>积分</span></view>
						</view>
						<view class="right">已兑{{item.views_see}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="none_list_box" v-if="goodsList.length===0" style="height: 50vh;">
			<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
			<span>暂无积分商品</span>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				title: '',
				goodsList: [],
				id: '',
				keywords: '',
				
				swiperCurrent: 0,
				swiperList: [],
				userScore: 0
			}
		},
		onLoad() {
			let self = this;
			self.getGoodsList();
			self.getHomebannerList();
			self.Get(self.Url.userInfo, {}).then(res => {
				if(res.code === 0){
					self.userScore = res.data.score;
				}
			});
		},
		methods: {
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
			},
			getHomebannerList() {
				let self = this;
				let postData = {
					ctype: 'scoreAd'
				}
				self.Get(self.Url.bannerList, postData).then(res => {
					if(res.code === 0){
						self.swiperList = res.data;
					}
				});
			},
			getGoodsList() {
				let self = this;
				let postData = {
					// category: self.id
					ctype: 'score'
				}
				// if(self.keywords){
				// 	postData.keywords = self.keywords;
				// }
				uni.showLoading({title: '加载中...'});
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						self.goodsList = res.data.list;
					}else{
						uni.hideLoading();
					}
				})
			},
			delKeywprds() {
				this.keywords = '';
				this.getGoodsList();
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
			}
		}
	}
</script>

<style lang="less">
	.swiperBpx {
		width: 90%;
		margin: 0 auto;
		padding-top: 14rpx;
		position: relative;
	
		.swiper {
			height: 300rpx;
			border-radius: 20rpx;
			overflow: hidden;
			swiper-item {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	
		.swiperDots {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 12rpx;
			display: flex;
			justify-content: center;
			height: 10rpx;
	
			.dot {
				margin: 0 5rpx;
				width: 25rpx;
				height: 4rpx;
				background: #fff;
				border-radius: 20rpx;
				transition: all 0.6s;
				opacity: 0.5;
			}
	
			.active {
				opacity: 1;
			}
		}
	}
	.search{
		width: 92%;
		margin: 0 auto;
		border: 1px solid #f2f2f2;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100rpx;
		margin-top: 30rpx;
		position: relative;
		input{
			width: 80%;
			height: 100%;
			text-align: center;
			font-weight: normal;
		}
		.del{
			position: absolute;
			right: 20rpx;
		}
	}
	.score_box{
		width: 90%;
		margin: 0 auto;
		padding: 40rpx 0 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #efefef;
		.left{
			.tit{
				color: #1f1f1f;
				font-size: 28rpx;
			}
			.number{
				color: #F54319;
				font-size: 60rpx;
				font-weight: bold;
				line-height: 80rpx;
			}
		}
		.right{
			height: 86rpx;
			display: flex;
			align-items: flex-end;
			.txt{
				color: #999999;
				font-size: 26rpx;
			}
		}
	}
	.goods_list{
		width: 92%;
		padding-top: 40rpx;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.goods{
			flex-basis: 48%;
			margin-bottom: 30rpx;
			.image{
				image{
					width: 100%;
					height: 280rpx;
					border-top-left-radius: 20rpx;
					border-top-right-radius: 20rpx;
				}
			}
			.info{
				border: 1px solid #efefef;
				border-top: none;
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				padding: 20rpx 0;
				min-width: 0;
				.title{
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #1f1f1f;
					font-size: 28rpx;
					width: 90%;
					margin: 0 auto;
				}
				.box{
					width: 90%;
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 10rpx;
					.left{
						flex: 1;
						min-width: 0;
						.price{
							color: #F54319;
							font-size: 36rpx;
							display: flex;
							align-items: center;
							span{
								font-size: 28rpx;
								padding-left: 8rpx;
							}
						}
					}
					.right{
						font-size: 26rpx;
						color: #999;
					}
				}
			}
		}
	}
</style>
