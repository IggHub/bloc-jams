var getSongNumberCell = function(number) { // 8-dates data-song-number
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) { //writes song row
    var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

    var $row = $(template);

    var clickHandler = function() { //when clicked
        var songNumber = parseInt($(this).attr('data-song-number')); //convert data-song-number data type into integer

        if (currentlyPlayingSongNumber !== null) { //not null. Something is playing
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber); //writes down the song number
        }
        if (currentlyPlayingSongNumber !== songNumber) { //when the song clicked is not the song playing
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong(); //invokes updatePlayerBarSong function; changes displayed song, toggles play/pause button
            currentSoundFile.play();
        } else if (currentlyPlayingSongNumber === songNumber) { //when the song clicked is the song playing
            if (currentSoundFile.isPaused()){
              currentSoundFile.play();
              $('.main-controls .play-pause').html(playerBarPauseButton);
              $(this).html(pauseButtonTemplate);
            } else {
              currentSoundFile.pause();
              $('.main-controls .play-pause').html(playerBarPlayButton);
              $(this).html(playButtonTemplate);
            }
        }
    };

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };

    $row.find('.song-item-number').click(clickHandler); //recall $row = template. Find song-item-number class, applies clickHandler!
    $row.hover(onHover, offHover); //applies hover eventListener
    return $row;
};

//behind dynamic property of currentlyPlayingSongNumber and currentSongFromAlbum
var setSong = function(songNumber) {
  if (currentSoundFile) { //if there is a song playing
    currentSoundFile.stop();
  }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1]; //subtracts one because it is an array
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: ['mp3'], //formats, preload, all that is part of buzz's settings.
      preload: true
    });
//currentSongFromAlbum.audioUrl returns an object

  setVolume(currentVolume);
};

var setVolume = function(volume){
  if (currentSoundFile){//if currently a song is playing
      currentSoundFile.setVolume(volume);
  }
};

var setCurrentAlbum = function(album) { //sets current album info: cover, artist, title, and event appends the song rows using createSongRow. This function is the "mother" function
    currentAlbum = album;

//sets up page's relevant properties
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

//adds text to relevant info
    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty(); //starts fresh

//appends album-view-song-list (recall $albumSongList is associated with .album-view-song-list)
    for (i = 0; i < album.songs.length; i++) {
        var $newRow= createSongRow(i + 1, album.songs[i].name, album.songs[i].length); //applies createSongRow
        $albumSongList.append($newRow);
    }
};

//displays song data, updates play/pause button
var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.name); //currentSongFromAlbum is dynamic
    $('.currently-playing .artist-name').text(currentAlbum.artist); //currentAlbum is dynamic
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var trackIndex = function(album, song) { //gives song's index related to album object
    return album.songs.indexOf(song);
};

var nextSong = function() { //next Song action
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function(){
  var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

  if (currentSoundFile.isPaused()){
    $currentlyPlayingCell.html(pauseButtonTemplate); //changes the number on row from playing to pause
    $(this).html(playerBarPauseButton);
    currentSoundFile.pause();
  } else if (currentSoundFile){
    $currentlyPlayingCell.html(playButtonTemplate);
    $(this).html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null; //shows which album is playing
var currentlyPlayingSongNumber = null; //show what song number is playing (if nothing is playing = null)
var currentSoundFile = null; //shows which sound file is the song that is playing
var currentSongFromAlbum = null; //shows which song is playing
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playerBarPlayPause = $('.main-controls .play-pause');

$(document).ready(function() { //when doc is ready, these happen:
    setCurrentAlbum(albumPicasso); //sets default album
    $previousButton.click(previousSong); //previousButton (icon), when clicked (event Listener), does a previousSong (function)
    $nextButton.click(nextSong);
    $playerBarPlayPause.click(togglePlayFromPlayerBar);
});
