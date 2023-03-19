import React from 'react';

const COLOR_MAP = [
"white",
"pink",
"purple",
"green",
"brown",
"red",
"orange",
"blue",
]

const getStyle = (colorVal) => {
	return {
			height: "35px",
	        width: "35px",
	        borderStyle: "solid",
	        borderWidth: "1px",
	        color: "black",
	        justifyContent: "center",
	        backgroundColor: COLOR_MAP[colorVal],
	}
}

const Square = (props) => <div style = {getStyle(props.color + 1)}/>
export default Square;