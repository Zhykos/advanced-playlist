/**
 * @jest-environment jsdom
 */

const $ = require('jquery');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const {
    displayIframeVideoPlayer,
    getParametersFromUrl,
    reloadCurrentPageWithParameters,
    displayVideosFromChannel,
    hideMaskedVideos,
    displayHiddenVideos,
    swapVisibility,
    authenticate,
    loadClient,
    insertDataFromVideoId,
    displayIframeVideoPlayerThenMask,
    insertDataFromUploadedPlaylist,
    insertDataFromChannel,
    execute,
} = require('../src/bin/client/javascripts/vcf-client-helpers.js');

// thanks! https://github.com/facebook/jest/issues/5124
const safelyStubAndThenCleanup = (target, method, value) => {
    const original = target[method];
    beforeEach(() => {
        Object.defineProperty(target, method, {
            configurable: true,
            value,
            writable: true,
        });
    });
    afterEach(() => {
        Object.defineProperty(target, method, {
            configurable: true,
            value: original,
            writable: true,
        });
    });
};

const originalConsoleError = console.error;
let consoleErrorOutput = [];
const mockedConsoleError = (output) => consoleErrorOutput.push(output);

const originalConsoleLog = console.log;
let consoleLogOutput = [];
const mockedConsoleLog = (output) => consoleLogOutput.push(output);

const CUSTOMTHEN = {
    then(funcOk, funcErr) {
        /* Do nothing */
    },
};

const SIGNIN = {
    signIn(unused) {
        return CUSTOMTHEN;
    },
};

global.gapi = {
    client: {
        youtube: {
            videos: {
                list(unused) {
                    return CUSTOMTHEN;
                },
            },
            playlistItems: {
                list(unused) {
                    return CUSTOMTHEN;
                },
            },
            channels: {
                list(unused) {
                    return CUSTOMTHEN;
                },
            },
        },
        setApiKey(unused) {
            // Do nothing
        },
        load(unused) {
            return CUSTOMTHEN;
        },
    },
    auth2: {
        getAuthInstance() {
            return SIGNIN;
        },
    },
};

global.vcf = { clientApiKey: '' };

beforeEach(() => {
    console.log = mockedConsoleLog;
    console.error = mockedConsoleError;
    consoleLogOutput = [];
    consoleErrorOutput = [];
    jest.clearAllMocks();
    jest.resetAllMocks();
});

afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    jest.clearAllMocks();
    jest.resetAllMocks();
});

afterAll(() => {
    delete global.gapi;
    delete global.vcf;
});

test('displayIframeVideoPlayer', () => {
    document.body.innerHTML =
        '<div id="iframe"></div>' +
        '<div id="popup" style="display:none"></div>';

    displayIframeVideoPlayer(22);

    expect($('#iframe').html()).toBe(
        '<iframe width="480" height="270" src="//www.youtube.com/embed/22" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>'
    );
    expect($('#popup').css('display')).not.toBe('none');
});

describe('Window location modifications ; getParametersFromUrl', () => {
    safelyStubAndThenCleanup(window, 'location', {
        search: '?arg1=foo&arg2=hello',
    });

    test('getParametersFromUrl', () => {
        const result = getParametersFromUrl();
        expect(result).toMatchObject({ arg1: 'foo', arg2: 'hello' });
    });
});

describe('Window location modifications ; getParametersFromUrl ; empty search', () => {
    safelyStubAndThenCleanup(window, 'location', { search: '' });

    test('getParametersFromUrl; empty search', () => {
        const result = getParametersFromUrl();
        expect(result).toMatchObject({});
    });
});

describe('Window location modifications ; reloadCurrentPageWithParameters', () => {
    safelyStubAndThenCleanup(window, 'location', {
        href: 'https://www.zhykos.fr?nope',
    });
    safelyStubAndThenCleanup(window, 'location', { protocol: 'https:' }); // XXX Does not work :o
    safelyStubAndThenCleanup(window, 'location', { host: 'www.zhykos.fr' });

    test('reloadCurrentPageWithParameters', () => {
        const params = { arg1: 'foo', arg2: 'hello' };
        reloadCurrentPageWithParameters(params);
        expect(window.location.href).toBe(
            'undefined//www.zhykos.fr?arg1=foo&arg2=hello'
        );
    });
});

