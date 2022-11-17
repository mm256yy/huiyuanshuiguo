<template>
	<view class="content">
		
		<tabbar :current="1"></tabbar>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				
			}
		},
		onLoad() {
			let self = this;
			
		},
		onShareAppMessage() {
			let shop = uni.getStorageSync('__ddminiShopInfo');
			return {
				title: shop.shop_share_title||shop.shop_name,
				imageUrl: shop.shop_share_pic||shop.shop_logo,
				path: 'pages/index/index'
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less">
	
</style>
