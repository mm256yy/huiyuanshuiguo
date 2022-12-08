<template>
	<view class="content">
		<view class="head_box">
			<view class="label">日期</view>
			<view class="label">积分</view>
			<view class="label">备注</view>
		</view>
		<view class="list_box">
			<view class="list" v-for="(item, index) in scoreRecord" :key="index">
				<view class="label">{{item.uptime}}</view>
				<view class="label">{{item.score}}</view>
				<view class="label">{{item.memo}}</view>
			</view>
		</view>
		<view class="none_list_box" v-if="scoreRecord.length===0">
			<image src="../../static/images/none_data_icon_02.png" mode="widthFix"></image>
			<span>暂无积分记录</span>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				scoreRecord: []
			}
		},
		onLoad() {
			let self = this;
			self.getUserScoreRecord();
		},
		methods: {
			getUserScoreRecord(){
				let self = this;
				let postData = {
					page: 1,
					sizes: 100
				}
				self.Get(self.Url.userScoreRecord, postData).then(res => {
					if(res.code === 0){
						self.scoreRecord = res.data.list;
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.head_box{
		position: sticky;
		top: 0;
		left: 0;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		border-bottom: 1px solid #efefef;
		z-index: 100;
		.label{
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #1c1c1c;
			font-weight: bold;
			font-size: 28rpx;
		}
	}
	.list_box{
		.list{
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 90%;
			margin: 0 auto;
			height: 100rpx;
			border-bottom: 1px dashed #efefef;
			color: #1c1c1c;
			font-size: 24rpx;
			.label{
				// flex: 1;
			}
			.label:nth-child(3){
				width: 250rpx;
				text-align: right;
			}
		}
	}
</style>