describe('Window location modifications ; reloadCurrentPageWithParameters ; no param', () => {
    safelyStubAndThenCleanup(window, 'location', {
        href: 'https://www.zhykos.fr?nope',
    });
    safelyStubAndThenCleanup(window, 'location', { protocol: 'https:' }); // XXX Does not work :o
    safelyStubAndThenCleanup(window, 'location', { host: 'www.zhykos.fr' });

    test('reloadCurrentPageWithParameters', () => {
        reloadCurrentPageWithParameters();
        expect(window.location.href).toBe('undefined//www.zhykos.fr');
    });
});

describe('Window location modifications ; displayVideosFromChannel / displayHiddenVideos / hideMaskedVideos', () => {
    safelyStubAndThenCleanup(window, 'location', { host: 'www.zhykos.fr' }); // XXX Does not work :o
    safelyStubAndThenCleanup(window, 'location', { protocol: 'https:' }); // XXX Does not work :o
    safelyStubAndThenCleanup(window, 'location', {
        href: 'https://www.zhykos.fr',
    });
    safelyStubAndThenCleanup(window, 'location', { search: '' });

    test('displayVideosFromChannel ; all', () => {
        displayVideosFromChannel('#all');
        expect(window.location.href).toBe('undefined//undefined?channel=all');
    });

    test('displayVideosFromChannel ; channel', () => {
        displayVideosFromChannel('foo');
        expect(window.location.href).toBe('undefined//undefined?channel=foo');
    });

    test('displayHiddenVideos', () => {
        displayHiddenVideos();
        expect(window.location.href).toBe('undefined//undefined?hidden=true');
    });

    test('hideMaskedVideos', () => {
        hideMaskedVideos();
        expect(window.location.href).toBe('undefined//undefined?hidden=false');
    });
});

