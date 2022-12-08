<template>
	<view class="content">
		<block v-if="editStatus">
			<view class="edit_invoice_box">
				<view class="headers">第二步：填写开票信息</view>
				<view class="label">
					<view class="title"><span>*</span>开票名称</view>
					<view class="input">
						<input type="text" v-model="editData.company_name" placeholder="请输入单位或公司名称" />
					</view>
				</view>
				<view class="label">
					<view class="title"><span>*</span>开票税号</view>
					<view class="input">
						<input type="text" v-model="editData.company_tax" placeholder="请输入统一社会信用代码" />
					</view>
				</view>
				<view class="label">
					<view class="title">单位地址</view>
					<view class="input">
						<input type="text" v-model="editData.company_address" placeholder="请输入单位或公司地址" />
					</view>
				</view>
				<view class="label">
					<view class="title">电话号码</view>
					<view class="input">
						<input type="text" v-model="editData.company_phone" placeholder="请输入单位或公司电话" />
					</view>
				</view>
				<view class="label">
					<view class="title">开户银行</view>
					<view class="input">
						<input type="text" v-model="editData.bank_name" placeholder="请输入开户银行名称" />
					</view>
				</view>
				<view class="label">
					<view class="title">银行账号</view>
					<view class="input">
						<input type="number" v-model="editData.bank_number" placeholder="请输入开户银行账号" />
					</view>
				</view>
				<view class="label">
					<view class="title">联系手机</view>
					<view class="input">
						<input type="number" v-model="editData.user_phone" placeholder="联系手机或邮箱必填一个" />
					</view>
				</view>
				<view class="label">
					<view class="title">联系邮箱</view>
					<view class="input">
						<input type="text" v-model="editData.user_email" placeholder="联系手机或邮箱必填一个" />
					</view>
				</view>
				<view class="label">
					<view class="title">开票备注</view>
					<view class="input">
						<input type="text" v-model="editData.remark" placeholder="特殊需求请备注(并不一定满足)" />
					</view>
				</view>
				<view class="label">
					<view class="title">开票金额</view>
					<view class="input">
						<span :style="'color:'+template.color.temp_color">{{editData.money}}元</span>
					</view>
				</view>
				<view class="edit_button edit_button_send" @click="importInvoiceDataTap()" :style="'background-color:'+template.color.temp_color+'20;color:'+template.color.temp_color">从微信导入开票信息</view>
				<view class="edit_button edit_button_weixin" @click="getInvoiceDataTap()" :style="'background-color:'+template.color.temp_color">确认提交开票申请</view>
			</view>
		</block>
		<block v-else>
			<view v-if="orderList.length>0" class="order_list_box">
				<view class="headers">第一步：选择开票订单</view>
				<view class="order_list" v-for="(item, index) in orderList" :key="index" @click="selectOrderTap(index)">
					<view class="left">
						<icons :type="item.active?'xuanzhong':'weixuanzhong'" :color="item.active?template.color.temp_color:template.color.color5" size="18"></icons>
					</view>
					<view class="center">
						<view class="label">
							<view class="title">下单时间</view>
							<view class="text">{{item.order_uptime}}</view>
						</view>
						<view class="label" style="padding-top: 10rpx;">
							<view class="title">订单编号</view>
							<view class="text">{{item.order_number}}</view>
						</view>
					</view>
					<view class="right">
						<view class="money">{{item.order_total}}<span>元</span></view>
						<view class="text">共{{item.order_goods}}件商品</view>
					</view>
				</view>
				<view style="height: 160rpx;"></view>
				<view v-if="selectOrderIds.length>0" class="select_button" :style="'background-color:'+template.color.temp_color" @click="getCheckOrderTap()">下一步，填写开票资料</view>
				<view v-else class="select_button">请选择要开票的订单</view>
			</view>
			<view v-else class="none_list_box">
				<image src="../../static/images/none_data_icon_02.png" mode="aspectFill"></image>
				<span>暂无可申请开票的订单</span>
				<span style="width: 50%; text-align: center; font-size: 24rpx; padding-top: 20rpx;">注：只有已收货、已确认、已完成的订单才能申请开具发票</span>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				orderList: [],
				selectOrderIds: [],
				editStatus: false,
				editData: {
					company_name: '',
					company_tax: '',
					company_address: '',
					company_phone: '',
					bank_name: '',
					bank_number: '',
					user_phone: '',
					user_email: '',
					order_list: '',
					remark: '',
					money: 0
				}
			}
		},
		onLoad() {
			let self = this;
			self.getInvoiceassistantOrderList();
		},
		methods: {
			getInvoiceassistantOrderList() {
				let self = this;
				let postData = {
					page:  1,
					sizes: 200
				}
				self.Get(self.Url.invoiceassistantOrderList, postData).then(res => {
					if(res.code === 0) {
						self.orderList = res.data.list;
					}
				})
			},
			selectOrderTap(index) {
				let self = this;
				let data = self.orderList[index];
				data.active = !data.active;
				self.$set(self.orderList, index, data);
				if(data.active){
					self.selectOrderIds.push(data.order_id);
				}else{
					let idx = self.selectOrderIds.findIndex(itm => itm===data.order_id);
					self.selectOrderIds.splice(idx, 1);
				}
			},
			uniqueSetArray(arr){
				return Array.from(new Set(arr));
			},
			importInvoiceDataTap() {
				let self = this;
				uni.chooseInvoiceTitle({
					success(res) {
						self.editData.company_name = res.title;
						self.editData.company_tax = res.taxNumber;
						self.editData.company_address = res.companyAddress;
						self.editData.company_phone = res.telephone;
						self.editData.bank_name = res.bankName;
						self.editData.bank_number = res.bankAccount;
					}
				})
			},
			getInvoiceDataTap() {
				let self = this;
				let data = self.editData;
				if(!data.company_name){
					uni.showModal({content: '请输入开票名称(单位或公司名称)',showCancel: false});
					return
				}else if(!data.company_tax){
					uni.showModal({content: '请输入开票税号(统一社会信用代码)',showCancel: false});
					return
				}else if(!data.user_phone && !data.user_email){
					uni.showModal({content: '联系手机或邮箱必填一个(用于接收发票)',showCancel: false});
					return
				}else{
					data.order_list = self.selectOrderIds.join(',');
					console.log(data)
					// return
					self.Post(self.Url.invoiceassistantOrderApply, data).then(res => {
						console.log(res)
						if(res.code === 0){
							uni.showModal({
								title: '提交成功',
								content: '开票申请已成功提交，财务人员将在收到申请后2个工作日内开具。',
								showCancel: false,
								success(ces) {
									if(ces.confirm){
										uni.navigateBack();
									}
								}
							})
						}else{
							uni.showModal({
								content: res.msg,
								showCancel: false
							})
							return
						}
					})
				}
			},
			getCheckOrderTap() {
				let self = this;
				let money = 0;
				let array = [];
				let number = 0;
				self.orderList.forEach(itm => {
					if(itm.active){
						number++
						money += itm.order_total
						array.push(itm.order_id)
					}
				})
				self.selectOrderIds = array;
				uni.showModal({
					title: '金额确认',
					content: '共选择：'+number+'张订单\r\n合计金额：'+money+'元\r\n确认开票请点击下一步',
					confirmText: '下一步',
					cancelColor: '#999',
					success(ces) {
						if(ces.confirm){
							self.editData.money = money;
							self.editStatus = true;
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.order_list_box{
		.headers{
			width: 100%;
			height: 150rpx;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #efefef;
			justify-content: center;
			font-weight: bold;
			font-size: 30rpx;
			background-color: #f5f5f5;
			border-top: 1px solid #efefef;
		}
		.order_list{
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px dashed #f2f2f2;
			width: 95%;
			margin: 0 auto;
			padding: 30rpx 0;
			.left{
				flex: 0 0 13%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.center{
				flex: 0 0 62%;
				min-width: 0;
				.label{
					display: flex;
					align-items: center;
					font-size: 26rpx;
					.title{
						color: #999;
						padding-right: 12rpx;
					}
				}
			}
			.right{
				flex: 0 0 25%;
				min-width: 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.money{
					font-size: 34rpx;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					span{
						font-weight: normal;
						font-size: 24rpx;
						padding-left: 4rpx;
					}
				}
				.text{
					background-color: #07C16020;
					color: #07C160;
					font-size: 20rpx;
					padding: 2rpx 8rpx;
					border-radius: 100rpx;
				}
			}
		}
		.select_button{
			position: fixed;
			bottom: 50rpx;
			width: 60%;
			height: 70rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
			color: #fff;
			background-color: #000;
			border-radius: 100rpx;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.edit_invoice_box{
		.headers{
			width: 100%;
			height: 150rpx;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #efefef;
			justify-content: center;
			font-weight: bold;
			font-size: 30rpx;
			background-color: #f5f5f5;
			border-top: 1px solid #efefef;
		}
		.label{
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 90%;
			margin: 0 auto;
			height: 80rpx;
			border-bottom: 1px dashed #f2f2f2;
			.title{
				flex: 0 0 25%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				position: relative;
				span{
					color: #ed4014;
					font-size: 26rpx;
					position: absolute;
					left: 0;
				}
			}
			.input{
				flex: 0 0 75%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				input{
					width: 100%;
					height: 100%;
					font-size: 28rpx;
				}
			}
		}
		.edit_button{
			width: 60%;
			height: 70rpx;
			border-radius: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
			margin-top: 40rpx;
		}
		.edit_button_weixin{
			color: #fff;
		}
	}
	
</style>
