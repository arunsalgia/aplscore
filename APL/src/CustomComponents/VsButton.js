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
let buttonAlign = (props.align) ? props.align : 'center';
if (props.disabled) {
	// job done
	bSTyle.backgroundColor = yellow[100];
	bSTyle.color = 'black';
} else {
	if (props.onClick)
		handler=props.onClick
}

return (
	<div align={buttonAlign}>
		<button type={buttonType} style={bSTyle} onClick={handler} >{props.name}</button>
	</div>
)
}

