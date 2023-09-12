<template>
	<view class="content" v-if="goodsDetail">
		<view class="swiper_box">
			<swiper class="swiper" :current="swiperCurrent" circular autoplay interval="6000" duration="500" @change="swiperChange">
				<swiper-item v-for="(item, index) in goodsDetail.pic_list" :key="index">
					<image lazy-load="true" mode="aspectFill" :src="item.pic" />
				</swiper-item>
			</swiper>
			<view class="swiper_dots" :style="{bottom: goodsDetail.buyEndTime?'100rpx':'20rpx'}">
				<block v-for="(item, index) in goodsDetail.pic_list" :key="index">
					<view class="dot" :class="swiperCurrent==index?'active':''"></view>
				</block>
			</view>
			<view v-if="goodsDetail.buyEndTime" class="time_box" :style="{backgroundColor: template.color.temp_color}">
				<view class="label">
					<span class="xianshi">限时购：</span>
					<u-count-down
						:time="goodsDetail.buyEndTime"
						format="DD:HH:mm:ss"
						autoStart
						millisecond
						@change="onChange"
					>
						<view class="time">
							<text class="time__item">{{timeData.days>9?timeData.days:'0'+timeData.days}}天</text>
							<text class="time__item">{{timeData.hours>10?timeData.hours:'0'+timeData.hours}}时</text>
							<text class="time__item">{{timeData.minutes}}分</text>
							<text class="time__item">{{timeData.seconds}}秒</text>
						</view>
					</u-count-down>
					<view class="tips" @click="getTimeTipsTap()">
						<aicon type="question" size="20"></aicon>
					</view>
				</view>
			</view>
		</view>
		<view v-if="goodsDetail.specs_list" class="specs_list_box box_show">
			<view class="left">
				<span>{{goodsDetail.specs_list.specification[0].name}}</span>
			</view>
			<scroll-view scroll-x scroll-with-animation :scroll-into-view="selectSpecsChildInto" class="right">
				<block v-for="(item, index) in goodsDetail.specs_list.childProductArray" :key="index">
					<span :id="'to_'+index"></span>
					<view class="spec" :class="{aspec: selectSpecsChild.child_product_id===item.child_product_id}" @click="selectChildTap(item, index)">
						<image v-if="item.child_product_pic" :src="item.child_product_pic" mode="aspectFill"></image>
						<block v-else>
							<span v-for="(itm, idx) in item.child_product_spec" :key="idx">{{itm}}</span>
						</block>
					</view>
				</block>
			</scroll-view>
		</view>
		<view v-if="selectSpecsChild" class="select_box box_show">
			<view class="text">
				<view class="set">已选择：{{selectSpecsChild.child_product_value}}</view>
				<view class="del" @click="selectSpecsChild=''">清除选择</view>
			</view>
		</view>
		<view class="goods_info_box box_show">
			<view v-if="goodsDetail.ctype==='score'" class="price_box">
				<view class="price">{{selectSpecsChild.child_product_score||goodsDetail.mini_score}}<span class="score">积分</span></view>
			</view>
			<view v-else-if="pintuanConfig" class="pintuan_price_box">
				<view class="label">
					<view class="price">
						<view class="pt"><span>拼团价</span>¥{{selectSpecsChild.child_product_pintuan||goodsDetail.pintuan_price}}</view>
						<view class="old">原价¥{{selectSpecsChild.child_product_price||goodsDetail.mini_price}}</view>
					</view>
					<view v-if="pintuanConfig" class="txt">{{pintuanConfig.peoples}}人团</view>
				</view>
			</view>
			<view v-else class="price_box">
				<view class="price"><span>¥</span>{{selectSpecsChild.child_product_price||goodsDetail.mini_price}}</view>
				<view class="old" v-if="selectSpecsChild.child_product_cost||goodsDetail.max_price">¥{{selectSpecsChild.child_product_cost||goodsDetail.max_price}}</view>
				<view class="button" @click="getPathTap('/pages/index/coupons')">
					<span>领券</span>
					<aicon type="unfold-copy" size="18" color="#fff"></aicon>
				</view>
			</view>
			<view class="title">{{goodsDetail.title}}<span v-if="selectSpecsChild">/{{selectSpecsChild.child_product_value}}</span></view>
			<view class="intro">{{goodsDetail.introduce}}</view>
			<view class="box">
				<view class="box_label">
					<view class="left">
						<view v-if="selectSpecsChild" class="stock" :style="{color:selectSpecsChild.child_product_stock>10?'#19be6b':'#F54319'}">{{selectSpecsChild.child_product_stock>10?'库存充足': `库存仅剩${selectSpecsChild.child_product_stock||0}${goodsDetail.goods_unit||'件'}`}}</view>
						<view v-else class="stock" :style="{color:goodsDetail.stock_number>10?'#19be6b':'#F54319'}">{{goodsDetail.stock_number>10?'库存充足': `库存仅剩${goodsDetail.stock_number||0}${goodsDetail.goods_unit||'件'}`}}</view>
					</view>
					<view class="right">
						<view class="label" @click="shareShow=!shareShow">
							<aicon type="forward" size="21" color="#999"></aicon>
							<span>分享</span>
						</view>
						<view class="label" @click="getFavoriteAdd()">
							<aicon v-if="goodsDetail.fav_status" type="favorfill" size="22" color="#F54319"></aicon>
							<aicon v-else type="favor" size="22" color="#999"></aicon>
							<span>{{goodsDetail.fav_status?'取消':'收藏'}}</span>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="pintuan_info_box box_show" v-if="goodsDetail.pintuan_id">
			<view class="head_box">
				<view class="head">
					<view class="left">组队拼团</view>
					<view class="right" v-if="pintuanGoodsList.length>0">{{pintuanGoodsList.length}}人正在拼团，可立即参与</view>
				</view>
			</view>
			<view class="user_box" v-if="pintuanGoodsList.length>0">
				<view class="user" v-for="(item, index) in pintuanGoodsList" :key="index" :style="{borderBottomStyle:(index+1)===pintuanGoodsList.length?'none':'solid'}">
					<view class="img">
						<image :src="item.join_user[0].avatar" mode="aspectFill"></image>
					</view>
					<view class="info">
						<view class="name">{{item.join_user[0].nickname}}</view>
						<view class="text">仅差{{item.peoples-item.join_user.length}}人<span>距离结束<u-count-down :time="getTotalTimeTap(item.endtime_stamp)" format="HH:mm:ss"></u-count-down></span></view>
					</view>
					<view class="btn_box">
						<view class="btn" @click="joinPintuanTap(item)">立即参团</view>
					</view>
				</view>
			</view>
			<view class="intro_box">
				<view class="label">
					<aicon type="round_light_fill" size="35" color="#F54319"></aicon>
					<view class="text">开团/参团</view>
				</view>
				<view class="line">
					<aicon type="unfold-copy" size="20" color="#F54319"></aicon>
				</view>
				<view class="label">
					<aicon type="round_friend_fill" size="35" color="#F54319"></aicon>
					<view class="text">邀请好友</view>
				</view>
				<view class="line">
					<aicon type="unfold-copy" size="20" color="#F54319"></aicon>
				</view>
				<view class="label">
					<aicon type="round_text_fill" size="35" color="#F54319"></aicon>
					<view class="text">
						<span>拼团成功发货</span>
						<span class="txt">失败自动退款</span>
					</view>
				</view>
			</view>
		</view>
		
		<view class="goods_content_box box_show" v-if="goodsDetail.contents">
			<view class="head_tit">商品详情</view>
			<u-parse :content="goodsDetail.contents" :lazy-load="true" :preview-img="false" :tag-style="tagStyle"></u-parse>
		</view>
		
		<view class="seat_box">
			<view class="seat"></view>
		</view>
		<view class="footer box_shadow">
			<view class="label">
				<view class="left">
					<view class="lab">
						<view class="ico">
							<aicon type="servicefill" size="22" color="#999"></aicon>
						</view>
						<span>客服</span>
						<button open-type="contact"></button>
					</view>
					<view v-if="!goodsDetail.pintuan_id && goodsDetail.ctype!='score'" class="lab" @click="getPathTap('/pages/order/cart')">
						<view class="ico">
							<aicon type="cartfill" size="22" color="#999"></aicon>
							<span v-if="cartNumber">{{cartNumber}}</span>
						</view>
						<span>购物车</span>
					</view>
				</view>
				<view v-if="goodsDetail.ctype==='score'" class="right">
					<view class="button all" @click="getBuyShopCart('score')">立即兑换</view>
				</view>
				<view v-else-if="goodsDetail.pintuan_id" class="right">
					<view class="button" @click="getBuyShopCart('buy')">原价购买¥{{selectSpecsChild.child_product_price||goodsDetail.mini_price}}</view>
					<view class="button" @click="getBuyShopCart('pintuan')">拼团购买¥{{selectSpecsChild.child_product_pintuan||goodsDetail.pintuan_price}}</view>
				</view>
				<view v-else class="right">
					<view class="button" @click="getBuyShopCart('cart')">加入购物车</view>
					<view class="button" @click="getBuyShopCart('buy')">立即购买</view>
				</view>
			</view>
		</view>
		
		<u-modal :show="shareShow" width="500rpx" closeOnClickOverlay @close="shareShow=false" title="选择分享方式">
			<view slot="default">
				<view class="share_box">
					<view class="label" @click="[shareCoverShow=true, shareShow=false]">
						<aicon type="picfill" size="30" color="#F54319"></aicon>
						<span>生成海报</span>
					</view>
					<view class="label">
						<aicon type="weixin" size="30" color="#07c160"></aicon>
						<span>分享好友</span>
						<button open-type="share"></button>
					</view>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</u-modal>
		
		<shareCoverPic v-if="shareCoverShow" :goodsData="goodsDetail" @closeShare="shareCoverShow = false"></shareCoverPic>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				goodsId: '',
				goodsDetail: '',
				swiperCurrent: 0,
				tagStyle: {
					img: 'display:block'
				},
				timeData: {},
				selectSpecsChild: '',
				selectSpecsChildInto: '',
				selectSpecsChildIndex: 0,
				buyNumMax: 0,
				cartNumber: 0,
				shareShow: false,
				shareCoverShow: false,
				pintuanConfig: '',
				pintuanGoodsList: [],
				buyNumber: 0,
				userInfoData: ''
			}
		},
		onLoad(e) {
			let self = this;
			self.goodsId = e.id;
			self.getGoodsDetail();
			// console.log(self.goodsDetail,'222222')
			self.getCartList();
			self.getUserInfo();
		},
		onShareAppMessage() {
			let self = this;
			let goods = self.goodsDetail;
			let user = self.userInfoData;
			// self.shareShow = false;
			let path = `/pages/index/index?goods=${goods.id}`;
			if(user.profitsharing){
				path = `/pages/index/index?goods=${goods.id}&fenz=${user.id}`;
			}
			return {
				title: goods.title,
				imageUrl: goods.pic_list[0].pic,
				path: path,
			}
		},
		onShareTimeline() {},
		methods: {
			getUserInfo(){
				let self = this;
				self.Get(self.Url.userInfo).then(res => {
					if(res.code === 0){
						self.userInfoData = res.data;
						console.log(self.userInfoData,'userInfoData')
					}
				})
			},
			onChange(e) {
				this.timeData = e
			},
			getFavoriteAdd(){
				let self = this;
				if(app.globalData.user){
					let postData = {
						id: self.goodsDetail.id,
						type: !self.goodsDetail.fav_status
					}
					self.Get(self.Url.favoriteAdd, postData).then(res => {
						if(res.code === 0){
							self.goodsDetail.fav_status = !self.goodsDetail.fav_status;
							uni.showToast({title: self.goodsDetail.fav_status?'收藏成功':'取消收藏'});
						}
					})
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			getCartList(){
				let self = this;
				self.Get(self.Url.cartList).then(res => {
					if(res.code === 0){
						let number = 0;
						res.data.forEach(itm => {
							number += itm.num;
						})
						self.cartNumber = number;
					}
				})
			},
			getGoodsDetail(){
				let self = this;
				uni.showLoading({title: '商品加载中', mask: true});
				self.Get(self.Url.goodsDetail, {id: self.goodsId}).then(res => {
					if(res.code === 0){
						uni.hideLoading();					
						let data = res.data;
						console.log(data,'00000000');
						if(data.shelf_down_time_stamp){
							let time = new Date().getTime();
							data.buyEndTime = data.shelf_down_time_stamp - time;
						}
						uni.setNavigationBarTitle({title: data.title});
						if(data.stock_number){
							self.buyNumber = 1;
						}
						self.goodsDetail = data;
						// 商品详情
						console.log(self.goodsDetail,'goodsDetail');
						if(data.specs_list){
							self.getSpecsImage();
						}
						if(data.pintuan_id){
							self.getPintuanConfig();
							self.getPintuanGoods();
						}
					}else{
						uni.hideLoading();
						uni.showModal({
							content: '商品不存在',
							showCancel: false,
							success(ces) {
								if(ces.confirm){
									uni.navigateBack();
								}
							}
						})
					}
				})
			},
			getPintuanConfig(){
				let self = this;
				let postData = {
					goods_id: self.goodsDetail.id
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
					goods_id: self.goodsDetail.id
				}
				self.Get(self.Url.pintuanGoods, postData).then(res => {
					if(res.code === 0){
						self.pintuanGoodsList = res.data.list;
					}
				})
			},
			getSpecsImage(){
				let self = this;
				let data = self.goodsDetail;
				data.specs_list.childProductArray.forEach(itm => {
					let entries = Object.entries(itm.child_product_spec)[0];
					itm.child_product_key = entries[0];
					itm.child_product_value = entries[1];
				})
				self.goodsDetail = data;
			},
			selectChildTap(data, index){
				let self = this;
				self.selectSpecsChild = data;
				if(self.selectSpecsChildIndex<index){
					self.selectSpecsChildInto = 'to_'+(index-1);
				}else{
					self.selectSpecsChildInto = `to_${(index-3)<=0?0:index-3}`;
				}
				if(data.child_product_pic){
					let list = self.goodsDetail.pic_list;
					let index = list.findIndex(itm => itm.pic === data.child_product_pic);
					if(index>=0){
						self.swiperCurrent = index;
					}else{
						self.goodsDetail.pic_list.unshift({
							pic: data.child_product_pic
						})
						self.swiperCurrent = 0;
					}
				}
			},
			getBuyShopCart(type, ptID) {
				let self = this;
				let goods = self.goodsDetail;
				let specs = self.selectSpecsChild;
				if(app.globalData.user){
					if(goods.specs_status && !specs){
						return uni.showToast({title: '请选择商品规格', icon: 'none'});
					}else if(specs && specs.child_product_stock===0){
						return uni.showToast({title: '选择的规格库存不足', icon: 'none'});
					}
					let addOrder = () => {
						let postData = {
							id: goods.id,
							number: self.buyNumber
						}
						if(specs){
							postData.spec = specs.child_product_id;
						}
						if(type=='buy' || type=='pintuan' || type=='joinPintuan' || type=='score'){
							let resData = {
								id: goods.id,
								num: self.buyNumber,
								pic: goods.pic_list[0].pic,
								shelve_status: goods.shelve_status,
								stock_number: self.buyNumMax,
								title: goods.title,
								active: true,
								ctype: goods.ctype
							}
							if(goods.specs_list){
								resData.spec_id = self.selectSpecsChild.child_product_id;
								resData.spec_name = self.propertyChildNames;
								resData.mini_price = self.selectSpecsChild.child_product_price;
								resData.mini_score = self.selectSpecsChild.child_product_score;
							}else{
								resData.mini_price = goods.mini_price;
								resData.mini_score = goods.mini_score;
							}
							if(self.pintuanConfig){
								resData.mini_price = self.selectSpecsChild.child_product_pintuan||goods.pintuan_price;
							}
							uni.setStorage({key: '__ddminiShopCart',data: [resData]});
							let path = '/pages/order/paypal';
							if(type==='pintuan'){
								path = '/pages/order/paypal?type=pintuan';
							}else if(type==='joinPintuan'){
								path = '/pages/order/paypal?type=pintuan&pintuanId='+ptID;
							}
							uni.navigateTo({url: path});
							return
						}
						self.Get(self.Url.cartAdd, postData).then(res => {
							if(res.code == 0){
								uni.showToast({title: '加入成功'});
								self.getCartList();
							}else{
								uni.showModal({content: res.msg, showCancel: false});
							}
						});
					}
					if(type==='pintuan'){
						let tuanData = {
							goods_id: goods.id
						}
						self.Get(self.Url.pintuanCheck, tuanData).then(res => {
							if(res.code === 0){
								addOrder();
							}else{
								uni.showModal({
									content: res.msg,
									showCancel: false
								})
							}
						})
					}else{
						addOrder();
					}
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			joinPintuanTap(data){
				let self = this;
				if(app.globalData.user){
					let tuanData = {
						goods_id: self.goodsDetail.id,
						tuan_id: data.id
					}
					self.Get(self.Url.pintuanCheck, tuanData).then(res => {
						if(res.code === 0){
							self.getBuyShopCart('joinPintuan', data.id)
						}else{
							uni.showModal({
								content: res.msg,
								showCancel: false
							})
						}
					})
				}else{
					uni.navigateTo({url: '/pages/user/login'});
				}
			},
			getTotalTimeTap(time){
				let time2 = new Date().getTime();
				let str = time-time2;
				console.log(str);
				return str
			},
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
			},
			getTimeTipsTap(){
				uni.showModal({
					content: '限时抢购中，到期后将自动下架，时间有限，先到先得！',
					showCancel: false
				})
			},
			
		}
	}
</script>

<style lang="less">
	page{
		background-color: #f2f2f2;
	}
	.child_pic_box{
		width: 100%;
		height: 600rpx;
		position: relative;
	}
	.swiper_box{
		width: 100%;
		height: 600rpx;
		position: relative;
		swiper{
			width: 100%;
			height: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.swiper_dots{
			position: absolute;
			bottom: 20rpx;
			display: flex;
			justify-content: center;
			width: 95%;
			z-index: 6;
			left: 0;
			right: 0;
			margin: 0 auto;
			.dot {
				margin: 0 4rpx;
				width: 10rpx;
				height: 10rpx;
				background: #fff;
				border-radius: 20rpx;
				transition: all 0.1s;
				opacity: 0.5;
			}		
			.active {
				opacity: 1;
				background: #F54319;
			}
		}
		.time_box{
			display: flex;
			align-items: center;
			color: #fff;
			font-size: 30rpx;
			position: absolute;
			width: 100%;
			bottom: 0;
			height: 80rpx;
			.label{
				width: 90%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				.xianshi{
					font-size: 36rpx;
					font-weight: bold;
				}
				.time__item{
					padding-right: 6rpx;
				}
				.tips{
					position: absolute;
					right: 0;
					top: 0;
					width: 80rpx;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
	.specs_list_box{
		width: 95%;
		margin: 0 auto;
		background-color: #fff;
		margin-top: 30rpx;
		border-radius: 20rpx;
		height: 150rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		.left{
			width: 150rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			// border-right: 1px dashed #f5f5f5;
			background-color: #fff;
			color: #1c1c1c;
			font-size: 28rpx;
			span{
				width: 80%;
				margin: 0 auto;
				text-align: center;
			}
		}
		.right{
			flex: 1;
			height: 104rpx;
			min-width: 0;
			white-space: nowrap;
			.spec{
				display: inline-block;
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
				overflow: hidden;
				border: 1px solid #efefef;
				margin-left: 20rpx;
				line-height: 100rpx;
				text-align: center;
				font-size: 26rpx;
				color: #999;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.aspec{
				border-color: #F54319;
				color: #F54319;
			}
		}
	}
	.select_box{
		width: 95%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 30rpx;
		.text{
			width: 90%;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 auto;
			.set{
				color: #1c1c1c;
				font-size: 28rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 75%;
			}
			.del{
				color: #F54319;
				border: 1px solid #F54319;
				padding: 0 14rpx;
				border-radius: 100rpx;
				font-size: 24rpx;
				height: 42rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	.goods_info_box{
		width: 95%;
		margin: 0 auto;
		background-color: #fff;
		margin-top: 30rpx;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		.price_box{
			width: 90%;
			margin: 0 auto;
			padding: 40rpx 0 30rpx;
			display: flex;
			align-items: center;
			.price{
				color: #F54319;
				font-size: 42rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				span{
					font-size: 30rpx;
					padding-right: 4rpx;
					margin-bottom: -6rpx;
				}
				span.score{
					font-size: 32rpx;
					padding-right: 0;
					margin-bottom: 0;
					padding-left: 6rpx;
				}
			}
			.old{
				margin-left: 20rpx;
				color: #999;
				font-size: 30rpx;
				text-decoration: line-through;
				margin-bottom: -4rpx;
			}
			.button{
				position: absolute;
				right: 0;
				background-color: #F54319;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				border-top-left-radius: 100rpx;
				border-bottom-left-radius: 100rpx;
				padding: 0 10rpx 0 30rpx;
				height: 60rpx;
				aicon{
					width: 50rpx;
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
		.pintuan_price_box{
			background-color: #F54319;
			color: #fff;
			height: 120rpx;
			margin-bottom: 30rpx;
			.label{
				width: 90%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100%;
				margin: 0 auto;
				.price{
					display: flex;
					align-items: center;
					.pt{
						font-size: 52rpx;
						display: flex;
						align-items: center;
						font-weight: bold;
						span{
							background-color: #fff;
							color: #F54319;
							font-size: 24rpx;
							border-radius: 10rpx;
							padding: 0 10rpx;
							height: 46rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 10rpx;
							font-weight: normal;
							opacity: .6;
						}
					}
					.old{
						text-decoration: line-through;
						font-size: 28rpx;
						margin-top: 18rpx;
						margin-left: 20rpx;
						opacity: .8;
					}
				}
				.txt{
					border: 1px solid #fff;
					height: 50rpx;
					display: flex;
					align-items: center;
					padding: 0 10rpx;
					border-radius: 10rpx;
				}
			}
		}
		.title{
			width: 90%;
			margin: 0 auto;
			font-size: 34rpx;
			font-weight: bold;
		}
		.intro{
			width: 90%;
			margin: 0 auto;
			color: #999;
			font-size: 30rpx;
			padding: 20rpx 0 30rpx;
		}
		.box{
			width: 100%;
			border-top: 1px solid #efefef;
			.box_label{
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 90%;
				margin: 0 auto;
				padding: 20rpx 0;
				.left{
					.stock{
						color: #07c160;
						font-size: 28rpx;
					}
				}
				.right{
					display: flex;
					align-items: center;
					.label{
						display: flex;
						align-items: center;
						flex-direction: column;
						justify-content: center;
						padding-left: 70rpx;
						position: relative;
						aicon{
							width: 44rpx;
							height: 44rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
						span{
							font-size: 26rpx;
							color: #999;
						}
						button{
							position: absolute;
							width: 100%;
							height: 100%;
							top: 0;
							left: 0;
							opacity: 0;
						}
					}
				}
			}
		}
	}
	.pintuan_info_box{
		width: 95%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 30rpx;
		overflow: hidden;
		.head_box{
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #f2f2f2;
			.head{
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 90%;
				height: 100%;
				.left{
					color: #1c1c1c;
					font-size: 32rpx;
					font-weight: bold;
				}
				.right{
					font-size: 26rpx;
					color: #999;
				}
			}
		}
		.user_box{
			.user{
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 95%;
				margin: 0 auto;
				padding: 30rpx 0;
				border-bottom: 1px dashed #f2f2f2;
				.img{
					width: 120rpx;
					image{
						width: 100rpx;
						height: 100rpx;
						border-radius: 100%;
					}
				}
				.info{
					flex: 1;
					min-width: 0;
					font-size: 24rpx;
					height: 90rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.name{
						color: #1c1c1c;
						font-size: 30rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.text{
						display: flex;
						align-items: center;
						color: #F54319;
						font-size: 26rpx;
						span{
							display: flex;
							align-items: center;
							padding-left: 20rpx;
							color: #999;
							.u-count-down__text{
								color: #999;
								font-size: 26rpx;
								padding-left: 4rpx;
							}
						}
					}
				}
				.btn_box{
					width: 160rpx;
					display: flex;
					justify-content: flex-end;
					.btn{
						background-color: #F54319;
						color: #fff;
						font-size: 28rpx;
						width: 150rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 100rpx;
					}
				}
			}
		}
		.intro_box{
			display: flex;
			justify-content: space-between;
			background-color: #F5431910;
			padding: 30rpx 20rpx 50rpx;
			align-items: center;
			.line{
				opacity: .3;
			}
			.label{
				flex: 1;
				min-width: 0;
				display: flex;
				align-items: center;
				flex-direction: column;
				position: relative;
				.text{
					color: #F54319;
					font-size: 28rpx;
					padding-left: 10rpx;
					flex-direction: column;
					display: flex;
					align-items: center;
					.txt{
						font-size: 24rpx;
						color: #999;
						padding-top: 2rpx;
						opacity: .7;
						position: absolute;
						bottom: -30rpx;
					}
				}
			}
		}
	}
	.goods_content_box{
		width: 95%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 30rpx;
		overflow: hidden;
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
	
	.footer{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 100;
		background-color: #fff;
		padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		.label{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 120rpx;
			width: 95%;
			margin: 0 auto;
			position: relative;
			.left{
			    display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 100%;
				padding-right: 20rpx;
				.lab{
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					width: 120rpx;
					height: 100%;
					position: relative;
					span{
					    font-size: 24rpx;
					    color: #999;
					}
					.ico{
						width: 44rpx;
						height: 44rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;
						span{
							position: absolute;
							width: 36rpx;
							height: 36rpx;
							background-color: #F54319;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 100%;
							top: -10rpx;
							right: -20rpx;
						}
					}
					button{
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						opacity: 0;
					}
				}
			}
			.right{
				flex: 1;
				min-width: 0;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.button{
					flex: 1;
					height: 66rpx;
					border-radius: 100rpx;
					color: #fff;
					font-size: 30rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #F54319;
					border: 1px solid #F54319;
				}
				.button:nth-child(1){
					border-top-right-radius: 0;
					border-bottom-right-radius: 0;
					background-color: #fff;
					color: #F54319;
				}
				.button:nth-child(2){
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
				}
				.button.all{
					background-color: #F54319;
					color: #fff;
					border-top-right-radius: 100rpx;
					border-bottom-right-radius: 100rpx;
				}
			}
		}
	}
	
	.share_box{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 400rpx;
		.label{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex: 1;
			padding: 30rpx 0 0;
			position: relative;
			span{
				color: #1c1c1c;
				font-size: 30rpx;
				padding-top: 6rpx;
			}
			button{
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				opacity: 0;
			}
		}
	}
</style>
