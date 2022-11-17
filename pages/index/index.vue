<template>
	<view v-if="template" class="content">
		
		
		
		<tabbar :current="0"></tabbar>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: '',
				
			}
		},
		onLoad() {
			let self = this;
			let template = {
				color: {
					temp_color: '#007AFF',
					none_color: '#8A8B9C'
				}
			}
			self.template = template;
			uni.setStorage({key: '__ddminiTemplateConfig',data: template});
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
