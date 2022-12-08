<template>
	<view v-if="pintuanDetails" class="content">
		<view v-if="goodsDetail" class="goods_info_box">
			<view class="goods">
				<view class="image">
					<image :src="goodsDetail.pic_list[0].pic" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="title">{{goodsDetail.title}}</view>
					<view class="text">{{goodsDetail.introduce}}</view>
					<view class="box">
						<view class="price">¥{{goodsDetail.pintuan_price}}<span>¥{{goodsDetail.mini_price}}</span></view>
						<view class="text">{{pintuanDetails.peoples}}人团</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pintuan_info_box">
			<view class="user_info_box">
				<view class="user_list">
					<view class="user">
						<image :src="pintuanDetails.tuanzhangData.avatar" mode="aspectFill"></image>
						<span>团长</span>
					</view>
					<u-avatar-group
						:urls="pintuanDetails.userImg"
						size="35"
						gap="0.4"
					></u-avatar-group>
				</view>
				<view v-if="pintuanDetails.status===1" class="title">拼团中，还差<span>{{pintuanDetails.peoples-pintuanDetails.join_user.length}}</span>人即可成团</view>
				<view v-else-if="pintuanDetails.status===2" class="title">拼团失败，已支付款项会{{pintuanConfig.return_pay===2?'退回余额':'原路退回'}}</view>
				<view v-else-if="pintuanDetails.status===3" class="title">拼团成功，订单动态请查看详情</view>
				<view class="time" v-if="pintuanDetails.status===1">
					<view class="line"></view>
					<view class="time">
						<span>剩余</span>
						<u-count-down
							:time="pintuanDetails.count_down_time"
							format="HH:mm:ss"
							autoStart
							millisecond
							@change="onChange">
							<view class="times">
								<view class="time__custom">
									<text class="time__custom__item">{{ timeData.hours>=10?timeData.hours:'0'+timeData.hours }}</text>
								</view>
								<text class="time__doc">:</text>
								<view class="time__custom">
									<text class="time__custom__item">{{ timeData.minutes>=10?timeData.minutes:'0'+timeData.minutes }}</text>
								</view>
								<text class="time__doc">:</text>
								<view class="time__custom">
									<text class="time__custom__item">{{ timeData.seconds>=10?timeData.seconds:'0'+timeData.seconds }}</text>
								</view>
							</view>
						</u-count-down>
						<span>结束</span>
					</view>
				</view>
			</view>
			<view class="btn_box">
				<view class="button active" style="margin-bottom: 30rpx;" v-if="pintuanDetails.status===1 && pintuanDetails.captain_id===userInfo.uid">立即邀请好友参团<button open-type="share"></button></view>
				<view class="button active" style="margin-bottom: 30rpx;" v-else-if="pintuanDetails.status===1 && pintuanDetails.join_user_data">立即邀请好友参团<button open-type="share"></button></view>
				<view class="button active" style="margin-bottom: 30rpx;" v-else-if="pintuanDetails.status===1" @click="[kaituanId=pintuanDetails.id, cartShow=true]">立即参团</view>
				<view v-if="pintuanDetails.status===3" class="button" @click="getPathTap('/pages/order/details?id='+pintuanDetails.join_user_data.order_id)">查看订单详情</view>
				<view v-else class="button" @click="getPathTap('/pages/user/pintuan')">我的拼团订单</view>
				<view class="button active" style="margin-top: 30rpx;" v-if="pintuanDetails.status===2" @click="cartShow=true">重新购买并开团</view>
			</view>
		</view>
		
		<view v-if="goodsDetail.contents" class="goods_content_box">
			<view class="head_tit">商品详情</view>
			<u-parse :content="goodsDetail.contents" :lazy-load="true" :preview-img="false" :tag-style="tagStyle"></u-parse>
		</view>
		
		<view v-if="hotGoodsList.length>0" class="hot_goods_list">
			<view class="hot_head">
				<u-divider text="更多拼团商品"></u-divider>
			</view>
			<view class="goods_list_box">
				<view class="goods" v-for="(item, index) in hotGoodsList" :key="index" @click="getPathTap('/pages/menu/details?id='+item.id)">
					<view class="image">
						<image :src="item.pic" mode="widthFix"></image>
					</view>
					<view class="info">
						<view class="title">{{item.title}}</view>
						<view class="box">
							<view class="price"><span>¥</span>{{item.mini_price}}</view>
							<view class="add">
								<aicon type="shopping-cart-2-fill" color="#da0a79" size="16"></aicon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<specPicker :cardShow="cartShow" :kaituanId="kaituanId" :goods="goodsDetail" orderType="pintuan" @close="cartShow=false"></specPicker>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				userInfo: uni.getStorageSync('__ddminiUserInfo'),
				cartShow: false,
				timeData: {},
				urls: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/7.jpg',
					'https://cdn.uviewui.com/uview/album/6.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg'
				],
				tagStyle: {
					img: 'display:block'
				},
				hotGoodsList: [],
				pintunId: '',
				pintuanDetails: '',
				pintuanConfig: '',
				goodsDetail: '',
				kaituanId: ''
			}
		},
		onShareAppMessage() {
			let self = this;
			let data = self.pintuanDetails;
			return {
				title: `就差${data.peoples=data.join_user.length}人啦！快来和我一起拼团购买吧！`,
				path: '/pages/index/index?pintuan='+data.id,
				imageUrl: data.goods_pic
			}
		},
		onLoad(e) {
			let self = this;
			self.pintunId = e.id;
			self.getPintuanGoods();
			// self.getGoodsList();
		},
		methods: {
			onChange(e) {
				this.timeData = e
			},
			getGoodsDetail(){
				let self = this;
				let postData ={
					id: self.pintuanDetails.goods_id
				}
				self.Get(self.Url.goodsDetail, postData).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						let data = res.data;
						self.goodsDetail = data;
					}
				})
			},
			getPintuanConfig(){
				let self = this;
				let postData ={
					goods_id: self.pintuanDetails.goods_id
				}
				self.Get(self.Url.pintuanConfig, postData).then(res => {
					if(res.code === 0){
						self.pintuanConfig = res.data;
					}
				})
			},
			getPintuanGoods(){
				let self = this;
				let postData = {
					id: self.pintunId
				}
				self.Get(self.Url.pintuanGoods, postData).then(res => {
					if(res.code === 0){
						let data = res.data.list[0];
						if(data){
							let time = new Date().getTime();
							data.tuanzhangData = data.join_user.find(itm => itm.captain);
							let other = data.join_user.filter(itm => !itm.captain);
							data.userImg = other.map(itm => {return itm.avatar});
							data.count_down_time =  data.endtime_stamp - time;
							data.join_user_data = data.join_user.find(itm => itm.id === self.userInfo.uid);
							self.pintuanDetails = data;
							self.getPintuanConfig();
							self.getGoodsDetail();
						}
						
					}
				})
			},
			getGoodsList(){
				let self = this;
				let postData = {
					page: 1,
					sizes: 10,
					pintuan: true
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						let data = res.data;
						self.hotGoodsList = data.list;
					}
				})
			},
			getPathTap(path){
				app.globalData.getPathTap(path)
			}
		}
	}
