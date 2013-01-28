/*
 * Navigator 1.0
 *
 * Jay Taylor Schultz
 * Copyright 2013, Licensed GPL & MIT
 *
*/

;window.Navigator = function(element, options) {
	if (!element) return null;
	
	this.options = options || {};
	this.callback = this.options.callback || function() {};
	this.previousPageArray = [];
	this.currentLeft = -101;
	this.currentPage = this.options.initPage;
	this.initPage = this.options.initPage;
	this.excludeHeader = this.options.excludeHeader || 0;
	this.header = {};
	
	this.container = element;
	
	this.init();
};

Navigator.prototype = {
	init: function() {
		var _this = this;
		
		if(!this.excludeHeader) {
			var parent = this.container.parentElement;

			this.header.container = document.createElement("div");
			this.header.backbutton = document.createElement("a");
			this.header.backbutton.id = "backbutton";
			var centerTag = document.createElement("div");
			centerTag.className = "center";
			this.header.text = document.createElement("div");
			this.header.text.id = "header_text";
			this.header.container.appendChild(this.header.backbutton);
			centerTag.appendChild(this.header.text);
			this.header.container.appendChild(centerTag);

			parent.insertBefore(this.header.container,this.container);
			
			this.setStyle(this.header.container,"z-index","1");
		}
		
		this.setStyle(this.container,"position","absolute");
		this.setStyle(this.container,"width","100%");
		this.setStyle(this.container,"height","100%");
		this.setStyle(this.container,"top","0px");
		
		for (var i = 0, length = this.container.children.length; i<length; i++) {
			this.setStyle(this.container.children[i],"position","absolute");
			this.setStyle(this.container.children[i],"left","-101%");
			this.setStyle(this.container.children[i],"display","none");
			this.setStyle(this.container.children[i],"width","100%");
		}
		
		if ("onhashchange" in window) {
		    window.onhashchange = function () {
		        _this.hashChanged(window.location.hash);
		    }
		} else {
		    var storedHash = window.location.hash;
		    window.setInterval(function () {
		        if (window.location.hash != storedHash) {
		            storedHash = window.location.hash;
		            _this.hashChanged(storedHash);
		        }
		    }, 100);
		}
		
		var hash = window.location.hash;
		if (hash) {
			hash = hash.replace("#","");
			if (hash == this.initPage) {
				this.hashChanged("#" + this.initPage);
			} else {
				this.hashChanged("#" + hash);
			}
		} else {
			window.location = "#" + this.initPage;
		}
	},
	
	hashChanged: function(hash) {
		hash = hash.replace("#","");
		if (this.backPage != null && this.backPage == hash) {
			this.goBack();
		} else {
			if (hash == this.initPage) {
				this.go(1);
			} else {
				this.goForward(hash);
			}
		}
	},
	
	back: function(_this) {
		var navt = _this;
		if (!_this) {
			navt = this;
		}
		window.location = "#" + navt.backPage;
	},
	
	goBack: function() {
		this.currentLeft = (this.currentLeft == -101) ? 0 : this.currentLeft + 100;
		this.previousPage = this.currentPage;
		this.currentPage = this.previousPageArray.pop();
		this.backPage = this.previousPageArray[this.previousPageArray.length-1];
		if (this.previousPageArray.length == 0) {
			this.backPage = null;
		}
		this.go();
	},
	
	goForward: function(toIndex) {
		this.currentLeft = (this.currentLeft == 0) ? this.currentLeft - 101 : this.currentLeft - 100;
		this.previousPageArray.push(this.currentPage);
		this.previousPage = this.currentPage;
		this.backPage = this.currentPage;
		this.currentPage = toIndex;
		this.go();
	},
	
	go: function(dontanimate) {
		var _this = this;
		
		this.setStyle(document.getElementById(this.currentPage),"display","inline");
		this.setStyle(document.getElementById(this.currentPage),"left",Math.abs(this.currentLeft) + "%");

		if(!this.excludeHeader) {
			var header = $("#"+this.currentPage+" .header")[0];
			
			this.header.container.className = "";
			for (var i = 0, length = header.classList.length; i<length; i++) {
				this.header.container.classList.add(header.classList[i]);
			}
			this.header.text.innerHTML = header.innerHTML;
			this.setStyle(header,"display","none");

			this.setStyle($("#"+this.currentPage+" .content")[0],"margin-top",this.header.container.offsetHeight + "px");

			if (this.currentPage != this.initPage) {
				this.header.backbutton.style.display = "block";

				$(this.header.backbutton).animate({
					opacity: 1
				}, function () {
					_this.header.backbutton.style.display = "block";
					$(_this.header.backbutton).unbind();
					$(_this.header.backbutton).bind("click",function(){_this.back(_this);});
				});
			} else {
				$(this.header.backbutton).animate({
					opacity: 0
				},"fast", function () {
					_this.header.backbutton.style.display = "none";
				});
			}
		}

		if (dontanimate) {
			this.setStyle(this.container,"left",this.currentLeft + "%");
			this.setStyle(document.getElementById(this.previousPage),"display","none");
		} else {
			$(this.container).animate({
				left: this.currentLeft + "%"
			},"fast",function(){
				_this.setStyle(document.getElementById(_this.previousPage),"display","none");
			});
		}
	},
	
	setStyle: function(obj,attr,val) {
		if (!obj || !attr || !val) {
			return null;
		}
		
		obj.style.setProperty(attr,val);
	}
};