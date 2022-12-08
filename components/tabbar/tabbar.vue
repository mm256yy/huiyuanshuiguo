<template>
	<view>
		<view class="tabbar_after_box">
			<view class="after"></view>
		</view>
		<view class="tabbar_box">
			<view class="tabbar">
				<view class="label" v-for="(item, index) in tabbarList" :key="index" @click.stop="selectTabbarTap(index)">
					<view class="icons">
						<aicon :type="current===index?item.icon_active:item.icon_smiles" :color="current===index?template.color.temp_color:template.color.none_color" size="28"></aicon>
						<view class="num" v-if="item.icon_smiles==='cart' && cart">{{cart}}</view>
					</view>
					<view class="name" :style="{color: current===index?template.color.temp_color:template.color.none_color}">{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'tabbar',
		props: {
			current: {
				type: Number,
				default: 0
			},
			cart: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				tabbarList: [{
					name: '首页',
					icon_active: 'homefill',
					icon_smiles: 'home',
					path: '/pages/index/index'
				},{
					name: '分类',
					icon_active: 'goodsnewfill',
					icon_smiles: 'goodsnew',
					path: '/pages/index/menu'
				},{
					name: '购物车',
					icon_active: 'cartfill',
					icon_smiles: 'cart',
					path: '/pages/order/cart'
				},{
					name: '我的',
					icon_active: 'myfill',
					icon_smiles: 'my',
					path: '/pages/user/index'
				}]
			}
		},
		methods: {
			selectTabbarTap(index){
				let self = this;
				let path = self.tabbarList[index].path;
				uni.switchTab({url: path});
			}
		}
	}
</script>

<style lang="less">
	.tabbar_after_box{
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		.after{
			width: 100%;
			height: 120rpx;
		}
	}
	.tabbar_box{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		background-color: #fff;
		padding-bottom: env(safe-area-inset-bottom);
		.tabbar{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 120rpx;
			width: 100%;
			.label{
				flex: 1;
				min-width: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				.icons{
					width: 50rpx;
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					.num{
						position: absolute;
						width: 34rpx;
						height: 34rpx;
						background-color: #F54319;
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 100%;
						right: -14rpx;
						top: -10rpx;
						font-size: 24rpx;
					}
				}
				.name{
					font-size: 28rpx;
				}
			}
		}
	}
</style>
