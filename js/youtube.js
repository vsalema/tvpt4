var vgsPlayer, poster;
vgsPlayer = videojs('player');

vgsPlayer.poster('');

$('#vidlink li a').on('click', function(e) {
  e.preventDefault();
  var vidlink = $(this).attr('href');
  $('#vsg-vurl').val(vidlink);  
  $('input[type=submit]').click(); 
//vsgLoadVideo(vidlink);
});

jQuery(function($) {
$("#vsg-loadvideo").submit(function(e) {
    e.preventDefault();

    var vidURL = $("#vsg-vurl").val();

    vsgLoadVideo(vidURL);

  });

}); 

function vsgLoadVideo(vidURL, poster) {

  var type = getType(vidURL);

  console.log(type);

  if (getId(vidURL))
    poster = "http://img.youtube.com/vi/" + getId(vidURL) + "/hqdefault.jpg";

  vgsPlayer.src({
    "src": vidURL,
    "type": type
  });
  if (poster)
    vgsPlayer.poster(poster);
  else
  	vgsPlayer.poster("https://cdn.futura-sciences.com/sources/images/iptv.jpeg");
 vgsPlayer.play();
 return false;

}
function ytVidId(url) {
 var p = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

  if (url.match(p) || getId(url).length == 11)
    return false;
}
function getId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return false;
  }
}

var rtmp_suffix = /^rtmp:\/\//;
var hls_suffix = /\.m3u8/;
var mp4_suffix = /\.(mp4|m4p|m4v|mov)/i;
var hds_suffix = /\.f4m/;
var dash_suffix = /\.mpd/;
var flv_suffix = /\.flv/;
var webm_suffix = /\.webm/;
var mpeg_suffix = /\.(mp3|m4a)/i;
var ogg_suffix = /\.ogg/;
var yt_suffix = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
var dm_suffix = /\.?dailymotion.com/;
var vm_suffix = /\.?vimeo.com/;
function getType(url) {
  if (mpeg_suffix.test(url))
    return 'audio/mpeg';
  if (ogg_suffix.test(url))
    return 'audio/ogg';
  if (dash_suffix.test(url))
    return 'application/dash+xml';
  if (rtmp_suffix.test(url))
    return 'rtmp/mp4';
  if (hls_suffix.test(url))
    return 'application/x-mpegurl';
  if (mp4_suffix.test(url))
    return 'video/mp4';
  if (hds_suffix.test(url))
    return 'application/adobe-f4m';
  if (flv_suffix.test(url))
    return 'video/flv';
  if (webm_suffix.test(url))
    return 'video/webm';
  if (yt_suffix.test(url)) {
    
    return 'video/youtube';
  }
  if (dm_suffix.test(url))
    return 'video/dailymotion';
  if (vm_suffix.test(url))
    return 'video/vimeo';

  console.log('could not guess link type: "' + url + '" assuming mp4');
  return 'video/mp4';
};

function getExt(ext) {

  //if (ext == "youtube") ext = "mp4";
  if (ext == "mp4" || ext == "m4v") ext = "m4v";
  if (ext == "ogg" || ext == "ogv") ext = "oga";
  if (ext == "webm") ext = "webmv";

  return ext;
}

  const refreshBtn = document.getElementById("btnRefresh");

function handleClick() {
  history.go(0);
}

refreshBtn.addEventListener("click", handleClick);