describe('Mock server ; swapVisibility', () => {
    const server = setupServer(
        rest.post('http://localhost/swapVisibility', (unused, res, ctx) => {
            return res(ctx.json({}));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('swapVisibility ; show image', async () => {
        document.body.innerHTML =
            '<div id="img_22" class="hiddenImage"></div>' +
            '<div id="title_22" class="hiddenText"></div>' +
            '<div id="channel_22" class="hiddenText"></div>' +
            '<img id="swap_22" src="" title=""></div>' +
            '<div id="video_22"></div>';

        swapVisibility(22, false);
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject(['ok']);
        expect(consoleErrorOutput).toMatchObject([]);
        expect($('#img_22').attr('class')).toBe('');
        expect($('#title_22').attr('class')).toBe('');
        expect($('#channel_22').attr('class')).toBe('');
        expect($('#swap_22').attr('src')).toBe('images/hide.png');
        expect($('#swap_22').attr('title')).toBe('Hide this video');
        expect($('#video_22').css('display')).toBe('none');
    });

    test('swapVisibility ; hide image', async () => {
        document.body.innerHTML =
            '<div id="img_22"></div>' +
            '<div id="title_22"></div>' +
            '<div id="channel_22"></div>' +
            '<img id="swap_22" src="" title=""></div>' +
            '<div id="video_22"></div>';

        swapVisibility(22, true);
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject(['ok']);
        expect(consoleErrorOutput).toMatchObject([]);
        expect($('#img_22').attr('class')).toBe('hiddenImage');
        expect($('#title_22').attr('class')).toBe('hiddenText');
        expect($('#channel_22').attr('class')).toBe('hiddenText');
        expect($('#swap_22').attr('src')).toBe('images/visible.png');
        expect($('#swap_22').attr('title')).toBe('Set this video as visible');
        expect($('#video_22').css('display')).not.toBe('none');
    });
});

describe('Mock server ; swapVisibility ; server error', () => {
    const server = setupServer(
        rest.post('http://localhost/swapVisibility', (unused, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('swapVisibility', async () => {
        swapVisibility(22, false);
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject([]);
        expect(consoleErrorOutput).toMatchObject(['KO']);
    });
});

test('authenticate ; ok', async () => {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((func, unused) => {
        func();
    });

    authenticate();
    expect(consoleLogOutput).toMatchObject(['Sign-in successful']);
    expect(consoleErrorOutput).toMatchObject([]);
});

test('authenticate ; ko', async () => {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((unused, func) => {
        func('ERROR A!');
    });

    authenticate();
    expect(consoleLogOutput).toMatchObject([]);
    expect(consoleErrorOutput).toMatchObject(['Error signing in: ERROR A!']);
});

test('loadClient ; ok', async () => {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((func, unused) => {
        func();
    });

    document.body.innerHTML =
        '<div id="fetch"></div>' +
        '<div id="connection" style="display:none"></div>';

    const callback = () => {
        console.log('foo');
    };
    loadClient(callback);
    expect(consoleLogOutput).toMatchObject(['Google API client loaded', 'foo']);
    expect(consoleErrorOutput).toMatchObject([]);
    expect($('#fetch').css('display')).not.toBe('none');
    expect($('#connection').css('display')).toBe('none');
});

test('loadClient ; ok ; no callback', async () => {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((func, unused) => {
        func();
    });

    document.body.innerHTML =
        '<div id="fetch"></div>' +
        '<div id="connection" style="display:none"></div>';

    loadClient();
    expect(consoleLogOutput).toMatchObject(['Google API client loaded']);
    expect(consoleErrorOutput).toMatchObject([]);
    expect($('#fetch').css('display')).not.toBe('none');
    expect($('#connection').css('display')).toBe('none');
});

test('loadClient ; ko', async () => {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((unused, func) => {
        func('ERROR B!');
    });

    document.body.innerHTML =
        '<div id="fetch"></div>' +
        '<div id="connection" style="display:none"></div>';

    const callback = () => {
        console.log('foo');
    };
    loadClient(callback);
    expect(consoleLogOutput).toMatchObject([]);
    expect(consoleErrorOutput).toMatchObject([
        'Error loading Google API client: ERROR B!',
    ]);
    expect($('#fetch').css('display')).toBe('block');
    expect($('#connection').css('display')).toBe('none');
});

describe('Mock server ; insertDataFromVideoId ; server ok', () => {
    const server = setupServer(
        rest.post('http://localhost/addVideoInDatabase', (unused, res, ctx) => {
            return res(ctx.json({}));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('insertDataFromVideoId', async () => {
        mockThenApiFunctionWithResults();

        insertDataFromVideoId(22, 'url-image');
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject(['ok']);
        expect(consoleErrorOutput).toMatchObject([]);
    });
});

describe('Mock server ; insertDataFromVideoId ; server ko', () => {
    const server = setupServer(
        rest.post('http://localhost/addVideoInDatabase', (unused, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('insertDataFromVideoId', async () => {
        mockThenApiFunctionWithResults();

        insertDataFromVideoId(22, 'url-image');
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject([]);
        expect(consoleErrorOutput).toMatchObject(['KO']);
    });
});

describe('Mock server ; insertDataFromVideoId ; no result', () => {
    const server = setupServer(
        rest.post('http://localhost/addVideoInDatabase', (unused, res, ctx) => {
            return res(ctx.json({}));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('insertDataFromVideoId', async () => {
        mockThenApiFunctionWithEmptyResults();

        insertDataFromVideoId(22, 'url-image');
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject([]);
        expect(consoleErrorOutput).toMatchObject([
            "No video found with ID '22'.",
        ]);
    });
});

test('insertDataFromVideoId ; API error', async () => {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((unused, funcErr) => {
        funcErr('ERROR C!');
    });

    insertDataFromVideoId(22, 'url-image');
    await new Promise((r) => setTimeout(r, 2000));

    expect(consoleLogOutput).toMatchObject([]);
    expect(consoleErrorOutput).toMatchObject([
        'Cannot get videos from API: ERROR C!',
    ]);
});

describe('displayIframeVideoPlayerThenMask', () => {
    const server = setupServer(
        rest.post('http://localhost/swapVisibility', (unused, res, ctx) => {
            return res(ctx.json({}));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('displayIframeVideoPlayerThenMask', async () => {
        document.body.innerHTML =
            '<div id="iframe"></div>' +
            '<div id="popup" style="display:none"></div>' +
            '<div id="img_22"></div>' +
            '<div id="title_22"></div>' +
            '<div id="channel_22"></div>' +
            '<img id="swap_22" src="" title=""></div>' +
            '<div id="video_22"></div>';

        displayIframeVideoPlayerThenMask(22, true);
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject(['ok']);
        expect(consoleErrorOutput).toMatchObject([]);
        expect($('#iframe').html()).toBe(
            '<iframe width="480" height="270" src="//www.youtube.com/embed/22" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>'
        );
        expect($('#popup').css('display')).not.toBe('none');
        expect($('#img_22').attr('class')).toBe('hiddenImage');
        expect($('#title_22').attr('class')).toBe('hiddenText');
        expect($('#channel_22').attr('class')).toBe('hiddenText');
        expect($('#swap_22').attr('src')).toBe('images/visible.png');
        expect($('#swap_22').attr('title')).toBe('Set this video as visible');
        expect($('#video_22').css('display')).not.toBe('none');
    });
});

test('insertDataFromUploadedPlaylist ; error API', () => {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((unused, funcErr) => {
        funcErr('ERROR D!');
    });
    insertDataFromUploadedPlaylist(42, 'url');

    expect(consoleLogOutput).toMatchObject([]);
    expect(consoleErrorOutput).toMatchObject([
        'Cannot get playlists: ERROR D!',
    ]);
});

test('insertDataFromUploadedPlaylist ; no result', () => {
    mockThenApiFunctionWithEmptyResults();
    insertDataFromUploadedPlaylist(42, 'url');

    expect(consoleLogOutput).toMatchObject([]);
    expect(consoleErrorOutput).toMatchObject([
        "No video found on playlist '42'.",
    ]);
});

describe('Mock server ; insertDataFromUploadedPlaylist', () => {
    const server = setupServer(
        rest.post('http://localhost/addVideoInDatabase', (unused, res, ctx) => {
            return res(ctx.json({}));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('insertDataFromUploadedPlaylist ; ok', async () => {
        mockThenApiFunctionWithResults();
        insertDataFromUploadedPlaylist(42, 'url');
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject(['ok']);
        expect(consoleErrorOutput).toMatchObject([]);
    });
});

test('insertDataFromChannel ; error API', () => {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((unused, funcErr) => {
        funcErr('ERROR E!');
    });
    insertDataFromChannel(12);

    expect(consoleLogOutput).toMatchObject([]);
    expect(consoleErrorOutput).toMatchObject(['Cannot get channels: ERROR E!']);
});

test('insertDataFromChannel ; no result', () => {
    mockThenApiFunctionWithEmptyResults();
    insertDataFromChannel(12);

    expect(consoleLogOutput).toMatchObject([]);
    expect(consoleErrorOutput).toMatchObject([
        "No channel found with id: '12'.",
    ]);
});

describe('Mock server ; insertDataFromChannel', () => {
    const server = setupServer(
        rest.post('http://localhost/addVideoInDatabase', (unused, res, ctx) => {
            return res(ctx.json({}));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('insertDataFromChannel ; ok', async () => {
        mockThenApiFunctionWithResults();
        insertDataFromChannel(12);
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleLogOutput).toMatchObject(['ok']);
        expect(consoleErrorOutput).toMatchObject([]);
    });
});

test('execute ; no result', () => {
    global.vcf.channels = [];
    execute();
    expect(consoleLogOutput).toMatchObject([]);
    expect(consoleErrorOutput).toMatchObject([
        "No custom channel, check file 'src/parameters.js'.",
    ]);
});

describe('execute ; ok', () => {
    const server = setupServer(
        rest.post('http://localhost/addVideoInDatabase', (unused, res, ctx) => {
            return res(ctx.json({}));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('execute', async () => {
        global.vcf.channels = [2];
        mockThenApiFunctionWithResults();
        execute();
        await new Promise((r) => setTimeout(r, 2000));
        expect(consoleLogOutput).toMatchObject(['ok']);
        expect(consoleErrorOutput).toMatchObject([]);
    });
});

function mockThenApiFunctionWithResults() {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((funcOk, unused) => {
        funcOk({
            result: {
                items: [
                    {
                        snippet: {
                            thumbnails: {
                                default: {
                                    url: 'url',
                                },
                            },
                            title: 'title',
                            channelTitle: 'channel',
                            channelId: 'channel id',
                            publishedAt: 'date',
                        },
                        contentDetails: {
                            relatedPlaylists: {
                                uploads: 'uploads',
                            },
                        },
                    },
                ],
            },
        });
    });
}

function mockThenApiFunctionWithEmptyResults() {
    jest.spyOn(CUSTOMTHEN, 'then').mockImplementation((funcOk, unused) => {
        funcOk({
            result: {
                items: [],
            },
        });
    });
}
