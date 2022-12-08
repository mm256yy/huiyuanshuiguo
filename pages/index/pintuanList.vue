<template>
	<view class="content">
		<view class="menu_box">
			<view class="label" :class="{alabel: menuActive===0}" @click="selectMenuTap(0)">
				<span>全部拼团</span>
			</view>
			<view class="label" :class="{alabel: menuActive===1}" @click="selectMenuTap(1)">
				<span>正在拼团</span>
			</view>
		</view>
		<view class="list_box" v-if="menuActive===0">
			<view class="list" v-for="(item, index) in goodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
				<view class="image">
					<image :src="item.pic" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="tag"><span>{{item.pintuan_peoples}}人团</span></view>
					<view class="title">{{item.title}}</view>
					<view class="box">
						<view class="price">¥{{item.pintuan_price}}<span>¥{{item.mini_price}}</span></view>
						<view class="buy">去开团</view>
					</view>
				</view>
			</view>
			<view class="none_list_box" v-if="goodsList.length===0">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>暂无拼团商品</span>
			</view>
		</view>
		<view class="list_box" v-if="menuActive===1">
			<view class="list" v-for="(item, index) in pintuanGoods" :key="index" @click="getPathTap('/pages/index/details?id='+item.goods_id)">
				<view class="image">
					<image :src="item.goods_pic" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="tag"><span>{{item.peoples}}人团</span></view>
					<view class="title">{{item.goods_title}}</view>
					<view class="box">
						<view class="price">¥{{item.goods_pintuan_price}}<span>¥{{item.goods_price}}</span></view>
						<view class="buy">去参团</view>
					</view>
				</view>
			</view>
			<view class="none_list_box" v-if="pintuanGoods.length===0">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>暂无拼团中商品</span>
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
				menuActive: 0,
				goodsList: [],
				pintuanGoods: []
			}
		},
		onLoad() {
			let self = this;
			uni.setNavigationBarColor({
				backgroundColor: self.template.color.temp_color,
				frontColor: '#ffffff'
			})
			self.selectMenuTap(0);
		},
		methods: {
			selectMenuTap(id){
				let self = this;
				self.menuActive = id;
				if(id===0){
					self.getGoodaList();
				}else{
					self.getPintuanGoods();
				}
			},
			getGoodaList(){
				let self = this;
				let postData = {
					pintuan: true
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						self.goodsList = res.data.list;
					}
				})
			},
			getPintuanGoods(){
				let self = this;
				self.Get(self.Url.pintuanGoods).then(res => {
					if(res.code === 0){
						self.pintuanGoods = res.data.list;
					}
				})
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
			},
		}
	}
</script>

<style lang="less">
	.menu_box{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 100rpx;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 100;
		background-color: #F54319;
		.label{
			flex: 1;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 30rpx;
			opacity: .7;
			span{
				border-bottom: 2px solid #F54319;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 20rpx;
			}
		}
		.alabel{
			opacity: 1;
			span{
				border-color: #fff;
			}
		}
		
	}
	.list_box{
		background-color: #fff;
		width: 90%;
		margin: 0 auto;
		margin-bottom: 14rpx;
		border-radius: 20rpx;
		padding-top: 40rpx;
		.list{
			width: 100%;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 40rpx;
			.image{
				width: 220rpx;
				image{
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}
			.info{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				min-width: 0;
				height: 190rpx;
				.title{
					color: #1f1f1f;
					font-size: 28rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.tag{
					span{
						background-image: linear-gradient(to right, #F54319, #FF6D20);
						color: #fff;
						font-size: 24rpx;
						border-radius: 6rpx;
						padding: 0 6rpx;
						height: 40rpx;
					}
				}
				.times{
					.time{
						display: flex;
						align-items: center;
						.line{
							background-color: #F54319;
							color: #fff;
							height: 40rpx;
							font-size: 24rpx;
							display: flex;
							align-items: center;
							width: 230rpx;
							justify-content: center;
							border-top-left-radius: 8rpx;
							border-bottom-left-radius: 8rpx;
						}
						.txt{
							border: 1px solid #F54319;
							color: #F54319;
							height: 36rpx;
							font-size: 24rpx;
							padding: 0 10rpx;
							border-top-right-radius: 8rpx;
							border-bottom-right-radius: 8rpx;
						}
					}
				}
				.box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.price{
						color: #F54319;
						font-size: 38rpx;
						span{
							color: #999;
							font-size: 26rpx;
							margin-left: 10rpx;
							text-decoration: line-through;
						}
					}
					.buy{
						background-color: #F54319;
						color: #fff;
						padding: 0 20rpx;
						border-radius: 100rpx;
						height: 46rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 26rpx;
					}
				}
			}
		}
	}
</style>
