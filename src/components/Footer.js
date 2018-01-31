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
		var _zero_kz_ = _zero_kz_ || [];
		_zero_kz_.push(["id", 70316]);
		_zero_kz_.push(["type", 1]);

		(function () {
		    var a = document.getElementsByTagName("script")[0],
		    s = document.createElement("script");
		    s.type = "text/javascript";
		    s.async = true;
		    s.src = (document.location.protocol == "https:" ? "https:" : "http:")
		    + "//c.zero.kz/z.js";
		    a.parentNode.insertBefore(s, a);
		})(); 

		return(
			<footer>
				<div className="container">
	                <p>&copy; 2017 - <strong>{e.copyright}</strong></p>

									<span id="_zero_70316">
										<a href="https://zero.kz/catalog/70316_upravlenie-arxitekturi-i-stroitelstva-goroda-almati" target="_blank">
											<img src="http://c.zero.kz/z.png?u=70316" width="88" height="31" alt="ZERO.kz" />
										</a>
									</span>


	       </div>

	        </footer>
		)
	}
}
