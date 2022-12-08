<template>
	<view class="content">
		<view class="head_box box_shadow">
			<view class="label" :class="{alabel: orderActive===item.id}" v-for="(item, index) in orderMenu" :key="index" @click="selectMenuTap(item.id)">
				<view class="tit" :style="{borderColor: orderActive===item.id?'#F54319':'#fff'}">{{item.name}}</view>
			</view>
		</view>
		
		<view class="order_list_box">
			<view class="order box_shadow" v-for="(item, index) in pintuanUserList" :key="index">
				<view class="head">
					<view class="left">{{diaplayTime(item.opentime)}}{{item.join_status?'参团':'开团'}}</view>
					<view class="right" v-if="item.status===1">
						<span>{{item.peoples}}人团<span v-if="item.peoples-item.join_user.length>0">，还差{{item.peoples-item.join_user.length}}人成团</span></span>
					</view>
					<view class="right" v-else>
						<span v-if="item.status===2">拼团失败</span>
						<span v-else-if="item.status===3">拼团成功</span>
					</view>
				</view>
				<view class="goods_box">
					<view class="goods" @click="getPathTap('/pages/menu/details?id='+itm.id)" v-for="(itm, idx) in item.goods_info" :key="idx">
						<view class="left">
							<image :src="itm.pic" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="title">{{itm.title}}</view>
							<view class="text">
								<span v-for="(ttm, tdx) in itm.spec" :key="tdx">{{ttm}}</span>
							</view>
							<view class="box">
								<view class="num">¥{{itm.price}}</view>
								<view class="buy">x{{itm.number}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="foot">
					<view class="left">
						<u-avatar-group
							:urls="getAvatarsTap(item.join_user)"
							size="25"
							gap="0.4"
						></u-avatar-group>
					</view>
					<view class="right">
						<view class="button" @click="getPathTap('/pages/order/details?id='+item.order_id)">订单详情</view>
						<view class="button active" @click="getPathTap('/pages/menu/pintuan?id='+item.open_id)">拼团详情</view>
					</view>
				</view>
			</view>
			
			<view class="none_list_box" v-if="pintuanUserList.length===0">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>暂无拼团记录</span>
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
				orderMenu: [{
					id: 1,
					name: '拼团中'
				}, {
					id: 2,
					name: '拼团失败'
				}, {
					id: 3,
					name: '拼团成功'
				}],
				orderActive: 1,
				urls: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/7.jpg',
					'https://cdn.uviewui.com/uview/album/6.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg'
				],
				pintuanUserList: []
			}
		},
		onLoad() {
			let self = this;
			self.getPintuanUser();
		},
		methods: {
			selectMenuTap(id){
				let self = this;
				self.orderActive = id;
				self.getPintuanUser();
			},
			getPintuanUser(){
				let self = this;
				let postData = {
					status: self.orderActive
				}
				self.Get(self.Url.pintuanUser, postData).then(res => {
					if(res.code === 0){
						self.pintuanUserList = res.data.list;
					}
				})
			},
			getAvatarsTap(list){
				let avatar = list.map(itm => {return itm.avatar});
				return avatar.reverse();
			},
			getPathTap(path){
				if(path){
					app.globalData.getPathTap(path);
				}
			}
		}
	}
</script>

<style lang="less">
	.head_box{
		display: flex;
		align-items: center;
		height: 120rpx;
		background-color: #fff;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 100;
		.label{
			flex: 1;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.tit{
				color: #666;
				transition: all 0.2s;
				padding-top: 6rpx;
				border-bottom: 3px solid transparent;
				padding-bottom: 10rpx;
				font-size: 30rpx;
			}
		}
		.alabel{
			.tit{
				color: #1c1c1c;
				font-weight: bold;
				border-color: #00d389;
			}
		}
	}
	
	.order_list_box{
		width: 100%;
		padding-top: 30rpx;
		min-height: 72vh;
		.order{
			width: 92%;
			margin: 0 auto;
			border-radius: 20rpx;
			background-color: #fff;
			margin-bottom: 30rpx;
			.head{
				display: flex;
				align-items: center;
				width: 92%;
				margin: 0 auto;
				height: 80rpx;
				justify-content: space-between;
				.left{
					color: #999;
					font-size: 28rpx;
				}
			}
			.goods_box{
				width: 92%;
				margin: 0 auto;
				background-color: #f5f5f5;
				border-radius: 20rpx;
				.goods{
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					.left{
						width: 190rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						image{
							width: 150rpx;
							height: 150rpx;
							border-radius: 20rpx;
							background-color: #fff;
						}
					}
					.right{
						flex: 1;
						min-width: 0;
						height: 150rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.title{
							color: #1c1c1c;
							font-size: 28rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							width: 95%;
						}
						.text{
							color: #666;
							font-size: 26rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							width: 95%;
						}
						.box{
							display: flex;
							align-items: center;
							justify-content: space-between;
							width: 95%;
							padding-top: 10rpx;
							.num{
								color: #1c1c1c;
								font-size: 30rpx;
								display: flex;
								align-items: center;
								span{
									font-size: 26rpx;
									padding-left: 2rpx;
								}
							}
							.buy{
								color: #1c1c1c;
								padding: 0 10rpx;
								border-radius: 10rpx;
							}
						}
					}
				}
			}
			.foot{
				width: 92%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100rpx;
				.left{
					color: #1c1c1c;
					font-size: 28rpx;
				}
				.right{
					flex: 1;
					display: flex;
					justify-content: flex-end;
					.button{
						border: 1px solid #e5e5e5;
						color: #666;
						font-size: 28rpx;
						padding: 0 20rpx;
						border-radius: 100rpx;
						line-height: 28rpx;
						display: flex;
						align-items: center;
						height: 50rpx;
						position: relative;
						button{
							position: absolute;
							width: 100%;
							height: 100%;
							top: 0;
							left: 0;
							opacity: 0;
						}
					}
					.active{
						background-color: #F54319;
						color: #fff;
						border-color: #F54319;
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
