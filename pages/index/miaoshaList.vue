<template>
	<view class="content">
		<view class="list_box">
			<view class="list" v-for="(item, index) in miaoshaGoodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
				<view class="image">
					<image :src="item.pic" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="title">{{item.title}}</view>
					<view class="times">
						<u-count-down
							:time="item.time_stamp"
							format="DD:HH:mm:ss"
							autoStart
							millisecond
							@change="onChange"
						>
							<view class="time">
								<view class="line">
									<text>{{ timeData.days }}天</text>
									<text>{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}时</text>
									<text>{{ timeData.minutes }}分</text>
									<text>{{ timeData.seconds }}秒</text>
								</view>
								<view class="txt">下架</view>
							</view>
						</u-count-down>
					</view>
					<view class="box">
						<view class="price">¥{{item.mini_price}}<span v-if="item.max_price">¥{{item.max_price}}</span></view>
						<view class="buy">去抢购</view>
					</view>
				</view>
			</view>
			<view class="none_list_box" v-if="miaoshaGoodsList.length===0">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>暂无秒杀商品</span>
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
				miaoshaGoodsList: [],
				timeData: {},
			}
		},
		onLoad() {
			let self = this;
			uni.setNavigationBarColor({
				backgroundColor: self.template.color.tive_color,
				frontColor: '#ffffff'
			})
			self.getMiaoshaGoodsList();
		},
		methods: {
			onChange(e) {
				this.timeData = e
			},
			getMiaoshaGoodsList(){
				let self = this;
				let postData = {
					shelf_down: true
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						let data = res.data.list;
						let date = new Date().getTime();
						data.forEach(itm => {
							itm.time_stamp = itm.shelf_down_time_stamp - date;
						})
						self.miaoshaGoodsList = data;
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
	.list_box{
		background-color: #fff;
		width: 90%;
		margin: 0 auto;
		margin-bottom: 14rpx;
		border-radius: 20rpx;
		padding-top: 20rpx;
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
							background-color: #FF6D20;
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
							border: 1px solid #FF6D20;
							color: #FF6D20;
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
						color: #FF6D20;
						font-size: 38rpx;
						span{
							color: #999;
							font-size: 26rpx;
							margin-left: 10rpx;
							text-decoration: line-through;
						}
					}
					.buy{
						background-color: #FF6D20;
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
