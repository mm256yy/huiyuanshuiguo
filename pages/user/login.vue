<template>
	<view class="content">
	    <view class="login">
	        <image class="logo" :src="wxConfig.accountInfo.icon" />
	        <view class="title">{{wxConfig.accountInfo.nickname}}</view>
	        <view class="text">首次使用需要授权才能使用哦</view>
	        <button class="userlogin" @click="getUserInfoTap" :style="{backgroundColor: template.color.temp_color}">授权登录</button>
	        <button class="userlogin navigateBack" :style="{backgroundColor: template.color.temp_color+'20'}" @click="navigateBack()">暂不登陆</button>
	    </view>
		
		<u-popup :safeAreaInsetBottom="false" :show="editInfoShow" :round="10" :closeOnClickOverlay="false" mode="center" @close="editInfoShow=false">
			<view class="edit_info_box">
				<view class="head">
					<view class="title">完善信息</view>
					<view class="text">做个有身份的人～</view>
				</view>
				<view class="form_box">
					<form @submit="saveInfoFormTap">
						<view class="avatar">
							<image v-if="userInfoData.avatar_url" :src="userInfoData.avatar_url" mode="aspectFill"></image>
							<image v-else src="https://app.ddmini.com/cdn/01/5bce84e7b775b72994a012611b4b8b5e.jpeg" mode="aspectFill"></image>
							<view class="edit" :style="{backgroundColor: template.color.temp_color}">
								<image src="https://app.ddmini.com/cdn/01/101b22b617899d24677cfa851c73fd70.png" mode="aspectFill"></image>
							</view>
							<button open-type="chooseAvatar" @chooseavatar="chooseavatar"></button>
							<input type="text" name="avatar_url" :value="userInfoData.avatar_url" style="display: none;"/>
						</view>
						<view class="label">
							<view class="input">
								<input type="nickname" name="cname" :value="userInfoData.cname" placeholder="请输入昵称" placeholder-style="color:#bbb;"/>
							</view>
						</view>
						<view class="button" :style="{backgroundColor: template.color.temp_color}">保存设置信息<button form-type="submit"></button></view>	
						<view class="back" @click="navigateBack()">暂不完善</view>
					</form>
				</view>
				
				
			</view>
		</u-popup>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				wxConfig: __wxConfig,
				wxCode: '',
				editInfoShow: false,
				userInfoData: {
					cname: '',
					avatar_url: ''
				}
			}
		},
		onLoad() {
			this.getWechatLogin();
		},
		methods: {
			getWechatLogin() {
				let self = this;
				uni.login({
					provider: 'weixin',
					success: function(wxs) {
						self.wxCode = wxs.code;
					}
				})
			},
			getUserInfoTap() {
				let self = this;
				uni.showLoading({title: '正在登录中'});
				uni.getUserProfile({
					desc: '注册身份信息验证',
					success(ues) {
						let user = ues;
						let postData = {
							iv: user.iv,
							code: self.wxCode,
							raw_data: user.rawData,
							signature: user.signature,
							encrypted_data: user.encryptedData
						}
						self.Post(self.Url.wechatDetail, postData).then(wes => {
							if(wes.code === 0){
								uni.hideLoading();
								app.globalData.user = true;
								uni.showToast({title: '授权登陆成功'});
								uni.setStorage({key: '__ddminiUserInfo',data: wes.data});
								self.editInfoShow = true;
								// setTimeout(function () {
								// 	uni.navigateBack();
								// }, 500);
							}else{
								self.getWechatLogin();
								uni.hideLoading();
								uni.showModal({
								  title: '授权失败',
								  content: wes.msg,
								  showCancel: false
								});
							}
						});
					},
					fail() {
						self.getWechatLogin();
						uni.showModal({
						  title: '授权失败',
						  content: '获取授权信息失败，请重新授权登录',
						  showCancel: false
						});
					}
				});
			},
			chooseavatar(img){
				let self = this;
				uni.showLoading({title: '上传头像中', mask: true});
				self.Upload(self.Url.uploadFile, img.detail.avatarUrl).then(res => {
					if(res.code === 0){
						uni.hideLoading();
						self.userInfoData.avatar_url = res.url;
					}else{
						uni.hideLoading();
						uni.showModal({content: res.msg,showCancel: false});
					}
				})
			},
			saveInfoFormTap(e){
				let self = this;
				let data = e.detail.value;
				if(!data.avatar_url){
					return uni.showToast({title: '您还未上传头像', icon: 'none'});
				}else if(!data.cname){
					return uni.showToast({title: '您还未填写昵称', icon: 'none'});
				}else{
					self.Post(self.Url.userEdit, data).then(ues => {
						if(ues.code === 0){
							self.editInfoShow = false;
							uni.hideLoading();
							uni.showToast({title: '资料保存成功', mask: true});
							setTimeout(function(){
								uni.navigateBack();
							}, 800)
						}
					})
				}
			},
			navigateBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #fff;
	}
	.login{
	    height:60vh;
	    width:100%;
	    display:flex;
	    align-items:center;
	    justify-content:center;
	    flex-direction:column;
	    .logo{
			width: 120rpx;
			height: 120rpx;
			border-radius: 100%;
			border: 1px solid #efefef;
	    }
	    .title{
	        color:#1f1f1f;
	        font-size:38rpx;
	        padding-top:20rpx;
			font-weight: normal;
	    }
	    .text{
	        color:#666666;
	        padding-top:20rpx;
	        font-size:28rpx;
	        padding-bottom:60rpx;
			font-weight: normal;
	    }
	    .userlogin{
			background-color: #FF633D;
			width: 300rpx;
			height: 80rpx;
			font-size: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			color: #fff;
			border-radius: 100rpx;
			margin-bottom: 20rpx;
			font-weight: normal;
	    }
	    .navigateBack{
	        background-color:#FF633D20;
	        color:#FF633D;
	        margin-top:10rpx;
	    }
	    button::after{
	        border: 0;
	    }  
	}
	.edit_info_box{
		width: 600rpx;
		padding-bottom: 60rpx;
		.head{
			width: 80%;
			margin: 0 auto;
			padding: 50rpx 0;
			.title{
				color: #1f1f1f;
				font-size: 40rpx;
				font-weight: bold;
			}
			.text{
				color: #1f1f1f;
				font-size: 28rpx;
				padding-top: 6rpx;
			}
		}
		.form_box{
			width: 80%;
			margin: 0 auto;
			padding-top: 20rpx;
			.avatar{
				width: 160rpx;
				height: 160rpx;
				position: relative;
				margin: 0 auto;
				image{
					width: 100%;
					height: 100%;
					border-radius: 100%;
					border: 1px solid #f2f2f2;
				}
				button{
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					opacity: 0;
				}
				.edit{
					background-color: #FF633D;
					width: 60rpx;
					height: 60rpx;
					border-radius: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					position: absolute;
					bottom: 0;
					right: 0;
					image{
						width: 38rpx;
						height: 38rpx;
						border-radius: 0;
						border: none;
					}
				}
			}
			.label{
				width: 90%;
				margin: 0 auto;
				padding-top: 60rpx;
				.input{
					border: 1px solid #efefef;
					height: 80rpx;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					input{
						width: 90%;
						height: 100%;
						color: #1f1f1f;
						font-size: 28rpx;
						text-align: center;
					}
				}
			}
			.button{
				background-color: #FF633D;
				width: 90%;
				margin: 0 auto;
				height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				border-radius: 10rpx;
				margin-top: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
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
			.back{
				color: #999;
				width: 150rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 auto;
				font-size: 26rpx;
				margin-top: 30rpx;
			}
		}
	}
</style>
