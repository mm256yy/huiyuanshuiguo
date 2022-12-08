<template>
	<view class="content">
		<view class="menu_box">
			<scroll-view class="left_box" v-if="categoryList.length>0">
				<view class="label" :class="{alabel: categoryNums===index}" v-for="(item, index) in categoryList" :key="index" @click="selectCategoryTap(index)">
					<span>{{item.title}}</span>
				</view>
				<view style="height: 120rpx;"></view>
			</scroll-view>
			<scroll-view scroll-y scroll-with-animation @scrolltolower="scrolltolowerTap()" class="right_box">
				<view class="goods" v-for="(item, index) in goodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
					<view class="left">
						<image :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="right">
						<view class="title"><span v-if="item.pintuan_id">团</span>{{item.title}}</view>
						<view class="box">
							<view class="lefts">
								<view class="price" v-if="item.ctype==='score'">{{item.mini_score}}积分</view>
								<view class="price" v-else-if="item.pintuan_id">¥{{item.pintuan_price}}<span>¥{{item.mini_price}}</span></view>
								<view class="price" v-else>¥{{item.mini_price}}<span v-if="item.max_price">{{item.max_price}}</span></view>
								<view class="vip" v-if="item.ctype!='score' && !item.pintuan_id && item.vip_price.length>0">¥{{item.vip_price[0].price}}<span>{{item.vip_price[0].title}}</span></view>
								<view class="vip tuan" v-if="item.pintuan_id"><span>{{item.pintuan_peoples}}人团</span></view>
							</view>
							<view class="rights" @click.stop="getAddCartTap(item)">
								<aicon v-if="item.ctype==='score'" type="c-duihuan" :color="template.color.temp_color" size="24"></aicon>
								<aicon v-else-if="item.pintuan_id" type="yiqipin" :color="template.color.temp_color" size="20"></aicon>
								<aicon v-else type="cartfill" :color="template.color.temp_color" size="20"></aicon>
							</view>
						</view>
					</view>
				</view>
				<view style="height: 120rpx;"></view>
			</scroll-view>
		</view>
		
		<tabbar :current="1" :cart="cartNums"></tabbar>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				storeInfo: uni.getStorageSync('__ddminiStoreInfo'),
				cartNums: 0,
				categoryList: [],
				categoryNums: 0,
				pageData: {
					page: 1,
					sizes: 10,
					total: 0
				},
				goodsList: [],
				userInfoData: ''
			}
		},
		onLoad() {
			let self = this;
			self.getCategoryList();
			self.getGoodsList();
		},
		onShow() {
			let self = this;
			self.getUserInfo();
			self.getCartList();
		},
		methods: {
			getUserInfo(){
				let self = this;
				self.Get(self.Url.userInfo).then(res => {
					if(res.code === 0){
						self.userInfoData = res.data;
					}
				})
			},
			selectCategoryTap(index){
				let self = this;
				self.categoryNums = index;
				self.pageData.page = 1;
				self.goodsList = [];
				self.getGoodsList();
			},
			getCategoryList(){
				let self = this;
				self.Get(self.Url.categoryList).then(res => {
					if(res.code === 0){
						let list = [{
							id: 0,
							title: '全部商品'
						}];
						let array = list.concat(res.data);
						self.categoryList = array;
					}
				})
			},
			scrolltolowerTap(){
				let self = this;
				self.pageData.page++;
				self.getGoodsList();
			},
			getGoodsList(){
				let self = this;
				let postData = {
					page: self.pageData.page,
					sizes: self.pageData.sizes
				}
				if(self.storeInfo){
					postData.store = self.storeInfo.id;
				}
				if(self.categoryNums){
					postData.category = self.categoryList[self.categoryNums].id;
				}else{
					postData.category = 0;
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						let data = res.data.list;
						if(self.goodsList.length>0){
							let list = self.goodsList.concat(data);
							self.goodsList = list;
						}else{
							self.goodsList = data;
						}
						self.pageData.total = res.data.page;
					}
				})
			},
			getCartList(){
				let self = this;
				self.Get(self.Url.cartList).then(res => {
					if(res.code === 0){
						let num = 0;
						res.data.forEach(itm => {
							num += itm.num;
						})
						self.cartNums = num;
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
							self.getCartList();
						}
					})
				}
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
			},
		}
	}
</script>

<style lang="less">
	page{
		background-color: #f2f2f2;
	}
	.menu_box{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left_box{
			width: 250rpx;
			height: 95vh;
			background-color: #fff;
			.label{
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #1f1f1f;
				span{
					width: 100%;
					border-left: 2px solid transparent;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 60%;
				}
			}
			.alabel{
				color: #F54319;
				font-weight: bold;
				background-color: #F5431910;
				span{
					border-color: #F54319;
				}
			}
		}
		.right_box{
			flex: 1;
			min-width: 0;
			height: 95vh;
			.goods{
				width: 92%;
				margin: 0 auto;
				background-color: #fff;
				border-radius: 10rpx;
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				.left{
					width: 180rpx;
					height: 180rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 150rpx;
						height: 150rpx;
						border-radius: 10rpx;
					}
				}
				.right{
					flex: 1;
					min-width: 0;
					.title{
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: #1f1f1f;
						font-size: 28rpx;
						width: 92%;
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
						width: 92%;
						display: flex;
						align-items: flex-end;
						justify-content: space-between;
						padding-top: 10rpx;
						.lefts{
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
						.rights{
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
	}
</style>
