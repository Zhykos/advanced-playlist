// jest.mock('jquery');
const $ = require('jquery');
const { displayIframeVideoPlayer } = require('../src/bin/client/javascripts/vcf-client-helpers.js');

test('displayIframeVideoPlayer', () => {
    document.body.innerHTML =
        '<div id="iframe"></div>' +
        '<div id="popup" style="display:none"></div>';

    displayIframeVideoPlayer(22);

    expect($("#iframe").html()).toBe('<iframe width="480" height="270" src="//www.youtube.com/embed/22" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>');
});