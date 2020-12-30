
const vcf_channels = require('../etc/channels.json');

const filterStatus = {
  NONE: 'NONE',
  BLACKLIST: 'BLACKLIST',
  WHITELIST: 'WHITELIST'
};
exports.filterStatus = filterStatus;

function setFilterStatus(video) {
  if (video && video.channelId) {
    video["filter"] = filterStatus.NONE;
    const channelId = video.channelId;
    vcf_channels.channels.forEach(channel => {
      if (channel.id == channelId) {
        const whitelist = channel.whitelist;
        if (whitelist) {
          whitelist.forEach(white => {
            filterVideo(white, video, filterStatus.WHITELIST);
          });
        }
        const blacklist = channel.blacklist;
        if (blacklist) {
          blacklist.forEach(black => {
            filterVideo(black, video, filterStatus.BLACKLIST);
          });
        }
        return;
      }
    });
  }
}
exports.setFilterStatus = setFilterStatus;

function filterVideo(filter, video, expectedStatus) {
  if (filter && video && (expectedStatus == filterStatus.WHITELIST || expectedStatus == filterStatus.BLACKLIST)) {
    try {
      const parts = filter.split('=~');
      if (parts.length > 1) {
        if (video[parts[0]] && video[parts[0]].match(parts[1])) {
          video["filter"] = expectedStatus;
        }
      } else {
        const parts = filter.split('>');
        if (parts.length > 1) {
          if (video[parts[0]] && video[parts[0]] > youtubeDurationIntoSeconds(parts[1])) {
            video["filter"] = expectedStatus;
          }
        }
      }
    } catch (exception) {
      console.error(exception);
    }
  }
}
exports.filterVideo = filterVideo;

// Thanks :) https://gist.github.com/denniszhao/8972cd4ae637cf10fe01
function youtubeDurationIntoSeconds(duration) {
  var result = -1;
  if (typeof duration === 'string') {
    const matches = duration.match(/\d+H|\d+M|\d+S/g);
    if (matches) {
      result = 0;
      const types = { 'H': 3600, 'M': 60, 'S': 1 };
      for (var i = 0; i < matches.length; i++) {
        const num = matches[i].slice(0, matches[i].length - 1);
        const type = matches[i].slice(matches[i].length - 1, matches[i].length);
        result += parseInt(num) * types[type];
      }
    }
  }
  return result;
}
exports.youtubeDurationIntoSeconds = youtubeDurationIntoSeconds;
