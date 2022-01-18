function authenticate() {
    return gapi.auth2
        .getAuthInstance()
        .signIn({
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            ux_mode: 'redirect',
            redirect_uri: 'http://localhost:3000',
        })
        .then(
            function() {
                console.log('Sign-in successful');
            },
            function(err) {
                console.error('Error signing in: ' + err);
            }
        );
}
exports.authenticate = authenticate;

function loadClient(callback) {
    gapi.client.setApiKey(vcf.clientApiKey);
    return gapi.client
        .load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
        .then(
            function() {
                console.log('Google API client loaded');
                $('#fetch').show();
                $('#connection').hide();
                if (callback) {
                    callback();
                }
            },
            function(err) {
                console.error('Error loading Google API client: ' + err);
            }
        );
}
exports.loadClient = loadClient;

function execute() {
    if (vcf.channels.length == 0) {
        console.error("No custom channel, check file 'src/parameters.js'.");
    } else {
        vcf.channels.forEach((channel) => insertDataFromChannel(channel.id));
    }
}
exports.execute = execute;

function insertDataFromChannel(channelId) {
    gapi.client.youtube.channels
        .list({
            part: 'contentDetails,snippet',
            id: channelId,
        })
        .then(
            function(response) {
                const items = response.result.items;
                if (items.length == 0) {
                    console.error(
                        `No channel found with id: '${channelId}'.`
                    );
                } else {
                    insertDataFromUploadedPlaylist(
                        items[0].contentDetails.relatedPlaylists.uploads,
                        items[0].snippet.thumbnails.default.url
                    );
                }
            },
            function(err) {
                console.error('Cannot get channels: ' + err);
            }
        );
}
exports.insertDataFromChannel = insertDataFromChannel;

function insertDataFromUploadedPlaylist(uploadPlaylistId, channelIconUrl) {
    gapi.client.youtube.playlistItems
        .list({
            part: 'contentDetails',
            playlistId: uploadPlaylistId,
            maxResults: 50,
        })
        .then(
            function(response) {
                const videoItems = response.result.items;
                if (videoItems.length == 0) {
                    console.error(
                        `No video found on playlist '${uploadPlaylistId}'.`
                    );
                } else {
                    videoItems.forEach((video) =>
                        insertDataFromVideoId(
                            video.contentDetails.videoId,
                            channelIconUrl
                        )
                    );
                }
            },
            function(err) {
                console.error('Cannot get playlists: ' + err);
            }
        );
}
exports.insertDataFromUploadedPlaylist = insertDataFromUploadedPlaylist;

function insertDataFromVideoId(videoId, channelIconUrl) {
    gapi.client.youtube.videos
        .list({
            part: 'contentDetails,player,snippet',
            id: videoId,
        })
        .then(
            function(response) {
                const videoItems = response.result.items;
                if (videoItems.length == 0) {
                    console.error(`No video found with ID '${videoId}'.`);
                } else {
                    const video = videoItems[0];
                    const videoData = {
                        videoId: videoId,
                        videoThumbnailSrc: video.snippet.thumbnails.default.url,
                        videoTitle: video.snippet.title,
                        channelTitle: video.snippet.channelTitle,
                        videoDuration: video.contentDetails.duration,
                        channelId: video.snippet.channelId,
                        publishDate: video.snippet.publishedAt,
                        visible: true,
                        channelImage: channelIconUrl,
                    };
                    $.post('/addVideoInDatabase', videoData)
                        .done(function(unused) {
                            console.log('ok');
                        })
                        .fail(function(unused) {
                            console.error('KO');
                        });
                }
            },
            function(err) {
                console.error('Cannot get videos from API: ' + err);
            }
        );
}
exports.insertDataFromVideoId = insertDataFromVideoId;

function displayIframeVideoPlayer(videoId) {
    const iframe = `<iframe width="480" height="270" src="//www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    $('#iframe').html(iframe);
    $('#popup').fadeIn('slow');
}
exports.displayIframeVideoPlayer = displayIframeVideoPlayer

function swapVisibility(videoId, canDisplayHiddenVideos) {
    $.post('/swapVisibility', { videoId: videoId })
        .done(function(unused) {
            if ($('#img_' + videoId).hasClass('hiddenImage')) {
                $('#img_' + videoId).removeClass('hiddenImage');
                $('#title_' + videoId).removeClass('hiddenText');
                $('#channel_' + videoId).removeClass('hiddenText');
                $('#swap_' + videoId).attr('src', 'images/hide.png');
                $('#swap_' + videoId).attr('title', 'Hide this video');
            } else {
                $('#img_' + videoId).addClass('hiddenImage');
                $('#title_' + videoId).addClass('hiddenText');
                $('#channel_' + videoId).addClass('hiddenText');
                $('#swap_' + videoId).attr('src', 'images/visible.png');
                $('#swap_' + videoId).attr(
                    'title',
                    'Set this video as visible'
                );
            }
            console.log('ok');
        })
        .fail(function(unused) {
            console.error('KO');
        });
    if (canDisplayHiddenVideos != 'true' && canDisplayHiddenVideos !== true) {
        $('#video_' + videoId).hide();
    }
}
exports.swapVisibility = swapVisibility

function displayIframeVideoPlayerThenMask(videoId, canDisplayHiddenVideos) {
    displayIframeVideoPlayer(videoId);
    swapVisibility(videoId, canDisplayHiddenVideos);
}
exports.displayIframeVideoPlayerThenMask = displayIframeVideoPlayerThenMask

/* Verified with Selenium! */
/* istanbul ignore next */
function openWebsite(videoId) {
    const win = window.open(
        `https://www.youtube.com/watch?v=${videoId}`,
        '_blank'
    );
    win.focus();
}

function displayHiddenVideos() {
    const parameters = getParametersFromUrl();
    parameters.hidden = 'true';
    reloadCurrentPageWithParameters(parameters);
}
exports.displayHiddenVideos = displayHiddenVideos;

function hideMaskedVideos() {
    const parameters = getParametersFromUrl();
    parameters.hidden = 'false';
    reloadCurrentPageWithParameters(parameters);
}
exports.hideMaskedVideos = hideMaskedVideos;

function reloadCurrentPageWithParameters(parameters) {
    var newUrl = window.location.protocol + '//' + window.location.host;
    if (parameters) {
        const params = [];
        Object.keys(parameters).forEach(function(key) {
            params.push(key + '=' + parameters[key]);
        });
        newUrl += '?' + params.join('&');
    }
    window.location.href = newUrl;
}
exports.reloadCurrentPageWithParameters = reloadCurrentPageWithParameters;

function displayVideosFromChannel(channelId) {
    const parameters = getParametersFromUrl();
    if ('#all' == channelId) {
        parameters.channel = 'all';
    } else {
        parameters.channel = channelId;
    }
    reloadCurrentPageWithParameters(parameters);
}
exports.displayVideosFromChannel = displayVideosFromChannel;

// https://stackoverflow.com/a/8486188
/*
 * "?arg1=foo&arg2=hello" gives { arg1: 'foo', arg2: 'hello' }
 */
function getParametersFromUrl() {
    const url = window.location.search;
    const query = url.substr(1);
    const result = {};
    query.split('&').forEach((part) => {
        if (part) {
            const item = part.split('=');
            result[item[0]] = decodeURIComponent(item[1]);
        }
    });
    return result;
}
exports.getParametersFromUrl = getParametersFromUrl;