var str = {
	SESSION_ID : 'pickashu-session-id',
	BASE_URL : 'https://ewserver.di.unimi.it/mobicomp/mostri/URIRES.php',
	REGISTER : 'register',
	GET_MAP : 'getmap',
	GET_IMAGE : 'getimage',
	FIGHT_EAT : 'fighteat',
	RANKING : 'ranking',
	GET_PROFILE : 'getprofile',
	SET_PROFILE : 'setprofile',
	EMPTY_JSON : JSON.parse('{}'),
	MAPBOX_TOKEN: 'pk.eyJ1IjoibWFmZmluOTkiLCJhIjoiY2szNGF0NnQ3MGs2YzNnbnk4dDVwaHd0YiJ9.XYdHDkZRn2iHY1xmHSMc1A',
	MAP_STYLE : 'mapbox://styles/mapbox/navigation-guidance-day-v4',
	MAX_DISTANCE : 20,
};

var app = {
	items : {},
	map : undefined,
	geoloc : new mapboxgl.GeolocateControl( {
		positionOptions: {
			enableHighAccuracy: true
		},
		trackUserLocation: true
	}),

	initialize: function() {
		app.bindEvents();
	},

	bindEvents: function() {
		document.addEventListener('deviceready', app.onDeviceReady, false);
	},

	onDeviceReady: function() {
		$("section").hide();
		$("#map").show();
		document.addEventListener('pause',app.onPause, false);
		document.addEventListener('resume',app.onResume, false);

		// Here we go!
		app.receivedEvent('deviceready');
	},

	receivedEvent: function(id) {
		// Getting a valid ID
		if(localStorage.getItem(str.SESSION_ID) === null)
		{
			$.ajax({
				url:  app.reqUrl(str.REGISTER),
				type: 'GET',
				dataType: 'json',
				success: function (result, status, xhr) {
					localStorage.setItem(str.SESSION_ID, result.session_id);
					app.loadMapBox(); // Map Loading
				},
				error: app.explNoNet
			});
		}
		else {
			app.sendRequest(str.GET_PROFILE, str.EMPTY_JSON, function (result, status, xhr) {
				$('#hp-value').text(result.lp);
				$('#xp-value').text(result.xp);
			}, app.explNoNet);
			app.loadMapBox();
		}
	},

	loadMapBox : function () {
		mapboxgl.accessToken = str.MAPBOX_TOKEN;
		app.map = new mapboxgl.Map({
			container: 'map-div',
			style: str.MAP_STYLE,
			center: [9.150, 45.475],
			zoom: 9
		});
		//app.geoloc.on('geolocate', app.onLocationChanged);
		app.map.addControl(app.geoloc);
		app.map.on('load', app.onMapLoaded);
	},

	onMapLoaded : function () {
		app.geoloc.trigger();
		app.changeSection('map');
	},

	changeSection : function (id) {
		$("header").hide();
		$("section").hide();
		$("#"+id).show();
		switch (id) {
			case 'map':
				app.refreshMap();
				break;
			case 'chart':
				app.refreshChart();
				break;
			case 'profile':
				app.refreshProfile();
				break;
			default:
				console.log('Section without a refreshing method: '+id);
				break;
		}
	},

	refreshMap : function () {
		$("header").show();
		if(!app.map.loaded()) return;
		app.sendRequest(str.GET_MAP, str.EMPTY_JSON, function (mapresult, status, xhr) {
			$( ".marker" ).remove();
			for(let item of mapresult.mapobjects)
			{
				app.items[item.id] = item;
				let el = document.createElement('div');
				el.id = 'item-'+item.id;
				el.className = 'marker';
				app.sendRequest(
					str.GET_IMAGE,
					{target_id: item.id},
					function (imgresult, status, xhr) {
						el.style.backgroundImage = "url('data:image/png;base64,"+imgresult.img+"')";
						app.refineItem(el, item); },
					function () {
						app.refineItem(el, item);
					}
				);

			}
		});
	},

	refineItem : function (el, item) {
		new mapboxgl.Marker(el)
			.setLngLat([item.lon , item.lat])
			.setPopup(
				new mapboxgl.Popup({ offset: 25 }).setHTML(app.beautifyBalloon(item))
			)
			.addTo(app.map);
	},

	beautifyBalloon : function (item)
	{
		let wrd = 'Fight';
		let cls = 'btn-danger';
		if(item.type === 'CA') {
			wrd = 'Eat';
			cls = 'btn-info';
		} // todo : abbellire questo povero popup
		return '<h4>'+item.name+'</h4><h5>'+item.size+'</h5><button id="btn-figth-item-'+item.id+
			'" onclick="app.fight('+item.id+')" class="btn '+cls+'">'+wrd+'</button><p id="info-item-'+item.id+'"></p>';
	},

	fight : function (id) {
		let item = app.items[id];
		try {
			let lat = app.geoloc._lastKnownPosition.coords.latitude;
			let lng = app.geoloc._lastKnownPosition.coords.longitude;
			let dst = app.distance(lat, lng, item.lat, item.lon);
			if(dst < str.MAX_DISTANCE)
			{
				app.sendRequest(str.FIGHT_EAT,{target_id:id}, function (result, status, xhr) {
						$('#info-item-'+id).html('');
						$('#hp-value').text(result.lp);
						$('#xp-value').text(result.xp);
						// TODO : animazione del combattimento sull'header in css
						// died - red , !died - green

						$("header").addClass("blinking");
						setTimeout(function() {
							$("header").removeClass("blinking");
						}, 4.5);
						app.refreshMap();
					},
					function () { $('#info-item-'+id).html('Retry later...'); } );
			}
			else $('#info-item-'+id).html('Get closer and retry!');
		}
		catch (e) {
			console.log(e.toString());
			alert('Activate GPS to continue playing!');
		}
	},

	distance : function (lat1, lon1, lat2, lon2) {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1)  dist = 1;
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;
		return dist;
	},

	refreshChart : function () {
		$('#chart-container').html('');
		app.sendRequest(str.RANKING, str.EMPTY_JSON, function (result, status, xhr) {
			for (let player of result.ranking) {
				let img = (player.img == null)? 'img/player.gif':'data:image/png;base64,'+player.img.toString();
				let usn = (player.username == null)?'(no name)':player.username.toString();

				$('#chart-container').append('\n' +
					'\t\t<div class="d-flex justify-content-between align-items-center">\n' +
					'\t\t\t<div class="align-self-center">\n' +
					'\t\t\t\t<img class="ce" alt="propic player" src="'+img+'">\n' +
					'\t\t\t</div>\n' +
					'\t\t\t<div class="align-self-center mr-auto p-2">\n' +
					'\t\t\t\t<h3 class="">'+usn+'</h3>\n' +
					'\t\t\t</div>\n' +
					'\t\t\t<div class="align-self-center p-2">\n' +
					'\t\t\t\t<h4 class="">'+player.xp+'</h4>\n' +
					'\t\t\t</div>\n' +
					'\t\t\t<div class="align-self-center p-2">\n' +
					'\t\t\t\t<img class="ce" alt="xp player" src="img/xp.gif">\n' +
					'\t\t\t</div>\n' +
					'\t\t</div>');
			}
		});
	},

	refreshProfile : function () {
		app.sendRequest(str.GET_PROFILE, str.EMPTY_JSON, function (result, status, xhr) {
			if(result.img != null) $('#img-gallery').attr('src','data:image/png;base64,'+result.img);
			if(result.username != null) $('#txt-username').attr('placeholder', result.username);
		});
	},

	galleryLoad : function () {
		navigator.camera.getPicture(
			app.onPicture,
			null,
			{
				quality: 95,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			}
		);
	},

	onPicture : function (base64Picture) {
		app.sendRequest(str.SET_PROFILE, {img:base64Picture}, function () {
			$("#img-gallery").attr("src","data:image/png;base64,"+base64Picture);
		}, app.explNoNet);
	},

	onUsername : function () {
		let usr = $('#txt-username').val();
		app.sendRequest(str.SET_PROFILE, {username:usr}, function () {
			$("#txt-username").attr("placeholder",usr);
			$("#txt-username").val('');
		}, app.explNoNet);
	},

	sendRequest: function (url, data, success, error) {
		data.session_id = localStorage.getItem(str.SESSION_ID);
		$.ajax({
			url:  app.reqUrl(url),
			data: JSON.stringify(data),
			type: 'POST',
			dataType: 'json',
			success: success,
			error: error
		});
	},
	reqUrl : function (resource) { return str.BASE_URL.replace('URIRES', resource); },
	explNoNet : function () { alert( 'Error network, check your Internet connection.' ); },
	onPause: function() { },
	onResume: function() { },
};