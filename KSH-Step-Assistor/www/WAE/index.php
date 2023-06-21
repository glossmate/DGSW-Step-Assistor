<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>녹취 파일 편집 시스템</title>
  <meta name="description" content="녹취 파일을 편집하고 저장하는 기능">

  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
  <link rel="stylesheet" href="main.css">
<!--
  <link rel="alternate" type="application/rss+xml" title="Waveform Playlist" href="https://naomiaro.github.io/waveform-playlist/feed.xml">
-->
</head>
<script>
	var AUDIO_FILE_PATH = '<?php echo $_REQUEST["AUDIO_FILE_PATH"]; ?>';
</script>
<body>
<div class="container">
	<div class="wrapper">
		<article class="post">
			<header class="post-header">
			<h1 class="post-title"><?php echo $_REQUEST["AUDIO_FILE_PATH"]; ?></h1>
<!--
			<p class="lead">Drag one or many audio files into the bottom container!</p>
-->
			</header>
			
			<div class="post-content">
				<div id="playlist"></div>
				<div id="top-bar" class="playlist-top-bar">
					<div class="playlist-toolbar">
						<div class="btn-group">
							<span class="btn-pause btn btn-warning"><i class="fa fa-pause"></i></span>
							<span class="btn-play btn btn-success"><i class="fa fa-play"></i></span>
							<span class="btn-stop btn btn-danger"><i class="fa fa-stop"></i></span>
							<span class="btn-rewind btn btn-success"><i class="fa fa-fast-backward"></i></span>
							<span class="btn-fast-forward btn btn-success"><i class="fa fa-fast-forward"></i></span>
						</div>
						<div class="btn-group">
							<span title="파형 확대" class="btn-zoom-in btn btn-default"><i class="fa fa-search-plus"></i></span>
							<span title="파형 축소" class="btn-zoom-out btn btn-default"><i class="fa fa-search-minus"></i></span>
						</div>
						<div class="btn-group btn-playlist-state-group">
							<span class="btn-cursor btn btn-default" title="위치 지정"><i class="fa fa-headphones"></i></span>
							<span class="btn-select btn btn-default active" title="영역 지정"><i class="fa fa-italic"></i></span>
							<span class="btn-shift btn btn-default" title="좌우 이동"><i class="fa fa-arrows-h"></i></span>
							<span class="btn-fadein btn btn-default" title="점점 크게"><i class="fa fa-long-arrow-left"></i></span>
							<span class="btn-fadeout btn btn-default" title="점점 작게"><i class="fa fa-long-arrow-right"></i></span>
						</div>
						<div class="btn-group btn-fade-state-group hidden">
							<span class="btn btn-default btn-logarithmic active">로그함수</span>
							<span class="btn btn-default btn-linear">선형함수</span>
							<span class="btn btn-default btn-exponential">거듭제곱함수</span>
							<span class="btn btn-default btn-scurve">S 라인</span>
						</div>
						<div class="btn-group btn-select-state-group">
							<span title="선택 영역만 남기고 지우기" class="btn-trim-audio btn btn-primary">선택 영역만 남김</span>
							<span class="btn-loop btn btn-success disabled" title="선택 영역 반복 재생">
								<i class="fa fa-repeat"></i>
							</span>
						</div>
						<div class="btn-group hidden">
							<span title="모든 오디오 트랙 지우기" class="btn btn-clear btn-danger">초기화</span>
						</div>
						<div class="btn-group">
							<span title="WAV 파일로 다운로드 받기"
							    class="btn btn-download btn-primary">
							<i class="fa fa-download"></i>
							</span>
						</div>
					</div>
				</div>
				<div class="playlist-bottom-bar">
					<form class="form-inline">
						<table style="width:100%;">
							<tr>
								<td>
									<select class="time-format form-control">
										<option value="seconds">초</option>
										<option value="thousandths">밀리초</option>
										<option value="hh:mm:ss">hh:mm:ss</option>
										<option value="hh:mm:ss.u">hh:mm:ss + 1/10 초</option>
										<option value="hh:mm:ss.uu">hh:mm:ss + 1/100 초</option>
										<option value="hh:mm:ss.uuu" selected="selected">hh:mm:ss + 밀리초</option>
									</select>
								</td>
								<td>
									<input type="text" class="audio-start input-small form-control">
								</td>
								<td>
									<input type="text" class="audio-end form-control">
								</td>
								<td>
									<label class="audio-pos">00:00:00.0</label>
								</td>
							</tr>
						</table>
					</form>
					<div class="track-drop" style="width:100%;"></div>
				</div>
			</div>
		</article>
  </div>
</div>

<script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="waveform-playlist.var.js"></script>
<script>
var playlist = WaveformPlaylist.init({
  samplesPerPixel: 1000,
  zoomLevels: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 3000, 4000, 5000],
  waveHeight: 250,
  container: document.getElementById("playlist"),
  timescale: true,
  mono: true,
  state: 'select',
  colors: {
    waveOutlineColor: '#E0EFF1',
    timeColor: 'grey',
    fadeColor: 'black'
  },
  controls: {
    show: false, //whether or not to include the track controls
    width: 200 //width of controls in pixels
  }
});

if (AUDIO_FILE_PATH.length > 0) {
	playlist.load([
		{
	    	src: AUDIO_FILE_PATH,
		},
	]).then(function() {
		//can do stuff with the playlist.
		//initialize the WAV exporter.
		playlist.initExporter();
	});
} else {
	//initialize the WAV exporter.
	playlist.initExporter();
}
</script>
<script type="text/javascript" src="emitter.js"></script>
<!--
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-62186746-1', 'auto');
  ga('send', 'pageview');
</script>
-->
</body>
</html>
