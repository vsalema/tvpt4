(function() {
  // code isolé ici
// Global variables for DOM elements and data
let videoPlayerElement;
let videoJsPlayer;
let channelListDiv;
let showGeoLockedCheckbox;
let searchInput;
let categorySelect;
let currentChannelNameDisplay;
let videoLoadingIndicator;
let channelLoadingIndicator;
let iptvControlsDiv; // Div for IPTV specific controls
let modeIptvButton; // IPTV mode button
let modeWebcamsButton; // Webcams mode button
let modeOtherFeedsButton; // New: Other Feeds mode button

let allChannels = []; // Stores all parsed channels/webcams/other feeds
let currentM3uUrl = 'https://iptv-org.github.io/iptv/index.category.m3u'; // Default IPTV URL
let currentMode = 'iptv'; // 'iptv', 'webcams', or 'otherFeeds'

// Track the currently selected index in the filtered list
let currentFilteredList = [];
let currentIndex = -1;

// Define the IPTV categories and their M3U URLs
const IPTV_CATEGORIES = [
{ name: 'All Categories', url: 'https://iptv-org.github.io/iptv/index.category.m3u' },
{ name: 'Animation', url: 'https://iptv-org.github.io/iptv/categories/animation.m3u' },
{ name: 'Auto', url: 'https://iptv-org.github.io/iptv/categories/auto.m3u' },
{ name: 'Business', url: 'https://iptv-org.github.io/iptv/categories/business.m3u' },
{ name: 'Classic', url: 'https://iptv-org.github.io/iptv/categories/classic.m3u' },
{ name: 'Comedy', url: 'https://iptv-org.github.io/iptv/categories/comedy.m3u' },
{ name: 'Cooking', url: 'https://iptv-org.github.io/iptv/categories/cooking.m3u' },
{ name: 'Culture', url: 'https://iptv-org.github.io/iptv/categories/culture.m3u' },
{ name: 'Documentary', url: 'https://iptv-org.github.io/iptv/categories/documentary.m3u' },
{ name: 'Education', url: 'https://iptv-org.github.io/iptv/categories/education.m3u' },
{ name: 'Entertainment', url: 'https://iptv-org.github.io/iptv/categories/entertainment.m3u' },
{ name: 'Family', url: 'https://iptv-org.github.io/iptv/categories/family.m3u' },
{ name: 'General', url: 'https://iptv-org.github.io/iptv/categories/general.m3u' },
{ name: 'Kids', url: 'https://iptv-org.github.io/iptv/categories/kids.m3u' },
{ name: 'Legislative', url: 'https://iptv-org.github.io/iptv/categories/legislative.m3u' },
{ name: 'Lifestyle', url: 'https://iptv-org.github.io/iptv/categories/lifestyle.m3u' },
{ name: 'Movies', url: 'https://vsalema.github.io/tvpt4/css/movies.m3u' },
{ name: 'Music', url: 'https://iptv-org.github.io/iptv/categories/music.m3u' },
{ name: 'News', url: 'https://iptv-org.github.io/iptv/categories/news.m3u' },
{ name: 'Outdoor', url: 'https://iptv-org.github.io/iptv/categories/outdoor.m3u' },
{ name: 'Relax', url: 'https://iptv-org.github.io/iptv/categories/relax.m3u' },
{ name: 'Religious', url: 'https://iptv-org.github.io/iptv/categories/religious.m3u' },
{ name: 'Science', url: 'https://iptv-org.github.io/iptv/categories/science.m3u' },
{ name: 'Series', url: 'https://iptv-org.github.io/iptv/categories/series.m3u' },
{ name: 'Shop', url: 'https://iptv-org.github.io/iptv/categories/shop.m3u' },
{ name: 'Sports', url: 'https://iptv-org.github.io/iptv/categories/sports.m3u' },
{ name: 'Travel', url: 'https://iptv-org.github.io/iptv/categories/travel.m3u' },
{ name: 'Weather', url: 'https://iptv-org.github.io/iptv/categories/weather.m3u' },
{ name: 'XXX', url: 'https://iptv-org.github.io/iptv/categories/xxx.m3u' },
{ name: 'Undefined', url: 'https://iptv-org.github.io/iptv/categories/undefined.m3u' }];


// Define the public webcams
const WEBCAMS = [
{ name: 'Webcam 1', url: 'http://24.134.3.9/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 2', url: 'http://83.48.75.113:8320/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 3', url: 'http://212.231.225.55:88/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 4', url: 'http://5.172.188.145:9995/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 5', url: 'http://71.43.10.26:9080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 6', url: 'http://96.91.239.26:1024/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 7', url: 'http://218.219.195.24/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 8', url: 'http://80.254.191.189:8008/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 9', url: 'http://85.196.146.82:3337/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 10', url: 'http://185.74.192.88:85/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 11', url: 'http://46.19.234.136/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 12', url: 'http://173.165.152.129:8011/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 13', url: 'http://86.63.39.58:8080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 14', url: 'http://209.23.53.204:8000/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 15', url: 'http://77.132.160.126/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 16', url: 'http://93.39.75.41:8080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 17', url: 'http://213.3.30.80:6001/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 18', url: 'http://194.103.218.16/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 19', url: 'https://128.255.86.21/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 20', url: 'http://221.189.116.218:60001/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 21', url: 'http://218.219.214.248:50000/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 22', url: 'http://220.157.230.36/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 23', url: 'http://118.21.111.254:65000/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 24', url: 'http://38.79.156.188/CgiStart/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 25', url: 'http://213.123.122.163:1087/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 26', url: 'http://98.101.223.10:8207/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 27', url: 'http://80.28.111.68:82/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 28', url: 'http://173.13.181.58/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 29', url: 'http://208.65.20.237/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 30', url: 'http://185.108.19.197:10800/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 31', url: 'http://63.42.216.178:8088/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 32', url: 'http://82.127.206.236/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 33', url: 'http://80.75.112.38:9080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 34', url: 'http://91.214.62.226/control/userimage.html' },
{ name: 'Webcam 35', url: 'http://63.41.44.111:81/control/userimage.html' },
{ name: 'Webcam 36', url: 'http://82.69.86.56/control/faststream.jpg' },
{ name: 'Webcam 37', url: 'http://166.153.247.80:82/control/userimage.html' },
{ name: 'Webcam 38', url: 'http://66.186.229.166:3000/control/userimage.html' },
{ name: 'Webcam 39', url: 'http://107.84.202.41:9501/control/userimage.html' },
{ name: 'Webcam 40', url: 'http://202.239.224.34/control/userimage.html' },
{ name: 'Webcam 41', url: 'http://31.193.25.62:10002/control/userimage.html' },
{ name: 'Webcam 42', url: 'http://194.94.76.134/control/userimage.html' },
{ name: 'Webcam 43', url: 'http://31.207.113.22:50001/control/userimage.html' },
{ name: 'Webcam 44', url: 'http://143.93.83.83/control/userimage.html' },
{ name: 'Webcam 45', url: 'http://212.68.79.188/control/userimage.html' },
{ name: 'Webcam 46', url: 'http://205.207.202.61:85/control/userimage.html' },
{ name: 'Webcam 47', url: 'http://84.196.123.133:4433/control/userimage.html' },
{ name: 'Webcam 48', url: 'http://194.116.8.136:82/control/userimage.html' },
{ name: 'Webcam 49', url: 'http://77.60.226.189:8012/control/userimage.html' },
{ name: 'Webcam 50', url: 'http://166.168.112.141:82/control/userimage.html' },
{ name: 'Webcam 51', url: 'http://82.77.203.219:8080/control/userimage.html' },
{ name: 'Webcam 52', url: 'http://live-hornissen.dyndns.org:81/control/userimage.html' },
{ name: 'Webcam 53', url: 'http://85.8.92.1/control/userimage.html' },
{ name: 'Webcam 54', url: 'http://63.41.44.105:81/control/userimage.html' },
{ name: 'Webcam 55', url: 'http://80.245.224.153/control/userimage.html' },
{ name: 'Webcam 56', url: 'http://89.97.231.70:8083/control/userimage.html' },
{ name: 'Webcam 57', url: 'http://213.5.145.4/control/userimage.html' },
{ name: 'Webcam 58', url: 'http://162.191.186.59:81/control/userimage.html' },
{ name: 'Webcam 59', url: 'http://61.115.78.205/control/userimage.html' },
{ name: 'Webcam 60', url: 'http://194.106.254.98:1080/control/userimage.html' },
{ name: 'Webcam 61', url: 'http://185.51.128.133:82/control/userimage.html' },
{ name: 'Webcam 62', url: 'http://208.77.125.240:81/control/userimage.html' },
{ name: 'Webcam 63', url: 'http://162.191.169.17:81/control/userimage.html' },
{ name: 'Webcam 64', url: 'http://63.41.124.38/control/userimage.html' },
{ name: 'Webcam 65', url: 'http://77.60.226.189:8013/control/userimage.html' },
{ name: 'Webcam 66', url: 'http://217.112.104.16:9093/control/userimage.html' },
{ name: 'Webcam 67', url: 'http://204.13.105.114:8082/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 68', url: 'http://83.48.75.113:8320/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 69', url: 'http://77.110.245.165/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 70', url: 'http://93.39.75.41:8080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 71', url: 'http://155.133.206.74:8080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 72', url: 'http://82.148.72.68/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 73', url: 'http://71.245.72.4:8084/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 74', url: 'http://80.75.114.18/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 75', url: 'http://98.101.247.131:8080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 76', url: 'http://79.161.6.126:9092/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 77', url: 'http://128.255.86.21/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 78', url: 'http://142.0.109.159/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 79', url: 'http://46.19.234.136/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 80', url: 'http://80.254.191.189:8008/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 81', url: 'http://212.231.225.55:88/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 82', url: 'http://85.31.165.140/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 83', url: 'http://74.95.172.65:8100/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 84', url: 'http://212.26.235.210/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 85', url: 'http://93.115.156.3:91/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 86', url: 'http://187.141.142.149:8010/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 87', url: 'http://184.70.158.122/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 88', url: 'http://213.123.122.163:1087/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 89', url: 'http://185.226.233.55:8001/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 90', url: 'http://96.91.239.26:1024/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 91', url: 'http://185.74.192.88:85/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 92', url: 'http://85.196.146.82:3336/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 93', url: 'http://79.141.146.83/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 94', url: 'http://74.113.182.246:9600/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 95', url: 'http://208.124.240.178/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 96', url: 'http://185.4.201.7:8001/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 97', url: 'http://194.117.170.212:1080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 98', url: 'http://109.247.15.178:6001/mjpg/video.mjpg' },
{ name: 'Webcam 99', url: 'http://94.30.51.166:50000/mjpg/video.mjpg' },
{ name: 'Webcam 100', url: 'http://188.113.184.246:47544/mjpg/video.mjpg' },
{ name: 'Webcam 101', url: 'http://87.54.229.102/mjpg/video.mjpg' },
{ name: 'Webcam 102', url: 'http://63.142.183.154:6103/mjpg/video.mjpg' },
{ name: 'Webcam 103', url: 'http://131.95.3.163/mjpg/video.mjpg' },
{ name: 'Webcam 104', url: 'http://93.48.88.159/mjpg/video.mjpg' },
{ name: 'Webcam 105', url: 'http://68.116.33.170:4002/mjpg/video.mjpg' },
{ name: 'Webcam 106', url: 'http://37.156.71.253/cgi-bin/guestimage.html' },
{ name: 'Webcam 107', url: 'http://117.206.86.54:8080/mjpg/video.mjpg' },
{ name: 'Webcam 108', url: 'http://115.179.100.76:8080/CgiStart?page=Single&Language=0' },
{ name: 'Webcam 109 (Red Panda)', url: 'http://58.94.98.44/CgiStart?page=Single&Language=0' },
{ name: 'Webcam 110', url: 'http://158.58.130.148/view/viewer_index.shtml?id=701' },
{ name: 'Webcam 111', url: 'http://209.181.16.167:8082/' },
{ name: 'Webcam 112', url: 'http://73.253.117.121:1024/view/viewer_index.shtml' },
{ name: 'Webcam 113', url: 'http://72.253.153.216:81/view/index.shtml' },
{ name: 'Webcam 114', url: 'http://217.24.53.18/cgi-bin/guestimage.html' },
{ name: 'Webcam 115', url: 'http://14.160.87.118:82/live/index.html?Language=0' },
{ name: 'Webcam 116', url: 'http://194.44.38.196:8083/view/viewer_index.shtml?id=493' },
{ name: 'Webcam 117', url: 'http://210.248.127.20/CgiStart?page=Single&Language=0' },
{ name: 'Webcam 118', url: 'http://191.241.235.43/view/viewer_index.shtml?id=5460' },
{ name: 'Webcam 119', url: 'http://221.189.0.181/cgi-bin/guestimage.html' },
{ name: 'Webcam 120', url: 'http://218.45.173.232:8000/live/index.html?Language=1&ViewMode=pull' },
{ name: 'Webcam 121', url: 'http://78.152.125.150:8200/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 122', url: 'http://77.242.135.139:8082/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 123', url: 'http://194.228.12.197/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 124', url: 'http://148.59.208.105/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 125', url: 'http://109.205.108.132/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 126', url: 'http://77.89.48.20:8003/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 127', url: 'http://213.98.123.127:8050/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 128', url: 'http://166.149.155.73:7001/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 129', url: 'http://91.133.105.85:50050/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 130', url: 'http://96.66.39.30:8090/cgi-bin/guestimage.html' },
{ name: 'Webcam 131', url: 'http://88.119.22.157/cgi-bin/guestimage.html' },
{ name: 'Webcam 132', url: 'http://118.174.196.20:2220/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 133', url: 'http://153.156.235.87/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 134', url: 'http://217.24.53.18/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 135', url: 'http://166.151.98.221:7001/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 136', url: 'http://80.14.77.21:8087/cgi-bin/guestimage.html' },
{ name: 'Webcam 137', url: 'http://37.182.240.202:82/cgi-bin/faststream.jpg' },
{ name: 'Webcam 138', url: 'http://64.28.50.246/mjpg/video.mjpg' },
{ name: 'Webcam 139', url: 'http://87.101.127.24/mjpg/video.mjpg' },
{ name: 'Webcam 140', url: 'http://195.32.24.180:1024/mjpg/video.mjpg' },
{ name: 'Webcam 141', url: 'http://193.214.75.118/mjpg/video.mjpg' },
{ name: 'Webcam 142', url: 'http://212.67.236.61/mjpg/video.mjpg' },
{ name: 'Webcam 143', url: 'http://94.139.68.110/mjpg/video.mjpg' },
{ name: 'Webcam 144', url: 'http://185.133.99.214:8010/mjpg/video.mjpg' },
{ name: 'Webcam 145', url: 'http://216.223.107.140/mjpg/video.mjpg' },
{ name: 'Webcam 146', url: 'http://100.42.92.26/mjpg/video.mjpg' },
{ name: 'Webcam 147', url: 'http://77.106.164.66/#view' },
{ name: 'Webcam 148', url: 'http://77.222.181.11:8080/mjpg/video.mjpg' },
{ name: 'Webcam 149', url: 'http://80.14.201.251:8010/mjpg/video.mjpg' },
{ name: 'Webcam 150', url: 'http://62.238.67.246:8082/mjpg/1/video.mjpg' },
{ name: 'Webcam 151', url: 'http://185.80.208.125/#view' },
{ name: 'Webcam 152', url: 'http://195.196.36.242/#view' },
{ name: 'Webcam 153', url: 'http://220.233.144.165:8888/mjpg/video.mjpg' },
{ name: 'Webcam 154', url: 'http://87.224.70.147:1884/mjpg/video.mjpg' },
{ name: 'Webcam 155', url: 'http://80.13.46.193:2503/mjpg/video.mjpg' },
{ name: 'Webcam 156', url: 'http://176.35.166.49/mjpg/video.mjpg' },
{ name: 'Webcam 157', url: 'http://178.174.58.91/mjpg/video.mjpg' },
{ name: 'Webcam 158', url: 'http://95.161.27.60/mjpg/video.mjpg' },
{ name: 'Webcam 159', url: 'http://96.83.150.209/mjpg/video.mjpg' },
{ name: 'Webcam 160', url: 'http://212.6.91.123/mjpg/video.mjpg' },
{ name: 'Webcam 161', url: 'http://193.90.139.222:33445/mjpg/video.mjpg' },
{ name: 'Webcam 162', url: 'http://213.128.169.233:1112/mjpg/video.mjpg' },
{ name: 'Webcam 163', url: 'http://85.93.233.159:8080/mjpg/video.mjpg' },
{ name: 'Webcam 164', url: 'http://89.162.14.87/mjpg/video.mjpg' },
{ name: 'Webcam 165', url: 'http://104.207.27.126:8080/mjpg/video.mjpg' },
{ name: 'Webcam 166', url: 'http://70.89.165.178/mjpg/video.mjpg' },
{ name: 'Webcam 167', url: 'http://80.13.189.135/mjpg/video.mjpg' },
{ name: 'Webcam 168', url: 'http://188.113.160.155:44012/mjpg/video.mjpg' },
{ name: 'Webcam 169', url: 'http://77.110.203.114:82/mjpg/video.mjpg' },
{ name: 'Webcam 170', url: 'http://93.48.88.159/mjpg/video.mjpg' },
{ name: 'Webcam 171', url: 'http://109.236.111.203/mjpg/video.mjpg' },
{ name: 'Webcam 172', url: 'http://87.139.9.247/#view' },
{ name: 'Webcam 173', url: 'http://166.247.77.253:81/#view' },
{ name: 'Webcam 174', url: 'http://221.189.0.181/cgi-bin/guestimage.html' },
{ name: 'Webcam 175', url: 'http://87.138.157.245/cgi-bin/guestimage.html' },
{ name: 'Webcam 176', url: 'http://191.241.235.43/mjpg/video.mjpg' },
{ name: 'Webcam 177', url: 'http://161.72.22.244/mjpg/video.mjpg' },
{ name: 'Webcam 178', url: 'http://50.197.223.169/#view' },
{ name: 'Webcam 179', url: 'http://85.220.149.7/cgi-bin/guestimage.html' },
{ name: 'Webcam 180', url: 'http://97.68.104.34/aca/index.html#view' },
{ name: 'Webcam 181', url: 'http://62.131.207.209:8080/' },
{ name: 'Webcam 182', url: 'http://84.232.147.36:8080/cgi-bin/guestimage.html' },
{ name: 'Webcam 183', url: 'http://91.192.168.58:8080/mjpg/video.mjpg' },
{ name: 'Webcam 184', url: 'http://37.156.71.253/cgi-bin/guestimage.html' },
{ name: 'Webcam 185', url: 'http://79.8.83.39/en/index.html' },
{ name: 'Webcam 186', url: 'http://185.18.130.194:8001/mjpg/1/video.mjpg' },
{ name: 'Webcam 187', url: 'http://185.97.122.128/cgi-bin/guestimage.html' },
{ name: 'Webcam 188', url: 'http://217.24.53.18/cgi-bin/guestimage.html' },
{ name: 'Webcam 189', url: 'http://80.32.125.254:8080/cgi-bin/guestimage.html' },
{ name: 'Webcam 190', url: 'http://114.179.205.142/live/index.html?Language=1' },
{ name: 'Webcam 191', url: 'http://202.245.13.81/live/index.html?Language=0' },
{ name: 'Webcam 192', url: 'http://50.197.223.170/#view' },
{ name: 'Webcam 193', url: 'http://77.222.181.11:8080/mjpg/video.mjpg' },
{ name: 'Webcam 194', url: 'http://109.233.191.228:8090' },
{ name: 'Webcam 195', url: 'http://195.222.51.206:81/mjpg/video.mjpg' },
{ name: 'Webcam 196', url: 'http://118.21.146.177:7001/viewer/live/index.html' },
{ name: 'Webcam 197', url: 'http://68.116.33.170:4003/mjpg/video.mjpg' },
{ name: 'Webcam 198', url: 'http://199.188.177.5:53020/mjpg/video.mjpg' },
{ name: 'Webcam 199', url: 'http://213.236.250.78/mjpg/video.mjpg' },
{ name: 'Webcam 200', url: 'http://204.106.237.68:88/mjpg/1/video.mjpg' },
{ name: 'Webcam 201', url: 'http://96.91.10.219/mjpg/1/video.mjpg' },
{ name: 'Webcam 202', url: 'http://83.136.176.101:10013/mjpg/video.mjpg' },
{ name: 'Webcam 203', url: 'http://24.155.92.234:50088/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 204', url: 'http://2.139.181.21:81/mjpg/video.mjpg' },
{ name: 'Webcam 205', url: 'http://153.156.82.99/nphMotionJpeg' },
{ name: 'Webcam 206', url: 'http://89.162.116.155:203/mjpg/video.mjpg' },
{ name: 'Webcam 207', url: 'http://212.67.231.233/mjpg/video.mjpg' },
{ name: 'Webcam 208', url: 'http://63.142.190.238:6106/mjpg/video.mjpg' },
{ name: 'Webcam 209', url: 'http://72.17.65.138/mjpg/video.mjpg' },
{ name: 'Webcam 210', url: 'http://63.142.190.238:6106/mjpg/video.mjpg' },
{ name: 'Webcam 211', url: 'http://77.37.212.198:559/mjpg/video.mjpg' },
{ name: 'Webcam 212', url: 'http://50.236.229.38:8080/mjpg/video.mjpg' },
{ name: 'Webcam 213', url: 'http://63.142.190.238:6120/mjpg/video.mjpg' },
{ name: 'Webcam 214', url: 'http://81.149.2.82:8092/mjpg/video.mjpg?streamprofile=MJPG_720' },
{ name: 'Webcam 215', url: 'http://217.33.17.229/mjpg/video.mjpg' },
{ name: 'Webcam 216', url: 'http://159.130.70.206/mjpg/video.mjpg' },
{ name: 'Webcam 217', url: 'http://67.53.46.161:65123/mjpg/video.mjpg' },
{ name: 'Webcam 218', url: 'http://176.128.62.142:3000/mjpg/video.mjpg' },
{ name: 'Webcam 219', url: 'http://89.106.109.144:12060/mjpg/video.mjpg' },
{ name: 'Webcam 220', url: 'http://213.47.219.147:89/mjpg/video.mjpg' },
{ name: 'Webcam 221', url: 'http://178.239.225.102/mjpg/video.mjpg' },
{ name: 'Webcam 222', url: 'http://96.56.250.139:8200/mjpg/video.mjpg' },
{ name: 'Webcam 223', url: 'http://119.2.50.116:89/mjpg/video.mjpg' },
{ name: 'Webcam 224', url: 'http://109.109.87.147/mjpg/video.mjpg' },
{ name: 'Webcam 225', url: 'http://89.26.84.194:5661/mjpg/video.mjpg' },
{ name: 'Webcam 226', url: 'http://90.146.10.190/mjpg/video.mjpg' },
{ name: 'Webcam 227', url: 'http://165.234.49.199/mjpg/video.mjpg' },
{ name: 'Webcam 228', url: 'http://80.122.210.78:8081/mjpg/video.mjpg' },
{ name: 'Webcam 229', url: 'http://62.246.141.148:12513/mjpg/video.mjpg' },
{ name: 'Webcam 230', url: 'http://173.162.200.86:3123/mjpg/video.mjpg' },
{ name: 'Webcam 231', url: 'http://78.31.82.246/mjpg/video.mjpg' },
{ name: 'Webcam 232', url: 'http://77.110.219.78/mjpg/video.mjpg' },
{ name: 'Webcam 233', url: 'http://93.181.81.175/mjpg/video.mjpg' },
{ name: 'Webcam 234', url: 'https://82.198.200.23/mjpg/video.mjpg' },
{ name: 'Webcam 235', url: 'http://157.157.30.91/mjpg/video.mjpg' },
{ name: 'Webcam 236', url: 'http://104.243.223.162:8082/mjpg/video.mjpg' },
{ name: 'Webcam 237', url: 'http://213.3.30.80:6001/mjpg/video.mjpg' },
{ name: 'Webcam 238', url: 'http://185.133.99.214:8011/mjpg/video.mjpg' },
{ name: 'Webcam 239', url: 'https://82.198.200.23/mjpg/video.mjpg' },
{ name: 'Webcam 240', url: 'http://61.211.241.239/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 241', url: 'http://50.231.121.221/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 242', url: 'http://70.63.123.20/mjpg/1/video.mjpg' },
{ name: 'Webcam 243', url: 'http://212.170.100.189/mjpg/video.mjpg' },
{ name: 'Webcam 244', url: 'http://83.128.165.80/mjpg/video.mjpg' },
{ name: 'Webcam 245', url: 'http://207.194.15.97/mjpg/video.mjpg' },
{ name: 'Webcam 246', url: 'https://129.2.146.15/#view' },
{ name: 'Webcam 247', url: 'https://129.2.146.15/jpg/image.jpg' },
{ name: 'Webcam 248', url: 'http://86.62.184.186:8788/mjpg/1/video.mjpg' },
{ name: 'Webcam 249', url: 'http://37.128.212.84/mjpg/video.mjpg' },
{ name: 'Webcam 250', url: 'http://47.206.111.174/mjpg/video.mjpg' },
{ name: 'Webcam 251', url: 'http://194.103.218.15/mjpg/video.mjpg' },
{ name: 'Webcam 252', url: 'http://62.238.67.246:8082/mjpg/1/video.mjpg' },
{ name: 'Webcam 253', url: 'http://62.214.4.38/mjpg/video.mjpg' },
{ name: 'Webcam 254', url: 'http://199.104.253.4/mjpg/video.mjpg' },
{ name: 'Webcam 255', url: 'http://78.186.26.188/mjpg/1/video.mjpg' },
{ name: 'Webcam 256', url: 'http://185.49.169.66:1024/control/faststream.jpg?stream=full&fps=16' },
{ name: 'Webcam 257', url: 'http://213.135.11.51/control/faststream.jpg?stream=full&fps=4' },
{ name: 'Webcam 258', url: 'http://194.164.144.234/control/faststream.jpg?stream=full&fps=16' },
{ name: 'Webcam 259', url: 'http://92.245.4.53/mjpg/video.mjpg' },
{ name: 'Webcam 260', url: 'http://81.167.114.67:84/mjpg/video.mjpg' },
{ name: 'Webcam 261', url: 'http://82.134.72.194/mjpg/video.mjpg' },
{ name: 'Webcam 262', url: 'http://46.14.58.189/mjpg/video.mjpg' },
{ name: 'Webcam 263', url: 'http://212.41.248.38/cgi-bin/hugesize.jpg?camera=4&motion=0' },
{ name: 'Webcam 264', url: 'http://212.41.248.38/cgi-bin/hugesize.jpg?camera=1&motion=0' },
{ name: 'Webcam 265', url: 'http://212.41.248.38/cgi-bin/hugesize.jpg?camera=3&motion=0' },
{ name: 'Webcam 266', url: 'http://31.132.43.196:81/cgi-bin/fullsize.jpg?camera=2&motion=0' },
{ name: 'Webcam 267', url: 'http://31.132.43.196:81/cgi-bin/fullsize.jpg?camera=3&motion=0' },
{ name: 'Webcam 268', url: 'http://195.196.36.242/mjpg/video.mjpg' },
{ name: 'Webcam 269', url: 'http://202.174.60.121/-wvhttp-01-/image.cgi' },
{ name: 'Webcam 270', url: 'http://176.12.133.122/cgi-bin/guestimage.html' },
{ name: 'Webcam 271', url: 'http://mzinfo.ddnss.de:5013/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 272', url: 'http://live1.tusten.no:8080/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 273', url: 'http://webcam.anklam.de/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 274', url: 'http://minigolf-paderborn.spdns.de:86/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 275', url: 'https://camera.strandafjellet.no:8441/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 276', url: 'http://museumhallevik2.ddns.net:9501/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 277', url: 'http://yakumo-fishing-circle.aa0.netvolante.jp/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 278', url: 'https://webcam.vliegveldzeeland.nl:7171/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 279', url: 'http://chalet-chuenis.internet-box.ch/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 280', url: 'https://pavwebcam.warrnambool.vic.gov.au/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 281', url: 'http://webcam2.minden-wlan.de:10000/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 282', url: 'https://wcam.apalmeria.com:10881/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 283', url: 'http://cam2.aub.edu.lb/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 284', url: 'http://webcam-dahab.harry-nass.com/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 285', url: 'http://cam-mckeldin-eastview.umd.edu/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 286', url: 'http://shimamaki-camera.aa0.netvolante.jp:8001/nphMotionJpeg?Resolution=320x240' },
{ name: 'Webcam 287', url: 'http://barbadillodeherreros.dyndns.org:9001/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 288', url: 'https://webcam.duntondestinations.com/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 289', url: 'http://klosterplatz.selfip.info/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 290', url: 'http://webcam.fairharbormarina.com/nphMotionJpeg?Resolution=640x480' },
{ name: 'Webcam 291', url: 'http://cam0819917993.ddns.komatsuelec.co.jp/nphMotionJpeg?Resolution=640x480&Quality=Clarity' },
{ name: 'Webcam 292', url: 'http://x3hgy587adhfql.selfhost.eu:8080/axis-cgi/mjpg/video.cgi?resolution=4CIF&camera=4' },
{ name: 'Webcam 293', url: 'http://x3hgy587adhfql.selfhost.eu:8080/axis-cgi/mjpg/video.cgi?resolution=4CIF&camera=3' },
{ name: 'Webcam 294', url: 'http://x3hgy587adhfql.selfhost.eu:8080/axis-cgi/mjpg/video.cgi?resolution=4CIF&camera=2' },
{ name: 'Webcam 295', url: 'http://x3hgy587adhfql.selfhost.eu:8080/axis-cgi/mjpg/video.cgi?resolution=4CIF&camera=1' },
{ name: 'Webcam 296', url: 'https://erma-stedi-cam.gmd-tg.ch/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 297', url: 'https://iihrwc03.iowa.uiowa.edu/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 298', url: 'https://langrenn.harjo.net/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 299', url: 'https://ysp.ysnp.gov.tw/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 300', url: 'http://webcam1.vilhelmina.se/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 301', url: 'http://webcam2.vilhelmina.se/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 302', url: 'http://webcam3.vilhelmina.se/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 303', url: 'http://webcam4.vilhelmina.se/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 304', url: 'http://hurghada-seaview.harry-nass.com/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 305', url: 'https://meishan.ysnp.gov.tw/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 306', url: 'http://webcam.aui.ma/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 307', url: 'http://roseswifi.dyndns.info:8103/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 308', url: 'http://montfarlagne.tacticddns.com:8081/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 309', url: 'https://herberts.meinekameras.de:10169/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 310', url: 'http://skalka.dyndns.org:92/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 311', url: 'http://oceanmist.ddns.net:8084/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 312', url: 'http://nasukashi.aa0.netvolante.jp:8192/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 313', url: 'http://websrc.hlmfk.se:8001/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 314', url: 'http://chalet-chuenis.internet-box.ch/axis-cgi/mjpg/video.cgi' },
{ name: 'Webcam 315', url: 'http://mittaghorn.mine.nu/mjpg/video.mjpg' },
{ name: 'Webcam 316', url: 'http://holmen.tplinkdns.com/mjpg/video.mjpg' },
{ name: 'Webcam 317', url: 'http://renzo.dyndns.tv/mjpg/video.mjpg' },
{ name: 'Webcam 318', url: 'http://remote.port-royan.com/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 319', url: 'https://webcamrm.loodswezen.nl/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 320', url: 'https://webcam.sparkassenplatz.info/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 321', url: 'http://plassenburg-blick.iyxdveyshavdrmjx.myfritz.net/cgi-bin/faststream.jpg?stream=full&fps=25' },
{ name: 'Webcam 322', url: 'http://towercam04.rep-am.com:8084/mjpg/video.mjpg' },
{ name: 'Webcam 323', url: 'http://piercam.cofairhope.com/mjpg/video.mjpg' },
{ name: 'Webcam 324', url: 'https://ipcam-1.byrd.osu.edu/mjpg/video.mjpg' },
{ name: 'Webcam 325', url: 'http://eyc.synology.me:10001/mjpg/video.mjpg' },
{ name: 'Webcam 326', url: 'http://lafarge.sarl2e.fr:3100/mjpg/video.mjpg' },
{ name: 'Webcam 327', url: 'http://webcam.agf-bw.info:8092/mjpg/video.mjpg' },
{ name: 'Webcam 328', url: 'http://camera.sissiboo.com:86/mjpg/video.mjpg' },
{ name: 'Webcam 329', url: 'http://camera.dyndns-pics.com:8090/mjpg/video.mjpg' },
{ name: 'Webcam 330', url: 'http://captainsbounty.dnsalias.com/mjpg/video.mjpg' },
{ name: 'Webcam 331', url: 'http://webcam.teuva.fi/mjpg/video.mjpg?webcam.jpg' },
{ name: 'Webcam 332', url: 'http://skolten.info:8080/mjpg/video.mjpg' },
{ name: 'Webcam 333', url: 'https://storatorg.halmstad.se/mjpg/video.mjpg' },
{ name: 'Webcam 334', url: 'http://koupaliste.velkeopatovice.cz/mjpg/video.mjpg' },
{ name: 'Webcam 335', url: 'http://webcam.zvnoordwijk.nl:82/mjpg/video.mjpg' },
{ name: 'Webcam 336', url: 'http://htadmcam01.larimer.org/mjpg/video.mjpg' },
{ name: 'Webcam 337', url: 'http://camera6.city.satsumasendai.lg.jp/-wvhttp-01-/image.cgi' },
{ name: 'Webcam 338', url: 'http://kamera.mikulov.cz:8888/mjpg/video.mjpg' },
{ name: 'Webcam 339', url: 'http://yukijinjya.st.wakwak.ne.jp/control/userimage.html' },
{ name: 'Webcam 340', url: 'https://camsuior3.npoint.ro/control/userimage.html' },
{ name: 'Webcam 341', url: 'http://ferienpenthouse34.spdns.de:4601/control/userimage.html' },
{ name: 'Webcam 342', url: 'http://hof-verlo.selfhost.bz/control/userimage.html' },
{ name: 'Webcam 343', url: 'http://panoramabivio.internet-box.ch/control/userimage.html' },
{ name: 'Webcam 344', url: 'http://amrescam1.homeip.net:88/control/userimage.html' },
{ name: 'Webcam 345', url: 'https://basissandgrube.homeip.net/CAM1/control/userimage.html' },
{ name: 'Webcam 346', url: 'http://adlerschanze.selfhost.eu/control/userimage.html' },
{ name: 'Webcam 347', url: 'http://fishfactory.ddns.net/control/userimage.html' },
{ name: 'Webcam 348', url: 'https://csea-me-webcam.cse.umn.edu/mjpg/video.mjpg' },
{ name: 'Webcam 349', url: 'http://vetter.viewnetcam.com:50000/nphMotionJpeg?Resolution=640x480&Quality=Clarity' },
{ name: 'Webcam 350', url: 'http://tamperehacklab.tunk.org:38001/nphMotionJpeg?Resolution=640x480&Quality=Clarity' },
{ name: 'Webcam 351', url: 'http://clausenrc5.viewnetcam.com:50003/nphMotionJpeg?Resolution=320x240' },
{ name: 'Webcam 352', url: 'http://honjin1.miemasu.net/nphMotionJpeg' },
{ name: 'Webcam 353', url: 'http://camera.buffalotrace.com/mjpg/video.mjpg' },
{ name: 'Webcam 354', url: 'http://velospeer.spdns.org/mjpg/video.mjpg' },
{ name: 'Webcam 355', url: 'http://camera6.buffalotrace.com/mjpg/video.mjpg' },
{ name: 'Webcam 356', url: 'http://pendelcam.kip.uni-heidelberg.de/mjpg/video.mjpg' },
{ name: 'Webcam 357', url: 'http://takemotopiano.aa1.netvolante.jp:8102/nphMotionJpeg' },
{ name: 'Webcam 358', url: 'http://takemotopiano.aa1.netvolante.jp:8104/nphMotionJpeg' },
{ name: 'Webcam 359', url: 'http://iyashi-webcam.st.wakwak.ne.jp/nphMotionJpeg?Resolution=320x240&Quality=Standard' },
{ name: 'Webcam 360', url: 'http://cam6284208.miemasu.net/nphMotionJpeg' },
{ name: 'Webcam 361', url: 'http://25e384n5t3g4njrs.myfritz.net:9080/control/faststream.jpg?stream=full&fps=16' },
{ name: 'Webcam 362', url: 'http://hikosan.aa0.netvolante.jp:1230/mjpg/video.mjpg' },
{ name: 'Webcam 363', url: 'http://casamellow.dyndns.org/mjpg/video.mjpg' },
{ name: 'Webcam 364', url: 'http://hoybakken.dyndns.org:9876/mjpg/video.mjpg' },
{ name: 'Webcam 365', url: 'https://webcam.caucedo.com:15080/mjpg/1/video.mjpg' },
{ name: 'Webcam 366', url: 'https://webcam1.lpl.org/mjpg/video.mjpg' },
{ name: 'Webcam 367', url: 'https://gbpvcam01.taferresorts.com/mjpg/video.mjpg' },
{ name: 'Webcam 368', url: 'http://view.dikemes.edu.gr/mjpg/video.mjpg' },
{ name: 'Webcam 369', url: 'http://alatsaeroclub.ddns.net:85/mjpg/video.mjpg' },
{ name: 'Webcam 370', url: 'http://abcmaingate.dyndns.info:8081/mjpg/video.mjpg' },
{ name: 'Webcam 371', url: 'http://webkamera.overtornea.se/mjpg/video.mjpg' },
{ name: 'Webcam 372', url: 'http://do0lee.homeunix.com:82/mjpg/video.mjpg' },
{ name: 'Webcam 373', url: 'http://mmb.aa1.netvolante.jp:1025/mjpg/video.mjpg?resolution=640x360' },
{ name: 'Webcam 374', url: 'http://seegler.homeip.net:8888/mjpg/video.mjpg' },
{ name: 'Webcam 375', url: 'http://marina.art-net.co.il:120/mjpg/video.mjpg' },
{ name: 'Webcam 376', url: 'http://skycam.sebewainggigvillage.com/mjpg/video.mjpg' },
{ name: 'Webcam 377', url: 'http://www.groto.dy.fi/mjpg/video.mjpg' },
{ name: 'Webcam 378', url: 'https://romecam.mvcc.edu/mjpg/video.mjpg?timestamp=1687505435116' },
{ name: 'Webcam 379', url: 'http://webcam.town.karuizawa.nagano.jp/krcam07/mjpg/1/video.mjpg' },
{ name: 'Webcam 380', url: 'http://mbr-cam.dyndns.org:8088/mjpg/video.mjpg' },
{ name: 'Webcam 381', url: 'http://webcam.town.karuizawa.nagano.jp/krcam02/mjpg/video.mjpg' },
{ name: 'Webcam 382', url: 'http://skolten.net:8080/mjpg/video.mjpg' },
{ name: 'Webcam 383', url: 'https://webcam.privcom.ch/mjpg/video.mjpg' },
{ name: 'Webcam 384', url: 'http://myrafjell.sodvin.no/mjpg/video.mjpg' },
{ name: 'Webcam 385', url: 'http://hikosan.aa0.netvolante.jp:1250/mjpg/video.mjpg' },
{ name: 'Webcam 386', url: 'http://mmb.aa1.netvolante.jp:1025/mjpg/video.mjpg?resolution=640x360&compression=50' },
{ name: 'Webcam 387', url: 'https://webcam.schwaebischhall.de/mjpg/video.mjpg' },
{ name: 'Webcam 388', url: 'http://e1480d3b88f7.sn.mynetname.net:91/mjpg/video.mjpg' },
{ name: 'Webcam 389', url: 'https://hotellbakken.gaustablikk.no/mjpg/video.mjpg' },
{ name: 'Webcam 390', url: 'http://8xvsooocqu70mv3z.myfritz.net:88' },
{ name: 'Webcam 391', url: 'http://flightcam1.pr.erau.edu/view/view.shtml' },
{ name: 'Webcam 392', url: 'http://flightcam2.pr.erau.edu/view/view.shtml' },
{ name: 'Webcam 393', url: 'http://flightcam3.pr.erau.edu/view/view.shtml' }];


// New: Other Feeds
const OTHER_FEEDS = [
{ name: 'Blender Test Stream', url: 'https://ireplay.tv/test/blender.m3u8', logo: 'https://placehold.co/40x40/374151/d1d5db?text=BL' },
{ name: 'NASA TV Live', url: 'http://nasatv-lh.akamaihd.net/i/NASA_101@319270/index_1000_av-p.m3u8?sd=10&rebase=on', logo: 'https://placehold.co/40x40/374151/d1d5db?text=NASA' }];



/**
 * Initializes the application when the DOM is fully loaded.
 * Sets up DOM references, event listeners, and initiates channel fetching.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  videoPlayerElement = document.getElementById('player');
  channelListDiv = document.getElementById('channel-list');
  showGeoLockedCheckbox = document.getElementById('showGeoLocked');
  searchInput = document.getElementById('searchInput');
  categorySelect = document.getElementById('categorySelect');
  currentChannelNameDisplay = document.getElementById('current-channel-name');
  videoLoadingIndicator = document.getElementById('video-loading-indicator');
  channelLoadingIndicator = document.getElementById('channel-loading-indicator');
  iptvControlsDiv = document.getElementById('iptvControls'); // Get reference to IPTV controls div
  modeIptvButton = document.getElementById('modeIptv');
  modeWebcamsButton = document.getElementById('modeWebcams');
  modeOtherFeedsButton = document.getElementById('modeOtherFeeds'); // Get reference to new button

  // Initialize Video.js player
  videoJsPlayer = videojs(videoPlayerElement, {}, function () {
    console.log('Video.js player is ready!');
  });

  // Populate the category dropdown for IPTV
  populateCategoryDropdown();

  // Add event listeners for filtering and category change
  showGeoLockedCheckbox.addEventListener('change', renderContent);
  searchInput.addEventListener('input', renderContent);
  categorySelect.addEventListener('change', event => {
    currentM3uUrl = event.target.value;
    fetchAndRenderContent(); // Re-fetch for new IPTV category
  });

  // Add event listeners for mode toggle buttons
  modeIptvButton.addEventListener('click', () => setMode('iptv'));
  modeWebcamsButton.addEventListener('click', () => setMode('webcams'));
  modeOtherFeedsButton.addEventListener('click', () => setMode('otherFeeds'));

  // Add event listeners for video loading state using Video.js events
  videoJsPlayer.on('waiting', () => videoLoadingIndicator.classList.remove('hidden'));
  videoJsPlayer.on('playing', () => videoLoadingIndicator.classList.add('hidden'));
  videoJsPlayer.on('error', () => {
    videoLoadingIndicator.classList.add('hidden');
    currentChannelNameDisplay.textContent = "Error playing video. Try another source.";
    // Show fallback image in the player
    let fallback = document.getElementById('video-fallback-img');
    if (!fallback) {
      fallback = document.createElement('img');
      fallback.id = 'video-fallback-img';
      fallback.className = 'absolute inset-0 w-full h-full object-contain';
      fallback.style.zIndex = 10;
      fallback.style.background = '#000';
      fallback.style.pointerEvents = 'none';
      videoPlayerElement.parentNode.appendChild(fallback);
    }
    fallback.src = 'https://placehold.co/600x400/000/fff?text=No+Stream';
  });
  videoJsPlayer.on('playing', () => {
    // Remove fallback image if present
    const fallback = document.getElementById('video-fallback-img');
    if (fallback) fallback.remove();
  });

  // Do NOT set initial mode or fetch content on page load
  // setMode('iptv'); // <-- Remove or comment out this line
});

/**
 * Sets the current mode (IPTV, Webcams, or Other Feeds) and updates the UI.
 * @param {string} mode - 'iptv', 'webcams', or 'otherFeeds'.
 */
function setMode(mode) {
  currentMode = mode;

  // Update button styles
  modeIptvButton.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  modeIptvButton.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-gray-300');
  modeWebcamsButton.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  modeWebcamsButton.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-gray-300');
  modeOtherFeedsButton.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  modeOtherFeedsButton.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-gray-300');

  if (currentMode === 'iptv') {
    modeIptvButton.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    modeIptvButton.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-gray-300');
    iptvControlsDiv.classList.remove('hidden'); // Show IPTV controls
  } else if (currentMode === 'webcams') {
    modeWebcamsButton.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    modeWebcamsButton.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-gray-300');
    iptvControlsDiv.classList.add('hidden'); // Hide IPTV controls
  } else if (currentMode === 'otherFeeds') {
    modeOtherFeedsButton.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    modeOtherFeedsButton.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-gray-300');
    iptvControlsDiv.classList.add('hidden'); // Hide IPTV controls
  }
  fetchAndRenderContent(); // Fetch and render content based on the new mode

  // Clear the video player area (remove video, fallback, and webcam image)
  videoJsPlayer.pause();
  videoJsPlayer.reset();
  videoJsPlayer.poster('');
  videoPlayerElement.style.display = '';
  const fallback = document.getElementById('video-fallback-img');
  if (fallback) fallback.remove();
  const webcamImg = document.getElementById('webcam-img');
  if (webcamImg) webcamImg.remove();
  currentChannelNameDisplay.textContent = 'Select a channel to play';
}

/**
 * Populates the category dropdown with options from the IPTV_CATEGORIES array.
 */
function populateCategoryDropdown() {
  // Clear existing options first
  categorySelect.innerHTML = '';
  IPTV_CATEGORIES.forEach(category => {
    const option = document.createElement('option');
    option.value = category.url;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
  // Set the default selected value to the initial M3U_URL
  categorySelect.value = currentM3uUrl;
}

/**
 * Fetches and renders content based on the current mode (IPTV or Webcams).
 */
async function fetchAndRenderContent() {
  channelLoadingIndicator.classList.remove('hidden'); // Show loading indicator
  allChannels = []; // Clear previous channels

  if (currentMode === 'iptv') {
    try {
      const response = await fetch(currentM3uUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const m3uText = await response.text();
      allChannels = parseM3UContent(m3uText);
    } catch (error) {
      console.error('Failed to fetch IPTV M3U:', error);
      channelListDiv.innerHTML = `<p class="text-red-400 text-center">Failed to load IPTV channels. Please try again later.</p>`;
    }
  } else if (currentMode === 'webcams') {
    // For webcams, the data is already in the WEBCAMS array
    allChannels = WEBCAMS.map((webcam, index) => ({
      name: webcam.name || `Webcam ${index + 1}`,
      url: webcam.url,
      logo: 'https://placehold.co/40x40/374151/d1d5db?text=CAM', // Generic webcam logo
      isGeoLocked: false // Webcams are not considered geo-locked for this filter
    }));
  } else if (currentMode === 'otherFeeds') {// New mode handling
    allChannels = OTHER_FEEDS.map((feed, index) => ({
      name: feed.name || `Other Feed ${index + 1}`,
      url: feed.url,
      logo: feed.logo || 'https://placehold.co/40x40/374151/d1d5db?text=FEED', // Use provided logo or generic
      isGeoLocked: false // Other feeds are not considered geo-locked for this filter
    }));
  }
  renderContent(); // Render content after fetching/preparing
  channelLoadingIndicator.classList.add('hidden'); // Hide loading indicator
}

/**
 * Renders the filtered and sorted list of channels/webcams to the DOM.
 */
function renderContent() {
  channelListDiv.innerHTML = ''; // Clear existing content

  const searchTerm = searchInput.value.toLowerCase();
  let contentToRender = [];

  if (currentMode === 'iptv') {
    const showGeo = showGeoLockedCheckbox.checked;
    contentToRender = allChannels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchTerm);
      const isVisibleByGeoLock = showGeo || !channel.isGeoLocked;
      return matchesSearch && isVisibleByGeoLock;
    });
  } else {// currentMode === 'webcams' or 'otherFeeds'
    contentToRender = allChannels.filter((item) =>
    item.name.toLowerCase().includes(searchTerm));

  }

  // Sort alphabetically by name
  contentToRender.sort((a, b) => a.name.localeCompare(b.name));

  // Store the filtered list for navigation
  currentFilteredList = contentToRender;

  if (contentToRender.length === 0) {
    channelListDiv.innerHTML = `<p class="text-gray-400 text-center py-4">No items found matching your criteria.</p>`;
    return;
  }

  contentToRender.forEach((item, idx) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex items-center p-3 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200 cursor-pointer';
    itemDiv.onclick = () => {
      currentIndex = idx;
      loadVideo(item.url, item.name);
    };

    const img = document.createElement('img');
    img.src = item.logo || 'https://placehold.co/40x40/374151/d1d5db?text=IMG'; // Use specific logo or generic
    img.alt = `${item.name} logo`;
    img.className = 'w-10 h-10 rounded-full mr-3 object-cover';
    img.onerror = function () {
      this.onerror = null;
      this.src = 'https://placehold.co/40x40/374151/d1d5db?text=IMG'; // Fallback for broken image links
    };

    const nameSpan = document.createElement('span');
    nameSpan.className = 'text-gray-200 font-medium text-sm sm:text-base flex-grow';
    nameSpan.textContent = item.name;

    itemDiv.appendChild(img);
    itemDiv.appendChild(nameSpan);
    channelListDiv.appendChild(itemDiv);
  });
}

/**
 * Parses the M3U content string into an array of channel objects.
 * This function is only used for IPTV mode.
 * @param {string} m3uText - The raw M3U playlist content.
 * @returns {Array<Object>} An array of channel objects.
 */
function parseM3UContent(m3uText) {
  const lines = m3uText.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {if (window.CP.shouldStopExecution(0)) break;
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      const attributes = line.match(/([a-zA-Z0-9-]+)="([^"]*)"/g) || [];
      const channelInfo = {};
      attributes.forEach(attr => {
        const [key, value] = attr.split('=').map(s => s.replace(/"/g, ''));
        channelInfo[key] = value;
      });

      const nameMatch = line.match(/,(.*)$/);
      channelInfo.name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';

      currentChannel = {
        name: channelInfo['tvg-name'] || channelInfo.name,
        logo: channelInfo['tvg-logo'] || 'https://placehold.co/40x40/374151/d1d5db?text=TV',
        group: channelInfo['group-title'] || 'Uncategorized',
        isGeoLocked: !!channelInfo['tvg-country'],
        url: '' };

    } else if (line && !line.startsWith('#')) {
      currentChannel.url = line;
      if (currentChannel.name && currentChannel.url) {
        channels.push(currentChannel);
      }
      currentChannel = {};
    }
  }window.CP.exitedLoop(0);
  return channels;
}

/**
 * Loads and plays the video from the given URL using Video.js or <img> for MJPEG/static image streams.
 * Handles HLS (for IPTV/some other feeds) and MJPEG (for webcams/some other feeds).
 * @param {string} url - The URL of the video stream.
 * @param {string} itemName - The name of the item (channel/webcam/feed) to display.
 */
function loadVideo(url, itemName) {
  currentChannelNameDisplay.textContent = ` ${itemName}`;
  videoLoadingIndicator.classList.remove('hidden'); // Show loading indicator

  // Remove any existing fallback image
  const fallback = document.getElementById('video-fallback-img');
  if (fallback) fallback.remove();

  // Remove any existing webcam <img> element
  const webcamImg = document.getElementById('webcam-img');
  if (webcamImg) webcamImg.remove();

  // Determine source type based on URL extension or common patterns
  let isMjpeg = false;
  if (
  url.includes('mjpg') ||
  url.includes('faststream.jpg') ||
  url.includes('guestimage.html') ||
  url.includes('image.cgi') ||
  url.includes('nphMotionJpeg'))
  {
    isMjpeg = true;
  }

  if (isMjpeg && (currentMode === 'webcams' || currentMode === 'otherFeeds')) {
    // For MJPEG/static image webcams, use <img> instead of Video.js
    videoJsPlayer.pause();
    videoJsPlayer.reset();
    videoJsPlayer.poster('');
    // Hide the video.js player
    videoPlayerElement.style.display = 'none';

    // Create and show the <img> element
    const img = document.createElement('img');
    img.id = 'webcam-img';
    img.src = url;
    img.alt = itemName;
    img.className = 'absolute inset-0 w-full h-full object-contain bg-black';
    img.style.zIndex = 10;
    img.onload = function () {
      videoLoadingIndicator.classList.add('hidden');
    };
    img.onerror = function () {
      videoLoadingIndicator.classList.add('hidden');
      img.src = 'https://placehold.co/600x400/000/fff?text=No+Stream';
    };
    videoPlayerElement.parentNode.appendChild(img);
  } else {
    // For HLS/other video streams, use Video.js
    // Remove any webcam <img> if present
    const webcamImg = document.getElementById('webcam-img');
    if (webcamImg) webcamImg.remove();
    videoPlayerElement.style.display = '';

    let sourceType = '';
    if (url.includes('.m3u8') || url.includes('.m3u')) {
      sourceType = 'application/x-mpegURL'; // HLS
    } else {
      sourceType = 'application/x-mpegURL'; // Default to HLS
    }

    videoJsPlayer.src({
      src: url,
      type: sourceType });


    videoJsPlayer.load();
    videoJsPlayer.play().catch(e => console.error("Autoplay prevented:", e));
  }
}

// Add fallback image logic to Video.js error event
videoJsPlayer.on('error', () => {
  videoLoadingIndicator.classList.add('hidden');
  currentChannelNameDisplay.textContent = "Error playing video. Try another source.";
  // Show fallback image in the player
  let fallback = document.getElementById('video-fallback-img');
  if (!fallback) {
    fallback = document.createElement('img');
    fallback.id = 'video-fallback-img';
    fallback.className = 'absolute inset-0 w-full h-full object-contain';
    fallback.style.zIndex = 10;
    fallback.style.background = '#000';
    fallback.style.pointerEvents = 'none';
    videoPlayerElement.parentNode.appendChild(fallback);
  }
  fallback.src = 'https://placehold.co/600x400/000/fff?text=No+Stream';
});
videoJsPlayer.on('playing', () => {
  // Remove fallback image if present
  const fallback = document.getElementById('video-fallback-img');
  if (fallback) fallback.remove();
});

// Previous/Next navigation logic
function setupPrevNextNavigation() {
  const prevBtn = document.getElementById('prevChannelBtn');
  const nextBtn = document.getElementById('nextChannelBtn');
  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
      if (currentFilteredList.length === 0) return;
      if (currentIndex > 0) {
        currentIndex--;
        const item = currentFilteredList[currentIndex];
        loadVideo(item.url, item.name);
      }
    };
    nextBtn.onclick = () => {
      if (currentFilteredList.length === 0) return;
      if (currentIndex < currentFilteredList.length - 1) {
        currentIndex++;
        const item = currentFilteredList[currentIndex];
        loadVideo(item.url, item.name);
      }
    };
  }
}

// Call setupPrevNextNavigation after DOM is ready and after each renderContent (in case buttons are re-rendered)
document.addEventListener('DOMContentLoaded', () => {
  setupPrevNextNavigation();
  // Keyboard navigation: Left/Right arrow for prev/next
  window.addEventListener('keydown', e => {
    if (currentFilteredList.length === 0 || currentIndex === -1) return;
    if (e.key === 'ArrowLeft') {
      // Previous
      if (currentIndex > 0) {
        currentIndex--;
        const item = currentFilteredList[currentIndex];
        loadVideo(item.url, item.name);
      }
    } else if (e.key === 'ArrowRight') {
      // Next
      if (currentIndex < currentFilteredList.length - 1) {
        currentIndex++;
        const item = currentFilteredList[currentIndex];
        loadVideo(item.url, item.name);
      }
    }
  });
});

// Also call after each renderContent to ensure buttons are always wired up
const origRenderContent = renderContent;
renderContent = function () {
  origRenderContent.apply(this, arguments);
  setupPrevNextNavigation();
};
  })();





