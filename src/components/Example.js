import React from 'react';
import Rotate from './RotateCom';
import '../styles/example.css';
let Com = React.Component;

class Example extends Com{
	render(){
		return(
			<Rotate className = "example">
				<div>this is page1 test</div>
				<div>this is page2 test</div>
			</Rotate>
			)
	}
}
export default Example;