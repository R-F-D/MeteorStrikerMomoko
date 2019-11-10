/********************************************************************************
 * 入口画像の更新
 *********************************************************************************/
let isHovered=false;
let idxBlinkImage = 0;

/** 点滅（定期実行） */
function Blink(elem){
	if(isHovered)	return;
	const images	= ["./Res/enter00.png","./Res/enter01.png",];
	++idxBlinkImage;
	if(images.length <= idxBlinkImage)	idxBlinkImage=0;
	elem.src = images[idxBlinkImage];
}

/** マウスオーバー */
// eslint-disable-next-line no-unused-vars
function Hover(elem,isHover){
	isHovered	= isHover;
	const image	= "./Res/enter02.png";
	if(isHover)	elem.src = image;
	else		Blink(elem);
}

window.onload	= ()=>{
	setInterval(Blink,500,document.getElementById("enterImage"));
};