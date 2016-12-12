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
		this.mouseDownHandle = this.mouseDownHandle.bind(this);
		this.mouseUpHandle = this.mouseUpHandle.bind(this);
		this.mouseMoveHandle = this.mouseMoveHandle.bind(this);
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
	getSign(num){
		if(num != 0 ){
			return Math.abs(num) / num;
		}else{
			return 0;
		}
	}
	goAnim(v0,dis,isConstantSpeed,isTouchEvent){
		if(typeof v0 != 'number' || v0 == 0){
			this.v0 = 0;
			return;
		}
		if(!isTouchEvent){
			this.lastTime = this.getCurrentTime();
		}
		var num;
		this.v0 = v0;
		this.acc = - ( this.getSign(this.v0) ) * this.defaultAcc;
		num = Math.abs( (this.v0 * this.v0) / ( this.acc * 2 ) );
		if(typeof dis == "string"){
			var tempNum = dis.match(/^([-]?\d*[.]?\d*)deg$/);
			tempNum = tempNum[1];
			num = Math.abs( parseFloat( tempNum ) );
			var acc = this.v0 * this.v0 / ( 2 * num );
			this.acc = - ( this.getSign(this.v0) ) * acc;
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
				this.props.endCallBack(this.getDegX(),this);
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
				len = dis * ( this.getSign(len) );
				dis = 0;
				this.stop();
			}
		}else{
			len = this.v0 * dt + this.acc * dt * dt * 0.5;
			if(Math.abs(this.v0) > Math.abs(this.acc * dt)){
				this.v0 = this.v0 + this.acc * dt;
				dis = dis - Math.abs(len);
			}else{
				len = dis * ( this.getSign(this.v0) );
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
		if(typeof initDeg == "string"){
			initDeg = parseFloat(initDeg.match(/^([-]?\d*[.]?\d*)$/)[1]);
			if(typeof initDeg == "number"){
				this.setState({
					deg:initDeg
				});
			}
		}
		this.defaultAcc = this.props.a || 1000;
		this._touch.addEventListener('touchend',this.touchEndHandle);
		this._touch.addEventListener('touchmove',this.touchMoveHandle);
		this._touch.addEventListener('touchstart',this.touchStartHandle);
		this._touch.addEventListener("mousedown",this.mouseDownHandle);
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
		this.goAnim(v0,null,false,true);
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
	mouseDownHandle(ev){
		var e = ev || event;
		e.preventDefault();
		e.stopPropagation();
		this.v0 = 0;
		this.startPos = this.lastY = e.clientY;
		this.lastTime = this.getCurrentTime();
		document.addEventListener("mousemove",this.mouseMoveHandle);
		document.addEventListener("mouseup",this.mouseUpHandle);
	}
	mouseMoveHandle(ev){
		var e = ev || event;
		e.preventDefault();
		var w = window.innerWidth;
		var h = window.innerHeight;
		e.stopPropagation();
		let nowX = e.clientX;
		let nowY = e.clientY;
		if(nowX <= 10 || nowX >= w-10 || nowY <= 10 || nowY >= h-10){
			this.mouseUpHandle(e);
			return;
		}
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
	mouseUpHandle(ev){
		var e = ev || event;
		e.preventDefault();
		e.stopPropagation();
		document.removeEventListener('mousemove',this.mouseMoveHandle);
		document.removeEventListener('mouseup',this.mouseUpHandle);
		var endY = e.clientY;
		var endTime = this.getCurrentTime();
		var goDeg = ( this.startPos - endY ) * 180 / (Math.PI * this.getheight() / 2 );
		var v0 = goDeg / ( (endTime - this.lastTime ) * 0.001 );
		this.goAnim(v0,null,false,true);
		return;
	}
	render(){
		let className = this.props.className || "";
		let styleObj = {};
		['WebkitTransform','MozTtransform','MsTransform','transform'].forEach(
			function(val){
				styleObj[val] = 'rotateX('+this.state.deg+'deg)';
			}.bind(this)
		);
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
