import React from 'react';
import Filter from "../Filter/Filter.js";
import "./CrimeTable.css";

const headers = ["Foos", "Bars", "FooBars", "BooFars", "Spams", "Camalots"];
const rows = [
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
		["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
		["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
		["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
	["Foo", "Bar", "FooBar", "BooFar", "Spam", "Camalot"],
]

export default class CrimeTable extends React.Component
{	
	render()
	{
		return(
		<div>
			<table style={{float: "left", width: "70%", border: "1"}}>
			<tr>
			{headers.map( (row) => <th>{row}</th>)}
			</tr>
			{rows.map( (row) => <tr>{row.map( (col) => <td>{col}</td>)}</tr>)}
			</table>
		</div>
		);
	}
}