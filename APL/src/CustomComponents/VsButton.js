import React from 'react';



//colours 
import {  blue, yellow } from '@material-ui/core/colors';


function disabled() {
	//alert("disabled");
}

//var liStyle = {padding: "5px 10px", margin: "4px 2px", color: 'black', fontSize:'16px', borderRadius: 7, border: 2};

export default function VsButton(props) {
var bSTyle = {padding: "5px 10px", margin: "4px 2px", color: 'white', fontSize:'14px', borderRadius:7, border: 2};

bSTyle.backgroundColor = (props.color) ? props.color : 'blue';
let handler=disabled;
let buttonType = (props.type) ? props.type : 'button';
//console.log(buttonType);
let _align = (props.align == null) 
if (props.disabled) {
	// job done
	bSTyle.backgroundColor = yellow[100];
	bSTyle.color = 'black';
} else {
	if (props.onClick)
		handler=props.onClick
}

	if (_align) {
		return <button type={buttonType} style={bSTyle} onClick={handler} >{props.name}</button>
	} else {
		return (
			<div align={props.align}>
				<button type={buttonType} style={bSTyle} onClick={handler} >{props.name}</button>
			</div>
		)
	}
}

