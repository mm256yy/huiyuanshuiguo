<template>
	<view class="content">
		<view class="head_box box_shadow">
			<view class="label" :class="{alabel: orderActive===item.id}" v-for="(item, index) in orderMenu" :key="index" @click="selectMenuTap(item.id)">
				<view class="tit" :style="{borderColor: orderActive===item.id?'#F54319':'#fff'}">{{item.name}}</view>
			</view>
		</view>
		<view class="orderList" v-if="orderActive!=6">
			<view class="list box_shadow" v-for="(item, index) in orderList" :key="index">
				<view class="oheader">
					<view class="left">{{item.store_info.title}}</view>
					<view class="right">
						<view class="status" v-if="item.order_status===0">待付款</view>
						<view class="status" v-if="item.order_status===1">{{item.delivery_type===1?'待发货':'待自提'}}</view>
						<view class="status" v-if="item.order_status===2">待收货</view>
						<view class="status" v-if="item.order_status===3" style="color: #19be6b;border-color: #19be6b40;">{{item.evaluate_status?'已完成':'待评价'}}</view>
						<view class="status" v-if="item.order_status===4" style="color: #c5c8ce;border-color: #c5c8ce40;">{{item.paypal_type?'已关闭':'已过期'}}</view>
					</view>
				</view>
				<view class="goodsOne" v-if="item.goods_list.length===1">
					<view class="goods" v-for="(itm, idx) in item.goods_list" :key="idx">
						<view class="left">
							<image :src="itm.goods_pic" lazy-load mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="title">{{itm.goods_title}}</view>
							<view class="label">
								<text v-for="(value, name) in itm.goods_spec_name" :key="name">{{name}}:{{value}}</text>
							</view>
							<view class="box">
								<view class="price">¥{{itm.goods_price}}</view>
								<view class="number">x{{itm.buy_num}}</view>
							</view>
						</view>
					</view>
				</view>
				<scroll-view scroll-x class="goodsTwo" v-else>
					<view class="goods" v-for="(itm, idx) in item.goods_list" :key="idx">
						<image :src="itm.goods_pic" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
				<view class="infoBox">
					<view class="left">
						<view class="label">下单时间：{{item.create_time}}</view>
						<view class="label" style="padding-top: 4rpx;">订单编号：{{item.order_number}}</view>
					</view>
					<view class="right">¥{{item.total_money}}</view>
				</view>
				<view class="ofooter">
					<view class="button" @click="getOrderDetail(item.id)">订单详情</view>
					<view class="button" v-if="orderActive===1" @click="getSericeTap(item.id, 'tk')" style="color: #fff;background-color: #19be6b;border-color: #19be6b;">申请退款</view>
					<view class="button" v-if="orderActive===5" @click="getSericeTap(item.id, 'sh')" style="color: #fff;background-color: #ff9900;border-color: #ff9900;">申请售后</view>
				</view>
			</view>
			<view style="height: 100rpx;"></view>
			<view class="none_list_box" v-if="orderList.length===0">
				<image src="../../../static/images/none_data_icon_02.png" mode="widthFix"></image>
				<span v-if="orderActive===1">暂无可退款订单</span>
				<span v-if="orderActive===5">暂无可售后订单</span>
			</view>
		</view>
		<view v-else class="orderList">
			<view class="list box_shadow" v-for="(item, index) in serviceList" :key="index">
				<view class="oheader">
					<view class="left">{{item.ctype===1?'申请退款':'申请售后'}}</view>
					<view class="right">
						<view class="status" v-if="item.status===1" style="color: #ff9900;border-color: #ff990040;">待处理</view>
						<view class="status" v-if="item.status===2" style="color: #19be6b;border-color: #19be6b40;">处理成功</view>
						<view class="status" v-if="item.status===3" style="color: #ed4014;border-color: #ed401440;">处理失败</view>
						<view class="status" v-if="item.status===4" style="color: #c5c8ce;border-color: #c5c8ce40;">取消申请</view>
					</view>
				</view>
				<view class="goodsOne" v-if="item.return_goods.length===1">
					<view class="goods" v-for="(itm, idx) in item.return_goods" :key="idx">
						<view class="left">
							<image :src="itm.goods_pic" lazy-load mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="title">{{itm.goods_title}}</view>
							<view class="label">
								<text v-for="(value, name) in itm.goods_spec_name" :key="name">{{name}}:{{value}}</text>
							</view>
							<view class="box">
								<view class="price">申请数量：{{itm.num}}</view>
							</view>
						</view>
					</view>
				</view>
				<scroll-view scroll-x class="goodsTwo" v-else>
					<view class="goods" v-for="(itm, idx) in item.return_goods" :key="idx">
						<image :src="itm.goods_pic" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
				<view class="tinfoBox">
					<view class="text">{{item.ctype===1?'退款':'售后'}}原因：{{item.return_reason}}</view>
					<view class="text" v-if="item.return_reject" style="color: #ed4014;">驳回原因：{{item.return_reject}}</view>
				</view>
				<view class="tfooter">
					<view class="left">
						<view class="text" v-if="item.return_money">退款金额：¥{{item.return_money}}</view>
					</view>
					<view class="right">
						<view class="button" v-if="item.status===1" @click="getServicerDetail(index, 1)">取消申请</view>
						<view class="button" v-if="item.status===3" @click="getServicerDetail(index, 2)">删除申请</view>
						<view class="button" v-if="item.status===3 || item.status===4" @click="getSericeTap(item.order_id, item.ctype===1?'tk':'sh')" style="color: #fff;background-color: #19be6b;border-color: #19be6b;">重新申请</view>
						<view class="text" v-if="item.status===2 && item.return_money">款项已原路退回</view>
						<view class="text" v-if="item.status===2 && !item.return_money">{{item.done_time}}完成</view>
					</view>
				</view>
			</view>
			<view style="height: 100rpx;"></view>
			<view class="none_list_box" v-if="serviceList.length===0">
				<image src="../../../static/images/none_data_icon_02.png" mode="widthFix"></image>
				<span v-if="orderActive===6">暂无处理中的订单</span>
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
					id: 6,
					name: '处理中'
				}, {
					id: 1,
					name: '申请退款'
				}, {
					id: 5,
					name: '申请售后'
				}],
				orderActive: 6,
				page: 1,
				orderList: [],
				serviceList: []
			}
		},
		onShow() {
			let self = this;
			self.getOrderList();
			self.getServiceList();
		},
		methods: {
			selectMenuTap(index) {
				this.orderActive = index;
				this.getOrderList();
				this.getServiceList();
			},
			getServiceList() {
				let self = this;
				let postData = {
					status: 0,
					page: 1,
					sizes: 100
				}
				if(self.orderActive===6){
					self.Get(self.Url.serviceList, postData).then(res => {
						if(res.code === 0){
							self.serviceList = res.data.list;
						}
					})
				}
			},
			getOrderList() {
				let self = this;
				let postData = {
					sizes: 100,
					order_type: 1,
					page: self.page,
					status: self.orderActive
				};
				if(self.orderActive!=6){
					uni.showLoading({title: '数据加载中'});
					self.Get(self.Url.orderList, postData).then(res => {
						self.loading = false;
						if(res.code === 0){
							uni.hideLoading();
							self.orderList = res.data.list;
						}else{
							uni.hideLoading();
						}
					})
				}else{
					self.orderList = [];
				}
			},
			getOrderDetail(id) {
				uni.navigateTo({url: '/pages/order/details?id='+id});
			},
			getSericeTap(id, type) {
				uni.navigateTo({url: '/pages/order/service/selectgoods?id='+id+'&type='+type});
			},
			getServicerDetail(index, type) {
				let self = this;
				let data = self.serviceList[index];
				if(type===1){
					uni.showModal({
						content: '正等待客服处理中，是否取消申请？',
						success(ces) {
							if(ces.confirm){
								self.getServiceDel({id: data.id, type: type});
							}
						}
					})
				}else if(type===2){
					uni.showModal({
						content: '是否删除该申请？',
						success(ces) {
							if(ces.confirm){
								self.getServiceDel({id: data.id, type: type});
							}
						}
					})
				}
			},
			getServiceDel(data) {
				let self = this;
				self.Get(self.Url.serviceDel, data).then(res => {
					if(res.code === 0){
						if(data.type===1){
							uni.showToast({title: '取消申请成功'});
						}else if(data.type===2){
							uni.showToast({title: '申请删除成功'});
						}
						self.getServiceList();
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
	.orderList{
		padding-top: 30rpx;
		.list{
			width: 92%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			.oheader{
				display: flex;
				align-items: center;
				width: 92%;
				margin: 0 auto;
				height: 80rpx;
				justify-content: space-between;
				.left{
					flex: 1;
				}
				.right{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.status{
						font-size: 30rpx;
						color: #19be6b;
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
			.goodsOne{
				width: 100%;
				background-color: #f5f5f5;
				padding: 30rpx 0;
				.goods{
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 90%;
					margin: 0 auto;
					.left{
						width: 170rpx;
						image{
							width: 150rpx;
							height: 150rpx;
							border-radius: 10rpx;
						}
					}
					.right{
						flex: 1;
						min-width: 0;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						height: 140rpx;
						.title{
							width: 100%;
							font-size: 30rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							color: #1c1c1c;
						}
						.label{
							width: 100%;
							font-size: 26rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							color: #999;
						}
						.box{
							display: flex;
							align-items: center;
							justify-content: space-between;
							.price{
								flex: 1;
								color: #1c1c1c;
								font-size: 28rpx;
							}
							.number{
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: flex-end;
								color: #1c1c1c;
								font-size: 30rpx;
							}
						}
					}
				}
			}
			.goodsTwo{
				background-color: #f8f8f8;
				border-top: 1px solid #f5f5f5;
				border-bottom: 1px solid #f5f5f5;
				white-space: nowrap;
				width: 100%;
				height: 110rpx;
				padding: 20rpx 0;
				.goods{
					width: 110rpx;
					height: 110rpx;
					display: inline-block;
					margin-left: 20rpx;
				}
			}
			.infoBox{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 90%;
				margin: 0 auto;
				padding: 20rpx 0;
				.left{
					flex: 1;
					min-width: 0;
					.label{
						font-size: 26rpx;
						line-height: 50rpx;
						color: #1c1c1c;
					}
				}
				.right{
					display: flex;
					justify-content: flex-end;
					align-items: center;
					font-size: 30rpx;
					color: #F54319;
					font-weight: bold;
				}
			}
			.tinfoBox{
				padding: 20rpx 0;
				.text{
					width: 95%;
					margin: 0 auto;
					font-size: 24rpx;
				}
			}
			.ofooter{
				width: 100%;
				height: 86rpx;
				display: flex;
				align-items: flex-start;
				justify-content: flex-end;
				.button{
					font-size: 26rpx;
					margin-right: 30rpx;
					border-radius: 100rpx;
					height: 52rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0 24rpx;
					border: 1px solid #bbb;
					color: #999;
				}
			}
			.tfooter{
				width: 100%;
				border-top: 1px dashed #f5f5f5;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.left{
					flex: 0 0 50%;
					.text{
						font-size: 26rpx;
						margin-left: 20rpx;
					}
				}
				.right{
					flex: 0 0 50%;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.button{
						font-size: 24rpx;
						padding: 6rpx 20rpx;
						margin-right: 20rpx;
						border: 1px solid;
						border-radius: 6rpx;
					}
					.text{
						font-size: 26rpx;
						margin-right: 20rpx;
					}
				}
			}
		}
	}
</style>
