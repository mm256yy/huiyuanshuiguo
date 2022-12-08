<template>
	<view class="content">
		<view class="coupons_box">
			<view class="head_box box_shadow">
				<view class="add_box">
					<view class="input">
						<input type="text" v-model="couponsCode" confirm-type="go" @confirm="getCouponsAdd()" placeholder="优惠兑换码"/>
						<view class="buttons" @click="getCouponsAdd()" :class="{abutton: couponsCode}">兑换</view>
					</view>
				</view>
				<view class="menu_box">
					<view class="label" :class="{alabel: menuActive===item.id}" v-for="(item, index) in menuList" :key="index" @click="selectMenuTap(index)">
						<view class="tit">{{item.name}}</view>
					</view>
				</view>
			</view>
			
			<view class="coupons_list_box">
				<view class="label box_shadow" :style="{opacity: item.status===1?1:'.8'}" v-for="(item, index) in couponsList" :key="index">
					<view class="price">{{item.moneys}}<span>元</span></view>
					<view class="info">
						<view class="title">{{item.title}}</view>
						<view class="text">消费满{{item.min_money}}元可使用，{{item.goods_type===1?'全场商品可用':'指定商品可用'}}</view>
						<view class="time">{{diaplayTime(item.update_time)}}领取</view>
					</view>
				</view>
				<view class="none_list_box" v-if="couponsList.length===0">
					<image src="../../static/images/none_data_icon_04.png" mode="widthFix"></image>
					<span>暂无优惠券</span>
				</view>
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
				menuList: [{
					id: 1,
					name: '未使用'
				}, {
					id: 2,
					name: '已使用'
				}, {
					id: 3,
					name: '已失效'
				}],
				menuActive: 1,
				couponsCode: '',
				couponsList: []
			}
		},
		onLoad() {
			let self = this;
			self.getCouponsUserList();
		},
		methods: {
			getCouponsUserList() {
				let self = this;
				let postData = {
					status: self.menuActive
				}
				self.Get(self.Url.couponsUserList, postData).then(res => {
					if(res.code === 0){
						self.couponsList = res.data;
					}
				})
			},
			selectMenuTap(index){
				let self = this;
				self.menuActive = self.menuList[index].id;
				self.couponsList = [];
				self.getCouponsUserList();
			},
			getCouponsAdd(){
				let self = this;
				if(!self.couponsCode){
					return uni.showToast({title: '请输入优惠兑换码'});
				}
				self.Get(self.Url.couponsUserAdd , {code: self.couponsCode}).then(res => {
					if(res.code === 0){
						uni.showToast({title: '领取成功'});
						self.couponsCode = '';
						self.getCouponsUserList();
					}else{
						uni.showModal({
							title: '领取失败',
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
	.coupons_box{
		min-height: 100vh;
	}
	.head_box{
		width: 100%;
		background-color: #fff;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 100;
		.add_box{
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx 0;
			.input{
				display: flex;
				width: 90%;
				margin: 0 auto;
				justify-content: space-between;
				align-items: center;
				height: 70rpx;
				border-radius: 100rpx;
				input{
					flex: 1;
					height: 70rpx;
					border: 1px solid #efefef;
					border-right: none;
					border-radius: 100rpx;
					border-top-right-radius: 0;
					border-bottom-right-radius: 0;
					color: #1c1c1c;
					font-size: 30rpx;
					padding-left: 30rpx;
				}
				.buttons{
					width: 160rpx;
					height: 70rpx;
					border: 1px solid #e5e5e5;
					border-left: none;
					background-color: #e5e5e5;
					color: #666;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 100rpx;
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
					font-size: 30rpx;
				}
				.abutton{
					background-color: #F54319;
					border-color: #F54319;
					color: #fff;
				}
			}
		}
		.menu_box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			margin: 0 auto;
			.label{
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100rpx;
				.tit{
					color: #666;
					transition: all 0.2s;
					padding-top: 6rpx;
					border-bottom: 3px solid transparent;
					padding-bottom: 12rpx;
					font-size: 30rpx;
				}
			}
			.alabel{
				.tit{
					color: #1c1c1c;
					font-weight: bold;
					border-color: #F54319;
				}
			}
		}
	}
	
	.coupons_list_box{
		padding-top: 30rpx;
		.label{
			width: 90%;
			height: 180rpx;
			margin: 0 auto;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			background-color: #fff;
			.price{
				width: 180rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #F54319;
				font-size: 46rpx;
				font-weight: bold;
				line-height: 46rpx;
				span{
					font-size: 26rpx;
					padding-left: 4rpx;
					margin-bottom: -6rpx;
				}
			}
			.info{
				flex: 1;
				min-width: 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.title{
					color: #1c1c1c;
					font-size: 30rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.text{
					font-size: 28rpx;
					color: #666;
					padding-top: 6rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.time{
					color: #999;
					font-size: 26rpx;
					padding-top: 10rpx;
				}
			}
			.button{
				width: 160rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.btn{
					background-color: #f14b5b;
					color: #fff;
					padding: 6rpx 14rpx;
					border-radius: 100rpx;
					font-size: 26rpx;
				}
			}
		}
	}
</style>
