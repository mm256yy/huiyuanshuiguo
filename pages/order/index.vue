<template>
	<view class="content">
		
		<tabbar :current="2"></tabbar>
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
		methods: {
			
		}
	}
</script>

<style lang="less">
	
</style>