</script>

<style lang="less">
	.goods_info_box{
		width: 100%;
		background-color: #fff;
		.goods{
			width: 90%;
			margin: 0 auto;
			padding: 30rpx 0 40rpx;
			display: flex;
			align-items: center;
			.image{
				width: 230rpx;
				image{
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
					border: 1px solid #f5f5f5;
				}
			}
			.info{
				flex: 1;
				min-width: 0;
				height: 190rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
					color: #1c1c1c;
					font-size: 30rpx;
					font-weight: bold;
				}
				.text{
					color: #999;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.price{
						font-size: 36rpx;
						color: #da0a79;
						font-weight: bold;
						span{
							font-size: 30rpx;
							font-weight: normal;
							margin-left: 20rpx;
							text-decoration: line-through;
							color: #999;
						}
					}
					.text{
						color: #da0a79;
						border: 1px solid #da0a79;
						padding: 0 10rpx;
						border-radius: 10rpx;
						font-size: 28rpx;
						height: 40rpx;
					}
				}
			}
		}
	}
	.pintuan_info_box{
		background-color: #fff;
		margin-top: 30rpx;
		.user_info_box{
			.user_list{
				display: flex;
				align-items: center;
				width: 80%;
				margin: 0 auto;
				justify-content: center;
				padding: 50rpx 0 30rpx;
				flex-direction: column;
				.user{
					width: 100rpx;
					height: 100rpx;
					position: relative;
					margin-bottom: 20rpx;
					image{
						width: 100rpx;
						height: 100rpx;
						border-radius: 100%;
						border: 1px solid #f5f5f5;
					}
					span{
						color: #fff;
						background-color: #da0a79;
						font-size: 22rpx;
						padding: 0 12rpx;
						border-radius: 20rpx;
						position: absolute;
						top: -6rpx;
						right: -20rpx;
						border-bottom-left-radius: 0;
						z-index: 10;
					}
				}
			}
			.title{
				text-align: center;
				color: #1c1c1c;
				font-size: 30rpx;
				span{
					color: #da0a79;
					font-weight: bold;
					padding: 0 4rpx;
				}
			}
			.time{
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				height: 100rpx;
				color: #999;
				.line{
					width: 80%;
					height: 1px;
					background-color: #efefef;
				}
				.time{
					display: flex;
					align-items: center;
					position: absolute;
					background-color: #fff;
					height: 50rpx;
					z-index: 1;
					width: 55%;
					justify-content: center;
					.times {
						display: flex;
					    align-items: center;
						margin: 0 14rpx;
					
					    .time__custom {
					         width: 42rpx;
					         height: 42rpx;
					         background-color: #da0a79;
					         border-radius: 6rpx;
					         display: flex;
					         justify-content: center;
					         align-items: center;
					    }
					    
					    .time__doc {
					         color: #da0a79;
					         padding: 0 10rpx;
					     }
					    
					    .time__custom__item {
					         color: #fff;
					         font-size: 26rpx;
							 text-align: center;
					     }
					}
				}
			}
		}
		.btn_box{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 30rpx 0 50rpx;
			.button{
				width: 45%;
				height: 70rpx;
				border: 1px solid #da0a79;
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #da0a79;
				border-radius: 100rpx;
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
				background-color: #da0a79;
				color: #fff;
			}
		}
	}
	
	.goods_content_box{
		width: 100%;
		margin: 0 auto;
		background-color: #fff;
		margin-top: 30rpx;
		.head_tit{
			width: 90%;
			margin: 0 auto;
			height: 110rpx;
			display: flex;
			align-items: center;
			color: #1c1c1c;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	
	.hot_goods_list{
		padding-bottom: 20rpx;
		.hot_head{
			width: 80%;
			margin: 0 auto;
			padding: 20rpx 0;
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
				box-shadow: 0 0 10rpx #00000006;
				.image{
					width: 100%;
				}
				.info{
					background-color: #fff;
					padding: 20rpx;
					.title{
						color: #1c1c1c;
						font-size: 28rpx;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.box{
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-top: 20rpx;
						.price{
							display: flex;
							align-items: center;
							font-size: 32rpx;
							font-weight: bold;
							color: #da0a79;
							span{
								font-weight: normal;
								font-size: 26rpx;
								padding-right: 4rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
