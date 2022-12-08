<template>
	<view class="content">
		<view class="goods_box">
			<view class="goods_list_box">
				<view class="goods" v-for="(item, index) in favoriteList" :key="index" @click="getPathTap('/pages/menu/details?id='+item.id)">
					<view class="image">
						<image :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="info">
						<view class="title">{{item.title}}</view>
						<view class="box">
							<view class="price"><span>¥</span>{{item.mini_price}}</view>
							<view class="add">
								<span>{{diaplayTime(item.update_time)}}收藏</span>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="none_list_box" v-if="favoriteList.length===0">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>暂无收藏商品</span>
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
				favoriteList: []
			}
		},
		onLoad() {
			let self = this;
			self.getFavoriteList();
		},
		methods: {
			getFavoriteList(){
				let self = this;
				self.Get(self.Url.favoriteList).then(res => {
					if(res.code === 0){
						self.favoriteList = res.data;
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
	.goods_box{
		width: 100%;
		padding-top: 30rpx;
	}
	.content{
		
	}
	.goods_list_box{
		columns: 2;
		column-gap: 30rpx;
		width: 90%;
		margin: 0 auto;
		.goods{
			background-color: #fff;
			border-radius: 20rpx;
			overflow: hidden;
			page-break-inside: avoid;
			margin-bottom: 30rpx;
			.image{
				width: 100%;
				height: 280rpx;
			}
			.info{
				background-color: #fff;
				border: 1px solid #efefef;
				border-top: none;
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				padding: 20rpx;
				min-width: 0;
				.title{
					color: #1c1c1c;
					font-size: 28rpx;
				}
				.box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 20rpx;
					.price{
						display: flex;
						align-items: center;
						font-size: 30rpx;
						font-weight: bold;
						color: #F54319;
						span{
							font-weight: normal;
							font-size: 24rpx;
							padding-right: 2rpx;
						}
					}
					.add{
						font-size: 24rpx;
						color: #999;
					}
				}
			}
		}
	}
</style>
