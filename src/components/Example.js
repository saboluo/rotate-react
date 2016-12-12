import React from 'react';
import Rotate from './RotateCom';
import '../styles/example.css';
let Com = React.Component;

class Example extends Com{
	constructor(){
		super();
		this.b1 = this.b1.bind(this);
		this.b2 = this.b2.bind(this);
		this.b3 = this.b3.bind(this);
	}
	b1(){
		this._r.goAnim(500,'160deg');
	}
	b2(){
		this._r.goAnim(500,'160deg',true);
	}
	b3(){
		this._r.stop();
	}
	endCall(deg,modal){
		let d = deg%360;
		let k;
		if(d > 10 || d < -10){
			if(d<0){
				k = -d;
			}else{
				k = 360 - d;
			}
			modal.goAnim(700,k+"deg");
		}
	}
	render(){
		return(
			<div>
				<Rotate ref={(r)=>{this._r = r}} className = "example" endCallBack = {this.endCall}>
					<div>this is page1 test</div>
					<div>this is page2 test</div>
				</Rotate>
				<button ref = "btn1" onClick = {this.b1}>go1</button>
				<button ref = "btn2" onClick = {this.b2}>go1</button>
				<button ref = "btn3" onClick = {this.b3}>go1</button>
			</div>
			)
	}
}
export default Example;