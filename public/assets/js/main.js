

var button = document.getElementById("download")

button.download = 'pergola-conf.png';
button.innerHTML = 'Bild speichern';

button.onclick = function () {

   var e = renderer.env;
   e.myAnimate();
   var imgData = e.renderer.domElement.toDataURL({ format:'png', multiplier:4});
   // button.href = e.renderer.domElement.toDataURL('image/png');
   var strDataURI = imgData.substr(22, imgData.length);
   var blob = dataURLtoBlob(imgData);
   var objurl = URL.createObjectURL(blob);

   button.href = objurl;

}

function dataURLtoBlob(dataurl) {
   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
       bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
   while(n--){
       u8arr[n] = bstr.charCodeAt(n);
   }
   return new Blob([u8arr], {type:mime});
}

$(document).ready(function(){ 
   $("input[value='item2']").one('click', function() {
      setTimeout(function() {
         $('#dragndrop').addClass('dragndrop');
         $('.dragndrop').insertBefore('.float-gui');
         console.log('success');
      },700);
   });
   $("input[value='item2']").click(function() {
      setTimeout(function() {
         $('.sidebar-item #dragndrop').remove();
      },800);
   });
});