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
		this.isRuning = false;
		this.startPos = null;
		this.lastTime = null;
		this.lastY = null;
		this.defaultAcc = null;
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
	//组件挂载后初始化组件类属性,添加事件
	componentDidMount(){
		let initDeg = this.props.initDeg;
		if(initDeg && initDeg != 0){
			this.setState({
				deg:initDeg
			});
		}
		this.a = this.props.a || 7000;
		this._touch.addEventListener('touchend',this.touchEndHandle);
		this._touch.addEventListener('touchmove',this.touchMoveHandle);
		this._touch.addEventListener('touchstart',this.touchStartHandle);
	}
	touchEndHandle(e){
		e.preventDefault();
		e.stopPropagation();
		this.isRuning = true;
		var endY = e.changedTouches[0].clientY;
		endTime = this.getCurrentTime();
		var v0 = ( -this.startPos + endY ) / ( (endTime - this.lastTime ) * 0.001 );
		var direct = (v0 > 0 ? -1 : 1 );
		v0 = Math.abs(v0);
		

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
		this.isRuning = false;
		this.startPos = this.lastY = e.touches[0].clientY;
		this.lastTime = this.getCurrentTime();
	}

	render(){
		let className = this.props.className || "";
		console.log(this.state.deg);
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
