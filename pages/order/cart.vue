<template>
	<view class="content">
		<view class="card_goods_list">
			<u-swipe-action>
				<u-swipe-action-item ref="action" :options="options" v-for="(item, index) in cartList" @click="delGoodsTap(index)" :key="index">
					<view class="goods" @click="selectGoodsTap(index)">
						<view class="left">
							<aicon v-if="item.select" type="roundcheckfill" color="#F54319" size="25"></aicon>
							<aicon v-else type="round" color="#eee" size="25"></aicon>
						</view>
						<view class="center">
							<image :src="item.pic" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="name_box">
								<view class="title">{{item.title}}</view>
								<view class="intro">
									<span v-for="(itm, idx) in item.spec_name" :key="idx">{{itm}}</span>
								</view>
							</view>
							<view class="box">
								<view class="price"><span>¥</span>{{item.mini_price}}</view>
								<view class="numbox">
									<view v-if="item.stock_number" class="buy">
										<view class="btn" @click.stop="editGoods(index, 'jian')">
											<aicon type="indeterminate-circle-fill" size="25" :color="item.num<=1?'#eee':'#F54319'"></aicon>
										</view>
										<view class="input">
											<input type="number" disabled :value="item.num" />
										</view>
										<view class="btn" @click.stop="editGoods(index, 'jia')">
											<aicon type="add-circle-fill" size="25" color="#F54319"></aicon>
										</view>
									</view>
									<view v-else class="none">库存不足</view>
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
			<view class="none_list_box" v-if="cartList.length===0" style="height: 40vh;">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>购物车空空的</span>
			</view>
		</view>
		<view v-if="cartList.length>0" class="card_footer">
			<view class="label">
				<view class="left" @click="selectAllTap()">
					<aicon v-if="cartSelectAll" type="checkbox-circle-fill" size="20" color="#F54319"></aicon>
					<aicon v-else type="checkbox-blank-circle-line" size="20" color="#eee"></aicon>
					<span>全选</span>
				</view>
				<view class="right">
					<view class="price">
						合计：<span>¥{{cartTotalMoney}}</span>
					</view>
					<view v-if="cartSelectList.length===0" class="btn_box" style="opacity: .5;">立即下单</view>
					<view v-else class="btn_box" @click="toPaypalTap()" >立即下单</view>
				</view>
			</view>
			<view class="hover_label"></view>
		</view>
		
		
		<view v-if="hotGoodsList.length>0" class="hot_goods_list">
			<view class="hot_head">
				<u-divider text="为您推荐以下商品"></u-divider>
			</view>
			<view class="goods_list">
				<view class="goods" v-for="(item, index) in hotGoodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
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
		</view>
		<tabbar :current="2" :cart="cartNums"></tabbar>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				options: [{
					text: '删除'
				}],
				cartList: [],
				cartTotalMoney: 0,
				cartSelectAll: true,
				cartSelectList: [],
				hotGoodsList: [],
				userInfoData: '',
				cartNums: 0
			}
		},
		onShow() {
			let self = this;
			self.getCartList();
		},
		onLoad() {
			let self = this;
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
			getCartList(){
				let self = this;
				self.Get(self.Url.cartList).then(res => {
					if(res.code === 0){
						let list = res.data;
						let num = 0;
						list.forEach(itm => {
							if(itm.stock_number>0 && itm.shelve_status){
								itm.select = true;
							}else{
								itm.select = false;
							}
							num += itm.num;
						})
						self.cartNums = num;
						self.cartList = list;
						self.getCheckCartNumber();
					}
				})
			},
			editGoods(index, type){
				let self = this;
				let nums = self.cartList[index].num;
				let stok = self.cartList[index].stock_number;
				if(type==='jian'){
					if(nums>1){
						self.cartList[index].num--;
					}
				}else if(type==='jia'){
					if(nums<stok){
						self.cartList[index].num++;
					}else{
						uni.showToast({title: '已超过最大库存数量', icon: 'none'});
					}
				}
				self.getCheckCartNumber();
				self.getCartEdit(self.cartList[index]);
			},
			selectGoodsTap(index){
				let self = this;
				let data = self.cartList[index];
				if(data.stock_number<=0){
					return uni.showToast({title: '商品库存不足', icon: 'none'});
				}else if(!data.shelve_status){
					return uni.showToast({title: '商品已下架', icon: 'none'});
				}else{
					self.cartList[index].select = !self.cartList[index].select;
					self.getCheckCartNumber();
				}
			},
			getCheckCartNumber(){
				let self = this;
				let cart = self.cartList;
				let total = 0;
				let status = false;
				let aum = 0;
				let bum = 0;
				let list = [];
				cart.forEach(itm => {
					if(itm.stock_number>0 && itm.shelve_status){
						aum++;
					}
					if(itm.select){
						bum++;
						total += itm.num * itm.mini_price;
						list.push(itm);
					}
				})
				self.cartTotalMoney = total.toFixed(2);
				self.cartSelectList = list;
				self.cartSelectAll = aum===bum;
			},
			selectAllTap(){
				let self = this;
				let cart = self.cartList;
				let status = self.cartSelectAll;
				cart.forEach(itm => {
					if(status){
						itm.select = false;
					}else{
						if(itm.stock_number>0 && itm.shelve_status){
							itm.select = true;
						}else{
							itm.select = false;
						}
					}
				})
				self.cartList = cart;
				self.getCheckCartNumber();
			},
			getCartEdit(data){
				let self = this;
				let postData = {
					id: data.id,
					number: data.num
				}
				if(data.spec_id){
					postData.spec = data.spec_id;
				}
				self.Get(self.Url.cartEdit, postData).then(res => {
					if(res.code === 0){
						console.log('购物车修改成功')
						if(data.dIndex!=undefined){
							self.cartList.splice(data.dIndex, 1);
							self.getCheckCartNumber();
							self.$refs.action[data.dIndex].closeHandler();
						}
						self.getCartList();
					}
				})
			},
			toPaypalTap(){
				let self = this;
				if(self.cartSelectList.length===0){
					return uni.showToast({title: '请选择要下单的商品', icon: 'none'});
				}
				if(app.globalData.user){
					uni.setStorage({key: '__ddminiShopCart',data: self.cartSelectList});
					uni.navigateTo({url: '/pages/order/paypal'});
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			getGoodsList(){
				let self = this;
				let postData = {
					page: 1,
					sizes: 10,
					recom: true
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						let data = res.data;
						self.hotGoodsList = data.list;
					}
				})
			},
			delGoodsTap(index){
				let self = this;
				let data = JSON.parse(JSON.stringify(self.cartList[index]));
				data.num = 0;
				data.dIndex = index;
				self.getCartEdit(data);
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
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
			}
		}
	}
