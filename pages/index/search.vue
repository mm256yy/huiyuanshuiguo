<template>
	<view class="content">
		<view class="header">
			<view class="search">
				<aicon type="search" size="16" color="#999"></aicon>
				<input type="text" v-model="keywords" placeholder="搜索您想要的商品" placeholder-style="color:#999;" confirm-type="search" @confirm="searchHotKeywords(keywords)" />
				<aicon class="close" v-if="keywords" @click="closeSearchTap()" type="roundclosefill" size="26" :color="template.color.temp_color"></aicon>
			</view>
		</view>
		<view class="hishory" v-if="hishoryList.length>0 || hotKeywordsList.length>0">
			<view v-if="hishoryList.length>0" class="label" style="margin-bottom: 10rpx;">
				<view class="title">最近搜索 <icon class="shanchu" type="shanchu" size="16" color="#999" @click="delHishoryTap()"></icon></view>
				<view class="list">
					<view class="text" v-for="(item, index) in hishoryList" :key="index" @click="searchHotKeywords(item)">{{item}}</view>
				</view>
			</view>
			<view v-if="hotKeywordsList.length>0" class="label">
				<view class="title">热门搜索</view>
				<view class="list">
					<view class="text" :style="keywords==item?'background-color:'+template.color.temp_color+';color:#fff':''" v-for="(item, index) in hotKeywordsList" :key="index" @click="searchHotKeywords(item)">{{item}}</view>
				</view>
			</view>
		</view>
		<view class="goods_list">
			<view class="goods" v-for="(item, index) in goodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
				<view class="image">
					<image :src="item.productDetailsImg" mode="aspectFill"></image>
				</view>
				<!-- <view class="info">
					<view class="title"><span v-if="item.pintuan_id">团</span>{{item.title}}</view>
					<view class="box">
						<view class="left">
							<view class="price" v-if="item.ctype==='score'">{{item.mini_score}}积分</view>
							<view class="price" v-else-if="item.pintuan_id">¥{{item.pintuan_price}}<span>¥{{item.mini_price}}</span></view>
							<view class="price" v-else>¥{{item.mini_price}}<span v-if="item.max_price">{{item.max_price}}</span></view>
							<view class="vip" v-if="item.ctype!='score' && !item.pintuan_id && item.vip_price.length>0">¥{{item.vip_price[0].price}}<span>{{item.vip_price[0].title}}</span></view>
							<view class="vip tuan" v-if="item.pintuan_id"><span>{{item.pintuan_peoples}}人团</span></view>
						</view>
						<view class="right" @click.stop="getAddCartTap(item)">
							<aicon v-if="item.ctype==='score'" type="c-duihuan" :color="template.color.temp_color" size="24"></aicon>
							<aicon v-else-if="item.pintuan_id" type="yiqipin" :color="template.color.temp_color" size="20"></aicon>
							<aicon v-else type="cartfill" :color="template.color.temp_color" size="20"></aicon>
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="none_list_box" v-if="goodsList.length===0">
			<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
			<span>商品正在上新中</span>
		</view>
	</view>
