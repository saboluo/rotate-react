import React from 'react';
import Rotate from './RotateCom';
import '../styles/example.css';
let Com = React.Component;

class Example extends Com{
	constructor(){
		super();
		this.go = this.go.bind(this);
		this.stop = this.stop.bind(this);
		this.endCall = this.endCall.bind(this);
		this.isGo = false;
	}
	go(){
		if(this.isGo){
			return;
		}
		this.isGo = true;
		var arr = [5,6,7,8,9,10];
		var index = Math.floor( Math.random() * arr.length )
		var deg = Math.floor( Math.random() * 360 ) + 180 * arr[index];
		var dir = Math.random() > 0.5 ? 1 : -1 ;
		this._r.goAnim(dir * 1000,deg+"deg");
	}
	stop(){
		this._r.stop();
	}
	endCall(deg,modal){
		if(!this.isGo){
			return;
		}
		var v;
		var d = deg % 360;
		if(d < 0){
			d = 360 + d;
		}
		if( d>90 && d<270 ){
			d = 180 - d;
			d > 0 ? (v = 700):(v = -700);
		}else{
			if(d <= 90){
				v = -700;
			}else{
				v = 700;
				d = 360 - d;
			}
		}
		this.isGo = false;
		modal.goAnim(v,Math.abs(d)+"deg");
	}
	render(){
		return(
			<div className = "gameControler">
				<Rotate ref={(r)=>{this._r = r}} className = "example" endCallBack = {this.endCall}>
					<div className = "page">
						<div className = "frontPage">DOG</div>
						<div className = "content">
							one message here!
						</div>
					</div>
					<div className = "page">
						<div className = "backPage">MONKEY</div>
						<div className = "content">
							you got a message!
						</div>
					</div>
				</Rotate>
				<div className = "contrlBtn">
					<button className = "btn-1" ref = "go" onClick = {this.go}>GO</button>
					<button className = "btn-2" ref = "stop" onClick = {this.stop}>STOP</button>
				</div>
			</div>
			)
	}
}
export default Example;