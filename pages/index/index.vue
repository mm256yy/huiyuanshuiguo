<template>
	<view v-if="template" class="content">
		<view class="fixed_head_box">
			<navBar @height="barHeight=$event" :store="storeData"></navBar>
		</view>
		<view class="swiper_box" v-if="swiperList.length>0">
			<swiper class="swiper" circular autoplay interval="10000" duration="500" @change="swiperChange">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<image @click="getPathTap(item.target_data)" lazy-load="true" mode="aspectFill" :src="item.pic" />
				</swiper-item>
			</swiper>
			<view class="swiper_dots">
				<block v-for="(item, index) in swiperList" :key="index">
					<view class="dot" :class="swiperCurrent==index?'active':''"></view>
				</block>
			</view>
		</view>
		<view class="menu_list_box" v-if="menuList.length>0">
			<view class="menu" v-for="(item, index) in menuList" :key="index" @click="getMenuTap(item)">
				<view class="image">
					<image :src="item.icon||item.pic" mode="aspectFill"></image>
				</view>
				<view class="title">{{item.title}}</view>
			</view>
		</view>
		<view class="pintuan_list_box" v-if="pintuanGoodsList.length>0">
			<view class="head">
				<view class="left">
					<aicon type="hotfill" size="18"></aicon>
					<span>火爆拼团</span>
				</view>
				<view class="right" @click="getPathTap('/pages/index/pintuanList')">更多拼团<aicon type="unfold-copy" size="15"></aicon></view>
			</view>
			<view class="list_box">
				<view class="list" v-for="(item, index) in pintuanGoodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
					<view class="image">
						<image :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="info">
						<view class="tag"><span>{{item.pintuan_peoples}}人团</span></view>
						<view class="title">{{item.title}}</view>
						<view class="box">
							<view class="price">¥{{item.pintuan_price}}<span>¥{{item.mini_price}}</span></view>
							<view class="buy">去开团</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pintuan_list_box" style="background-color: #FF6D20;" v-if="miaoshaGoodsList.length>0">
			<view class="head">
				<view class="left">
					<aicon type="countdownfill" size="18"></aicon>
					<span>限时秒杀</span>
				</view>
				<view class="right" @click="getPathTap('/pages/index/miaoshaList')">更多秒杀<aicon type="unfold-copy" size="15"></aicon></view>
			</view>
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
							<view class="buy" style="background-color: #FF6D20;">去抢购</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="all_list_box">
			<scroll-view scroll-x scroll-with-animation class="head_box" :style="{top: barHeight+'px'}">
				<view class="list" :class="{alabel: categoryNums===item.id}" v-for="(item, index) in categoryList" :key="index" @click="selectCategoryTap(item.id)">
					<span>{{item.title}}</span>
				</view>
			</scroll-view>
			<view class="goods_list">
				<view class="goods" v-for="(item, index) in allGoodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
					<view class="image">
						<image :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="info">
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
					</view>
				</view>
			</view>
			<view class="none_list_box" v-if="allGoodsList.length===0" style="height: 50vh;">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>商品正在上新中</span>
			</view>
		</view>
		
		<view class="coupons_ico" v-if="couponsData" @click="couponsShow=true">
			<image src="../../static/images/coupons_ico.png" mode="aspectFill"></image>
			<view class="number"><span>¥</span>{{couponsData.moneys}}</view>
		</view>
		
		<u-popup :show="couponsShow" :safeAreaInsetBottom="false" mode="center" bgColor="transparent" @close="couponsShow=false">
			<view class="coupons_show_box">
				<image class="bg" src="../../static/images/coupons_bg.png" mode="aspectFill"></image>
				<view class="coupons_box">
					<view class="number">
						<span>¥</span>{{couponsData.moneys}}
					</view>
					<view class="text">满{{couponsData.min_money}}元使用，领券下单更优惠</view>
				</view>
				<view class="coupons_info">
					<view class="title">{{couponsData.title}}</view>
					<view class="text">
						<span v-if="couponsData.time_type===1">领取后{{couponsData.time_day}}天有效</span>
						<span v-if="couponsData.time_type===2">{{couponsData.time_day}}前有效</span>
					</view>
					<view class="button" @click="getAddCouponsTap()">立即领取</view>
				</view>
			</view>
		</u-popup>
		
		<tabbar :current="0" :cart="cartNums"></tabbar>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				barHeight: 0,
				template: '',
				swiperCurrent: 0,
				swiperList: [],
				menuList: [],
				pintuanGoodsList: [],
				miaoshaGoodsList: [],
				categoryList: [],
				categoryNums: 0,
				timeData: {},
				allGoodsList: [],
				userInfoData: '',
				storeData: '',
				cartNums: 0,
				couponsData: '',
				couponsShow: false
			}
		},
		onShareAppMessage() {
			let self = this;
			let shop = uni.getStorageSync('__ddminiShopInfo');
			let user = self.userInfoData;
			let path = 'pages/index/index';
			if(user.profitsharing){
				path = 'pages/index/index?fenz='+user.id
			}
			return {
				title: shop.shop_share_title,
				imageUrl: shop.shop_share_pic,
				path: path
			}
		},
		onShareTimeline() {
			let self = this;
			let shop = uni.getStorageSync('__ddminiShopInfo');
			return {
				title: shop.shop_share_title,
				imageUrl: shop.shop_share_pic
			}
		},
		onLoad(e) {
			let self = this;
			let template = {
				color: {
					temp_color: '#F54319',
					tive_color: '#FF6D20',
					none_color: '#BBBBBB'
				}
			}
			self.template = template;
			uni.setStorage({key: '__ddminiTemplateConfig',data: template});
			uni.$on('store', function(res){
				uni.setStorage({key: '__ddminiStoreInfo',data: res});
				self.storeData = res;
				self.getBannerList();
				self.getPintuanGoodsList();
				self.getMiaoshaGoodsList();
				self.getAllGoodsList();
			})
			if(e.scene){
				let scene = decodeURIComponent(e.scene);
				let object = {};
				scene.split(',').forEach(itm => {
					object[itm.split('=')[0]] = itm.split('=')[1];
				})
				if(object.g){
					uni.navigateTo({url: '/pages/index/details?id='+object.g});
				}
				if(object.f){
					uni.setStorageSync('__ddminiFenzUid', object.f);
				}
			}
			if(e.goods){
				uni.navigateTo({url: '/pages/index/details?id='+e.goods});
			}
			if(e.pintuan){
				uni.navigateTo({url: '/pages/index/pintuan?id='+e.pintuan});
			}
			if(e.fenz){
				uni.setStorageSync('__ddminiFenzUid', e.fenz);
			}
			self.gteStoreList();
			self.getCouponsGoods();
		},
		onShow(){
			let self = this;
			self.getCartList();
		},
		methods: {
			getCouponsGoods(){
				let self = this;
				self.Post(self.Url.couponsGoods, {ctype: 1}).then(res => {
					if(res.code === 0){
						let data = res.data.find(itm => itm.user_status);
						if(data){
							self.couponsData = data;
						}
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
			gteStoreList(){
				let self = this;
				let postData = {};
				uni.getLocation({
					complete(ces) {
						if(ces.latitude){
							postData.latitude = ces.latitude;
							postData.longitude = ces.longitude;
							postData.current = true;
						}
						self.Get(self.Url.storeList, postData).then(res => {
							if(res.code === 0){
								if(res.data.length>0){
									self.storeData = res.data[0];
									uni.setStorage({key: '__ddminiStoreInfo',data: self.storeData});
								}
								self.getBannerList();
								self.getUserInfo();
							}
						})
					}
				})
			},
			getUserInfo(){
				let self = this;
				self.Get(self.Url.userInfo).then(res => {
					if(res.code === 0){
						self.userInfoData = res.data;
					}
					self.getPintuanGoodsList();
					self.getMiaoshaGoodsList();
					self.getAllGoodsList();
				})
			},
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
			},
			getBannerList(){
				let self = this;
				let postData = {};
				if(self.storeData){
					postData.store = self.storeData.id;
				}
				self.Get(self.Url.bannerList, postData).then(res => {
					if(res.code === 0){
						let data = res.data;
						let homeAd = data.filter(itm => itm.ctype==='homeAd');
						let homeMu = data.filter(itm => itm.ctype==='homeMu');
						self.swiperList = homeAd;
						self.menuList = homeMu;
						self.getCategoryList();
					}
				})
			},
			getCategoryList(){
				let self = this;
				let postData = {};
				if(self.storeData){
					postData.store = self.storeData.id;
				}
				self.Get(self.Url.categoryList, postData).then(res => {
					if(res.code === 0){
						let homeMu = res.data.filter(itm => itm.ctype==='homeMu').concat(self.menuList);
						let list = [{
							id: 0,
							title: '热卖推荐'
						}];
						let homeAll = res.data.filter(itm => itm.ctype==='homeAll');
						let allList = list.concat(homeAll);
						self.menuList = homeMu;
						self.categoryList = allList;
					}
				})
			},
			getPintuanGoodsList(){
				let self = this;
				let postData = {
					pintuan: true,
					recom: true
				}
				if(self.storeData){
					postData.store = self.storeData.id;
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						self.pintuanGoodsList = res.data.list;
					}
				})
			},
			getMiaoshaGoodsList(){
				let self = this;
				let postData = {
					shelf_down: true,
					recom: true
				}
				if(self.storeData){
					postData.store = self.storeData.id;
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
			getAllGoodsList(){
				let self = this;
				let postData = {
					page: 1,
					sizes: 50,
					order: 3,
				};
				if(self.categoryNums){
					postData.category = self.categoryNums;
				}else{
					postData.recom = true;
				}
				if(self.storeData){
					postData.store = self.storeData.id;
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						self.allGoodsList = res.data.list;
					}
				})
			},
			onChange(e) {
				this.timeData = e
			},
			selectCategoryTap(id){
				this.categoryNums = id;
				this.allGoodsList = [];
				this.getAllGoodsList();
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
			},
			getMemberPriceTap(data){
				let self = this;
				let user = self.userInfoData;
				if(data.vip_price.length>0){
					if(user.level_id){
						let money = data.vip_price.find(itm => itm.id === user.level_id);
						return money.price;
					}else{
						let array = data.vip_price.map(itm => {return itm.price});
						let money = Math.max(...array);
						return money;
					}
				}else{
					return '';
				}
			},
			getMenuTap(data){
				let self = this;
				if(data.icon){
					app.globalData.getPathTap('/pages/index/category?id='+data.id);
				}else{
					app.globalData.getPathTap(data.target_data);
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
			getAddCouponsTap(){
				let self = this;
				let data = self.couponsData;
				if(!app.globalData.user){
					return uni.navigateTo({url: '/pages/user/login'});
				}
				self.Get(self.Url.couponsUserAdd, {id: data.id}).then(res => {
					if(res.code === 0){
						uni.showToast({title: '领取成功', icon: 'none'});
						self.couponsShow = false;
						self.couponsData = '';
					}else{
						uni.showModal({
							content: res.msg,
							showCancel: false
						})
					}
				})
			}
			
		}
	}
</script>

<style lang="less">
	.swiper_box{
		width: 92%;
		height: 650rpx;
		position: relative;
		background-color: #fff;
		margin: 0 auto;
		border-radius: 20rpx;
		overflow: hidden;
		margin-top: 20rpx;
		swiper{
			width: 100%;
			height: 100%;
			margin: 0 auto;
			overflow: hidden;
		}
		.swiper_dots{
			position: absolute;
			bottom: 30rpx;
			display: flex;
			justify-content: center;
			width: 100%;
			z-index: 6;
			left: 0;
			right: 0;
			margin: 0 auto;
			.dot {
				margin: 0 4rpx;
				width: 20rpx;
				height: 4rpx;
				background: #fff;
				transition: all 0.2s;
				opacity: 0.5;
			}		
			.active {
				opacity: 1;
			}
		}
	}
	.menu_list_box{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		width: 92%;
		margin: 0 auto;
		padding-top: 60rpx;
		.menu{
			flex-basis: 20%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			margin-bottom: 30rpx;
			.image{
				image{
					width: 100rpx;
					height: 100rpx;
				}
			}
			.title{
				color: #1f1f1f;
				font-size: 26rpx;
				padding-top: 10rpx;
			}
		}
	}
	.pintuan_list_box{
		width: 92%;
		margin: 0 auto;
		// background-image: linear-gradient(to right, #F54319, #FF6D20);
		background-color: #F54319;
		border-radius: 20rpx;
		overflow: hidden;
		margin-top: 50rpx;
		.head{
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 90%;
			margin: 0 auto;
			height: 120rpx;
			color: #fff;
			.left{
				font-weight: bold;
				font-size: 32rpx;
				background-image: linear-gradient(to right, #ffffff, #ffdecc);
				color: #F54319;
				border-radius: 100rpx;
				padding: 0 20rpx;
				height: 50rpx;
				display: flex;
				align-items: center;
			}
			.right{
				color: #fff;
				font-size: 28rpx;
			}
		}
		.list_box{
			background-color: #fff;
			width: 96%;
			margin: 0 auto;
			margin-bottom: 14rpx;
			border-radius: 20rpx;
			padding-top: 30rpx;
			.list{
				width: 92%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 30rpx;
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
							color: #F54319;
							font-size: 38rpx;
							span{
								color: #999;
								font-size: 26rpx;
								margin-left: 10rpx;
								text-decoration: line-through;
							}
						}
						.buy{
							background-color: #F54319;
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
	}
	.all_list_box{
		width: 100%;
		padding-top: 30rpx;
		.head_box{
			width: 100%;
			height: 100rpx;
			white-space: nowrap;
			background-color: #fff;
			position: sticky;
			left: 0;
			top: 0;
			z-index: 100;
			.list{
				display: inline-block;
				line-height: 100rpx;
				color: #1f1f1f;
				font-size: 30rpx;
				padding-left: 40rpx;
				padding-right: 20rpx;
				span{
					color: #1f1f1f;
					border-bottom: 3px solid #fff;
					height: 86rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			.alabel{
				span{
					color: #F54319;
					border-color: #F54319;
				}
			}
		}
		.goods_list{
			width: 92%;
			padding-top: 40rpx;
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
	}
	.coupons_ico{
		position: fixed;
		bottom: 200rpx;
		right: 30rpx;
		width: 120rpx;
		height: 120rpx;
		z-index: 100;
		animation: bounce-down 2s linear infinite;
		.number{
			position: absolute;
			top: 0;
			width: 100%;
			height: 96rpx;
			display: flex;
			align-items: flex-end;
			justify-content: center;
			color: #fff;
			font-size: 36rpx;
			font-weight: bold;
			span{
				font-weight: normal;
				font-size: 26rpx;
				margin-bottom: 6rpx;
				padding-right: 2rpx;
			}
		}
	}
	
	.coupons_show_box{
		.bg{
			width: 750rpx;
			height: 750rpx;
		}
		.coupons_box{
			position: absolute;
			top: 0;
			width: 100%;
			height: 394rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: flex-end;
			.number{
				color: #f4203f;
				font-size: 100rpx;
				font-weight: bold;
				display: flex;
				align-items: flex-start;
				line-height: 100rpx;
				span{
					font-size: 50rpx;
					padding-right: 8rpx;
					margin-top: -16rpx;
				}
			}
			.text{
				border-top: 1px dashed #efbd9b;
				color: #efbd9b;
				font-size: 22rpx;
				width: 320rpx;
				text-align: center;
				margin-top: 10rpx;
				padding-top: 10rpx;
			}
		}
		.coupons_info{
			position: absolute;
			bottom: 0;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			height: 290rpx;
			.title{
				color: #fff;
				font-size: 42rpx;
				font-weight: bold;
			}
			.text{
				color: #fff;
				opacity: .8;
				font-size: 26rpx;
				padding: 12rpx 0;
			}
			.button{
				background-color: #fddfb6;
				width: 320rpx;
				height: 66rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #cc3111;
				font-weight: bold;
				border-radius: 100rpx;
				box-shadow: 0 10rpx 20rpx;
			}
		}
	}
	
	@keyframes bounce-down {
	  25% {transform: scale(1.07);}
	  50%, 100% {transform: scale(1);}
	  75% {transform: scale(1.07);}
	}
</style>
