//Main
cc.game.onStart = function(){
	//Debug(()=>console.clear());

	var sys = cc.sys;
	if(!sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
		document.body.removeChild(document.getElementById("cocosLoading"));

	// Pass true to enable retina display, on Android disabled by default to improve performance
	cc.view.enableRetina(sys.os === sys.OS_IOS ? true : false);

	// Disable auto full screen on baidu and wechat, you might also want to eliminate sys.BROWSER_TYPE_MOBILE_QQ
	if (sys.isMobile &&
		sys.browserType !== sys.BROWSER_TYPE_BAIDU &&
		sys.browserType !== sys.BROWSER_TYPE_WECHAT) {
		cc.view.enableAutoFullScreen(true);
	}

	// Adjust viewport meta
	cc.view.adjustViewPort(true);

	// Uncomment the following line to set a fixed orientation for your game
	// cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

	// Setup the resolution policy and design resolution size
	cc.view.setDesignResolutionSize(512, 288, cc.ResolutionPolicy.SHOW_ALL);

	// The game will be resized when browser size change
	cc.view.resizeWithBrowserSize(true);

	//load resources
	cc.LoaderScene.preload(g_resources, function () {
		cc.director.runScene( Scene.SceneFactory().GetCcSceneInstance() );
	}, this);
};
//cc._loaderImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAADAFBMVEUAgAAwICBoUECggGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AYP8AIsBAIAD/39T/v6r/oIDbdli3TDH/WIkAAAAAAAAAAAAAAAAAAAAAAAD///+3kACOXwBgQADVt1oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wD/wQf/qQftfwPcVQDAwKBAQIAwMGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////AwMBAQIAgIEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQUCBIiEyAwHhkPwBEHwRgQEBAICDAAAAAQP8QEBAAAAAAAAAAAAAAAAAAAAAAAAC3kACvhACOXwCGUgBallpVjFWYVRaMTRLExMSgoKBgYGCgwKDg4OAAAAAAAAAAAADGV2UZAAAAAXRSTlMAQObYZgAAALRJREFUeJyl02EOgyAMBWCPUDBl2T/o4wLc/3KjdJi5bALxJRprv1g1sG2nANt1huDeM9CS0l9yCbQlkt7Rag18Ni0iJzIAQIw5n0HOKyDGUpQAuUZEz/aqs0BHaMmsv0laVkCMInrsNUqY9cpoI0MAlJLSvhN5zy3eEymZBTbiDrAlwkzknAHniPonVzIJnjV8RKsV0IdYw6DdmwN9wQIhGAjB6mPZDUHfMsCjBUe+9tRv8ALgHFaBNbDs+QAAAABJRU5ErkJggg==";
cc.game.run();