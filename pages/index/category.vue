<template>
	<view class="content">
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
	</view>
</template>
<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				categoryId: '',
				allGoodsList: [],
				userInfoData: ''
			}
		},
		onLoad(e) {
			let self = this;
			self.categoryId = e.id;
			self.getUserInfo();
			self.Get(self.Url.categoryList, {pid: e.id}).then(res => {
				if(res.code === 0){
					let data = res.data[0];
					if(data){
						uni.setNavigationBarTitle({title: data.title});
					}
				}
			})
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
			getGoodsList(){
				let self = this;
				let postData = {
					page: 1,
					sizes: 100,
					category: self.categoryId,
					order: 3
				}
				self.Get(self.Url.goodsList, postData).then(res => {
					if(res.code === 0){
						self.allGoodsList = res.data.list;
					}
				})
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
		}
	}
</script>

<style lang="less">
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
</style>
