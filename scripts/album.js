//lists album1's attributes
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

//lists album2's attributes
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

//lists album3's attributes
var albumPastry = {
  title: 'The Life of Sweets',
  artist: 'Donut Man',
  label: 'NomNom',
  year: '2016',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    {title: 'Sugar Donut', duration: '1:00'},
    {title: 'Chocolate Donut', duration: '1:30'},
    {title: 'Glazed Donut', duration: '2:00'},
    {title: 'Plain Donut', duration: '2:30'}
  ]
};

//create template for each SongRow
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">' //each line
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' //anything starting with 'data-' is a data attribute; where is it being stored?
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     return template;
 };

//get corresponding album DOM
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

//puts together album into HTML
var setCurrentAlbum = function(album) {
   albumTitle.firstChild.nodeValue = album.title; //albumTitle.firstChild = [object Text]; albumTitle = [object HTMLHeadingElement]
   albumArtist.firstChild.nodeValue = album.artist;
   albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
   albumImage.setAttribute('src', album.albumArtUrl);

   albumSongList.innerHTML = '';

   for (var i = 0; i < album.songs.length; i++) {
       albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
   } // i+1 because song starts with song #1.
};

var findParentByClassName = function(element, targetClass){
  if (element){
    var currentParent = element.parentElement; //returns element's parent
    while(currentParent.className != targetClass && currentParent.className !== null){ //currentParent(current element's parent does not equal to targetClass (its parent is not itself), and it HAS at least a parent element (not null)) This loop goes up until hitting the right target parent! BRILLIANT!
        currentParent = currentParent.parentELement; // currentParent (element's parent) is now element's parent's parent
    }
    return currentParent;
  }
};
//finds Parent, given Class Name



//getSongItem() method

var getSongItem = function(element){ //how does it now song 1 and not song 2, or 3?
  switch(element.className){
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element/*element is either 'song-item-title' or song-item-duration'*/, 'album-view-song-item'/*this is their parent*/).querySelector('.song-item-number'); //what does querySelector does, exactly? // need to go higher one class (a parent higher), then go down using querySelector
    case 'song-item-number':
      return element;
    case 'album-song-button':
    case 'ion-pause':
    case 'ion-play':
      return findParentByClassName(element, 'song-item-number');//parent; why is it song-item-number?
    case 'album-view-song-item':
      return element.querySelector('.song-item-number'); //what kind of object does querySelector return?
    default:
      return;
  }
};


var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);

    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item'); //gets array of album-view-song-items
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);

    songListContainer.addEventListener('mouseover', function(event) {
        if (event.target.parentElement.className === 'album-view-song-item') {
            var songItem = getSongItem(event.target);

            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
        }
    });

    for (i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');

            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });
        songRows[i].addEventListener('click', function(event) {
             clickHandler(event.target);
        });
    }
};