</template>
<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				openStoreStatus: true,
				keywords: '',
				goodsList: [],
				hishoryList: [],
				hotKeywordsList: [],
			}
		},
		onLoad(e) {
			let self = this;
			let hishory = uni.getStorageSync('__ddminiHishoryList');
			if(hishory){
				self.hishoryList = hishory;
			}
			self.getUserInfo();
		},
		methods: {
			getUserInfo(){
				let self = this;
				self.Get(self.Url.userInfo).then(res => {
					if(res.code === 0){
						self.userInfoData = res.data;
					}
					self.getGoodsList();
				})
			},
			closeSearchTap() {
				this.keywords = '';
				this.getGoodsList();
			},
			delHishoryTap() {
				this.hishoryList = [];
				uni.removeStorageSync('__ddminiHishoryList');
			},
			searchHotKeywords(key) {
				let self = this;
				let data = self.hishoryList;
				let number = 0;
				data.forEach(res => {
					if(res == key){
						number = 1;
					}
				})
				if(number===0){
					self.hishoryList.push(key);
					uni.setStorage({key: '__ddminiHishoryList',data: self.hishoryList});
				}
				self.keywords = key;
				self.getGoodsList();
			},
			getGoodsList() {
				let self = this;
				let postData = {
					page: 1,
					sizes: 100
				};
				if(self.keywords){
					postData.keywords = self.keywords;
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						self.goodsList = res.data.list;
					}
				})
			},
			getMemberPriceTap(data){
				let self = this;
				let user = self.userInfoData;
				if(user.level_id){
					let money = data.vip_price.find(itm => itm.id === user.level_id);
					return money.price;
				}else{
					let array = data.vip_price.map(itm => {return itm.price});
					let money = Math.max(...array);
					return money;
				}
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
			},
			getAddCartTap(data){
				let self = this;
				if(data.specs_status){
					self.getPathTap('/pages/index/details?id='+data.id);
					return
				}else{
					if(data.pintuan_id || data.ctype==='score'){
						self.getPathTap('/pages/index/details?id='+data.id);
						return
					}
					let postData = {
						id: data.id,
						number: 1
					}
					self.Get(self.Url.cartAdd, postData).then(res => {
						if(res.code === 0){
							uni.showToast({title: '已加入购物车'});
						}
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.header{
		position: sticky;
		top: 0;
		width: 100%;
		height: 90rpx;
		background-color: #fff;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		z-index: 100;
		border-bottom: 1px solid #f5f5f5;
		.search{
			display: flex;
			align-items: center;
			width: 90%;
			margin: 0 auto;
			background-color: #f2f2f2;
			height: 70rpx;
			border-radius: 100rpx;
			position: relative;
			aicon{
				margin-left: 20rpx;
			}
			input{
				width: 80%;
				height: 100%;
				padding-left: 16rpx;
				color: #333;
				font-size: 28rpx;
			}
			.close{
				position: absolute;
				right: 10rpx;
			}
		}
	}
	.hishory{
		width: 90%;
		margin: 0 auto;
		padding: 40rpx 0;
		.label{
			position: relative;
			.shanchu{
				position: absolute;
				right: 0;
			}
			.title{
				color: #999;
				font-size: 24rpx;
			}
			.list{
				display: flex;
				flex-wrap: wrap;
				.text{
					background-color: #e2e2e2;
					color: #666;
					padding: 6rpx 24rpx;
					font-size: 24rpx;
					border-radius: 100rpx;
					margin: 20rpx 0;
					margin-right: 20rpx;
				}
			}
		}
	}
	.goods_list{
		width: 92%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.goods{
			flex-basis: 48%;
			margin-bottom: 30rpx;
			.image{
				image{
					width: 100%;
					height: 280rpx;
					border-top-left-radius: 20rpx;
					border-top-right-radius: 20rpx;
				}
			}
			.info{
				border: 1px solid #efefef;
				border-top: none;
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				padding: 20rpx 0;
				min-width: 0;
				.title{
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #1f1f1f;
					font-size: 28rpx;
					width: 90%;
					margin: 0 auto;
					max-width: 300rpx;
					span{
						background-color: #F54319;
						color: #fff;
						padding: 0 6rpx;
						border-radius: 6rpx;
						font-size: 24rpx;
						margin-right: 10rpx;
					}
				}
				.box{
					width: 90%;
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 10rpx;
					.left{
						flex: 1;
						min-width: 0;
						min-height: 82rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						.price{
							color: #F54319;
							font-size: 30rpx;
							span{
								color: #999;
								font-size: 26rpx;
								text-decoration: line-through;
								margin-left: 10rpx;
							}
						}
						.vip{
							color: #1f1f1f;
							font-size: 28rpx;
							display: flex;
							align-items: center;
							padding-top: 6rpx;
							span{
								background-color: #1f1f1f;
								color: gold;
								font-size: 20rpx;
								padding: 0 6rpx;
								border-top-left-radius: 10rpx;
								border-top-right-radius: 10rpx;
								border-bottom-right-radius: 10rpx;
								margin-left: 10rpx;
							}
						}
						.tuan{
							span{
								margin-left: 0;
								border-top-left-radius: 0;
								border-top-right-radius: 0;
								border-bottom-right-radius: 0;
								padding: 2rpx 10rpx;
								border-radius: 6rpx;
								background-color: gold;
								color: #1f1f1f;
							}
						}
					}
					.right{
						aicon{
							width: 56rpx;
							height: 56rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							border: 1px solid #F54319;
							border-radius: 100%;
						}
					}
				}
			}
		}
	}
</style>
