<template>
	<view class="content">
		<view class="map_box">
			<map :markers="markers" :latitude="latitude" :longitude="longitude"></map>
		</view>
		<view class="store_box">
			<view class="store" v-for="(item, index) in storeList" :key="index" @click="selectStoreTap(index)">
				<view class="left">
					<image :src="item.logo||logo" mode="aspectFill"></image>
				</view>
				<view class="right">
					<view class="title">{{item.title}}</view>
					<view class="address">{{item.address}}</view>
				</view>
				<view class="select">
					<aicon v-if="storeId===item.id" type="roundcheckfill" :color="template.color.temp_color" size="25"></aicon>
					<aicon v-else type="round" color="#eee" size="25"></aicon>
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
				storeList: [],
				storeId: '',
				logo: __wxConfig.accountInfo.icon,
				markers: [],
				latitude: 0,
				longitude: 0,
			}
		},
		onLoad(e) {
			let self = this;
			if(e.id){
				self.storeId = Number(e.id);
			}
			self.gteStoreList();
		},
		methods: {
			gteStoreList(){
				let self = this;
				let postData = {}
				self.Get(self.Url.storeList, postData).then(res => {
					if(res.code === 0){
						let list = [];
						let data = res.data;
						self.storeList = data;
						data.forEach((itm, idx) => {
							list.push({
								id: idx,
								latitude: itm.latitude,
								longitude: itm.longitude,
								iconPath: itm.logo,
								width: 30,
								height: 30,
								callout: {
									content: itm.title,
									color: '#ffffff',
									bgColor: '#F54319',
									padding: 5,
									display: 'ALWAYS',
									borderRadius: 5
								}
							})
						})
						self.markers = list;
						if(self.storeId){
							let mendian = data.find(itm => itm.id === self.storeId);
							self.latitude = mendian.latitude;
							self.longitude =mendian.longitude;
						}else{
							self.latitude = list[0].latitude;
							self.longitude = list[0].longitude;
						}
					}
				})
			},
			selectStoreTap(index){
				let self = this;
				let data = self.storeList[index];
				uni.$emit('store', data);
				setTimeout(function(){
					uni.navigateBack();
				}, 600)
			}
		}
	}
</script>

<style lang="less">
	.map_box{
		width: 100%;
		height: 500rpx;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 1000;
		map{
			width: 100%;
			height: 100%;
		}
	}
	.store_box{
		width: 100%;
		.store{
			width: 90%;
			margin: 0 auto;
			border-bottom: 1px dashed #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 40rpx 0;
			.left{
				width: 130rpx;
				image{
					width: 100rpx;
					height: 100rpx;
					border: 1px solid #f5f5f5;
					border-radius: 100%;
				}
			}
			.right{
				flex: 1;
				min-width: 0;
				height: 90rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
					color: #1f1f1f;
					font-size: 28rpx;
					font-weight: bold;
				}
				.address{
					color: #999;
					font-size: 26rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