</script>

<style lang="less">
	.card_goods_list{
		width: 750rpx;
		overflow-x: hidden;
		.goods{
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-width: 0;
			.left{
				width: 120rpx;
				height: 200rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.center{
				width: 200rpx;
				height: 240rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 200rpx;
					height: 200rpx;
					border-radius: 20rpx;
				}
			}
			.right{
				flex: 1;
				min-width: 0;
				padding-left: 30rpx;
				height: 190rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.name_box{
					width: 95%;
					.title{
						font-size: 30rpx;
						color: #1c1c1c;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.intro{
						color: #999;
						font-size: 26rpx;
						padding-top: 12rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				.box{
					width: 95%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.price{
						flex: 1;
						display: flex;
						align-items: center;
						font-size: 32rpx;
						font-weight: bold;
						color: #F54319;
						span{
							font-weight: normal;
							font-size: 26rpx;
							padding-right: 4rpx;
						}
					}
					.numbox{
						.none{
							color: #999;
							font-size: 26rpx;
						}
						.buy{
							display: flex;
							align-items: center;
							.btn{
								width: 50rpx;
								height: 50rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								aicon{
									width: 100%;
									height: 100%;
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}
							.input{
								width: 100rpx;
								height: 50rpx;
								background-color: #eee;
								margin: 0 6rpx;
								border-radius: 100rpx;
								input{
									width: 100%;
									height: 100%;
									text-align: center;
									font-size: 30rpx;
									color: #1c1c1c;
								}
							}
						}
					}
				}
			}
		}
	}
	
	.card_footer{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		background-color: #fff;
		padding-bottom: env(safe-area-inset-bottom);
		.label{
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 90%;
			margin: 0 auto;
			height: 100rpx;
			.left{
				display: flex;
				align-items: center;
				color: #999;
				span{
					padding-left: 10rpx;
				}
			}
			.right{
				display: flex;
				align-items: center;
				.price{
					color: #1c1c1c;
					font-size: 28rpx;
					margin-right: 50rpx;
					span{
						color: #F54319;
						font-weight: bold;
						font-size: 30rpx;
					}
				}
				.btn_box{
					background-color: #F54319;
					color: #fff;
					width: 200rpx;
					height: 70rpx;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 30rpx;
				}
			}
		}
		.hover_label{
			height: 120rpx;
			width: 100%;
			border-top: 1px solid #f5f5f5;
		}
	}
	
	.hot_goods_list{
		padding-top: 50rpx;
		padding-bottom: 110rpx;
		.hot_head{
			width: 80%;
			margin: 0 auto;
			padding: 20rpx 0;
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
</style>
