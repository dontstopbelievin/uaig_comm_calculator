import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';

let e = new LocalizedStrings({ru,kk});

export default class Footer extends React.Component {
	constructor() {
    super();
	    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');
  	}
	render(){
		return(
			<footer>
				<div className="container">
	                <p>&copy; 2017 - <strong>{e.copyright}</strong></p>
	            </div>
	        </footer>
		)
	}
}