require('normalize.css/normalize.css');
require('styles/App.css');
import RDOM from "react-dom";
import React from 'react';
let Com = React.Component;

class RotateCom extends Com{

	constructor(props){
		super(props);
		this.state = {
			deg:0
		};
		this.v0 = 0;
		this.startPos = null;
		this.lastTime = null;
		this.lastY = null;
		this.defaultAcc = null;
		this.acc = null;
		this.touchStartHandle = this.touchStartHandle.bind(this);
		this.touchEndHandle = this.touchEndHandle.bind(this);
		this.touchMoveHandle = this.touchMoveHandle.bind(this);
	}
	getheight(){
		let height = window.getComputedStyle(this._touch,null).height;
		return parseInt(height);
	}
	getDegX(){
		return this.state.deg;
	}
	getCurrentTime(){
		return (new Date()).getTime();
	}
	goAnim(isProgm,v0,dis,isConstantSpeed){
		if(typeof v0 != 'number' || v0 == 0){
			this.v0 = 0;
			return;
		}
		if(isProgm){
			this.lastTime = this.getCurrentTime();//应该把它隐藏起来
		}
		var num;
		this.v0 = v0;
		this.acc = - ( Math.abs(this.v0) / this.v0 ) * this.defaultAcc;
		num = Math.abs( (this.v0 * this.v0) / ( this.acc * 2 ) );
		if(typeof dis == "string"){
			var tempNum = dis.match(/^([-]?\d*)deg$/)[1];
			num = Math.abs( parseFloat( tempNum ) );
			var acc = this.v0 * this.v0 / ( 2 * num );
			this.acc = - ( Math.abs(this.v0) / this.v0 ) * acc;
			if(isConstantSpeed){
				this.acc = null;
				this._goAnim(num,isConstantSpeed);
				return;
			}
		}
		this._goAnim(num);
	}

	_goAnim(dis,isConstantSpeed){
		if(this.v0 == 0){
			if(typeof this.props.endCallBack =='function'){
				this.props.endCallBack(this.getDegX());
			}
			return;
		}
		var currentTime = this.getCurrentTime();
		var dt = ( currentTime - this.lastTime ) * 0.001;
		this.lastTime = currentTime;
		var len;
		if(isConstantSpeed){
			len = this.v0 * dt;
			if(dis > Math.abs(len)){
				dis = dis - Math.abs(len);
			}else{
				len = dis * ( Math.abs(len) / len );
				dis = 0;
				this.stop();
			}
		}else{
			len = this.v0 * dt + this.acc * dt * dt * 0.5;
			if(Math.abs(this.v0) > Math.abs(this.acc * dt)){
				this.v0 = this.v0 + this.acc * dt;
				dis = dis - Math.abs(len);
			}else{
				len = dis * ( Math.abs(this.v0) / this.v0 );
				dis = 0;
				this.stop();
			}
		}
		this.setState({
				deg:this.getDegX() + len
			});
		setTimeout(function(){
				this._goAnim(dis,isConstantSpeed);
			}.bind(this),40);
	}
	//组件挂载后初始化组件类属性,添加事件
	componentDidMount(){
		let initDeg = this.props.initDeg;
		if(initDeg && initDeg != 0){
			this.setState({
				deg:initDeg
			});
		}
		this.defaultAcc = this.props.a || 1000;
		this._touch.addEventListener('touchend',this.touchEndHandle);
		this._touch.addEventListener('touchmove',this.touchMoveHandle);
		this._touch.addEventListener('touchstart',this.touchStartHandle);
	}
	stop(){
		this.v0 = 0;
		this.acc = null;
	}
	touchEndHandle(e){
		e.preventDefault();
		e.stopPropagation();
		var endY = e.changedTouches[0].clientY;
		var endTime = this.getCurrentTime();
		var goDeg = ( this.startPos - endY ) * 180 / (Math.PI * this.getheight() / 2 );
		var v0 = goDeg / ( (endTime - this.lastTime ) * 0.001 );
		this.goAnim(false,v0,null,false);
	}
	touchMoveHandle(e){
		e.preventDefault();
		e.stopPropagation();
		let nowY = e.touches[0].clientY;
		let nowTime = this.getCurrentTime();
		let dis = (nowY - this.lastY) * 180 / ( Math.PI * 200 );
		if((nowTime - this.lastTime) > 300){
				this.startPos = nowY;
				this.lastTime = nowTime;
			}
			this.lastY = nowY;
		this.setState({
			deg:this.getDegX() - dis
		});
	}
	touchStartHandle(e){
		e.preventDefault();
		e.stopPropagation();
		this.v0 = 0;
		this.startPos = this.lastY = e.touches[0].clientY;
		this.lastTime = this.getCurrentTime();
	}

	render(){
		let className = this.props.className || "";
		let styleObj = {
			'transform':'rotateX('+this.state.deg+'deg)' //未添加兼容处理
		};
		let child_1 = ( this.props.children[0] ? this.props.children[0] : "" );
		let child_2 = ( this.props.children[1] ? this.props.children[1] : "" );
		return (
			<div className = "wrap">
				<div className = {"touch " + className} ref = {(touch)=>{this._touch = touch}} style = {styleObj}>
					<div className = "front-face hide-over bfhide">page1 {child_1}</div>
					<div className = "back-face hide-over bfhide">page2 {child_2}</div>
				</div>
			</div>
			);
	}
}

export default RotateCom;
