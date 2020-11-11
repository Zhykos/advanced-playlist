
const filterStatus = {
  NONE: 'NONE',
  BLACKLIST: 'BLACKLIST',
  WHITELIST: 'WHITELIST'
};

function setFilterStatus(video) {
  video["filter"] = filterStatus.NONE;
  const channelId = video.channelId;
  ycf.channels.forEach(channel => {
    if (channel.id == channelId) {
      const whitelist = channel.whitelist;
      const blacklist = channel.blacklist;
      if (whitelist) {
        whitelist.forEach(white => {
          filterVideo(white, video, filterStatus.WHITELIST);
        });
      }
      if (blacklist) {
        blacklist.forEach(black => {
          filterVideo(black, video, filterStatus.BLACKLIST);
        });
      }
      return;
    }
  });
}
exports.setFilterStatus = setFilterStatus;

function filterVideo(filter, video, expectedStatus) {
  try {
    const parts = filter.split('=~');
    if (parts.length > 1) {
      if ((!video[parts[0]].match(parts[1])) == (expectedStatus == filterStatus.WHITELIST)) {
        video["filter"] = expectedStatus;
      }
    } else {
      const parts = filter.split('>');
      if (parts.length > 1) {
        if (video[parts[0]] <= youtubeDurationIntoSeconds(parts[1]) == (expectedStatus == filterStatus.WHITELIST)) {
          video["filter"] = expectedStatus;
        }
      }
    }
  } catch (exception) {
    console.error(exception);
  }
}

// Thanks :) https://gist.github.com/denniszhao/8972cd4ae637cf10fe01
function youtubeDurationIntoSeconds(duration) {
  var a = duration.match(/\d+H|\d+M|\d+S/g);
  var result = 0;
  var d = { 'H': 3600, 'M': 60, 'S': 1 };

  for (var i = 0; i < a.length; i++) {
    const num = a[i].slice(0, a[i].length - 1);
    const type = a[i].slice(a[i].length - 1, a[i].length);
    result += parseInt(num) * d[type];
  }
  return result;
}
