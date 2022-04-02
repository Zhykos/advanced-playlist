/**
 * @jest-environment jsdom
 */

const { rest } = require('msw');
const { setupServer } = require('msw/node');
const $ = require('jquery');
const { init } = require('../src/bin/client/javascripts/vcf-client.js');
const h = require('../src/bin/client/javascripts/vcf-client-helpers.js');

const originalConsoleError = console.error;
let consoleErrorOutput = [];
const mockedConsoleError = (output) => consoleErrorOutput.push(output);

const THEN = {
    then(func) {
        func();
    },
};

const GoogleAuth = {
    isSignedIn: {
        get() {
            /* TO MOCK */
        },
    },
};

global.vcf = { clientApiKey: '' };

global.gapi = {
    load(unused, func) {
        func();
    },
    client: {
        setApiKey(unused) {
            // Do nothing
        },
        load(unused) {
            return THEN;
        },
    },
    auth2: {
        init() {
            return THEN;
        },
        getAuthInstance() {
            return GoogleAuth;
        },
    },
};

beforeEach(() => {
    console.error = mockedConsoleError;
    consoleErrorOutput = [];
    initDom();
    jest.clearAllMocks();
    jest.resetAllMocks();
});

afterEach(() => {
    console.error = originalConsoleError;
    jest.clearAllMocks();
    jest.resetAllMocks();
});

afterAll(() => {
    delete global.gapi;
    delete global.vcf;
});

describe('client ; no auth', () => {
    const server = setupServer(
        rest.post('http://localhost/getParameters', (unused, res, ctx) => {
            return res(
                ctx.json({
                    clientApiKey: '<XXX>',
                    clientId: '<YYY>.apps.googleusercontent.com',
                })
            );
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('client', async () => {
        init();
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleErrorOutput).toMatchObject([]);
        expect($('#loading').css('display')).toBe('none');
        expect($('#contents').css('display')).toBe('block');
        expect($('#settings-error').css('display')).toBe('block');
        expect($('#connection').css('display')).toBe('none');
    });
});

describe('client ; error', () => {
    const server = setupServer(
        rest.post('http://localhost/getParameters', (unused, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('client', async () => {
        init();
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleErrorOutput).toMatchObject([
            'Error getting API parameters: [object Object]',
        ]);
        expect($('#loading').css('display')).toBe('block');
        expect($('#contents').css('display')).toBe('none');
        expect($('#settings-error').css('display')).toBe('none');
        expect($('#connection').css('display')).toBe('block');
    });
});

describe('client ; ok', () => {
    const server = initMockServerWithFooSettings();

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    // XXX Do not know how to call "loadClient" method in Helper :o
    test.skip('client', async () => {
        jest.spyOn(GoogleAuth.isSignedIn, 'get').mockImplementation(() => {
            return true;
        });

        init();
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleErrorOutput).toMatchObject([]);
        expect($('#loading').css('display')).toBe('none');
        expect($('#contents').css('display')).toBe('block');
        expect($('#settings-error').css('display')).toBe('none');
        expect($('#connection').css('display')).toBe('none');
    });
});

describe('client ; ok ; not connected', () => {
    const server = initMockServerWithFooSettings();

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('client', async () => {
        jest.spyOn(GoogleAuth.isSignedIn, 'get').mockImplementation(() => {
            return false;
        });

        init();
        await new Promise((r) => setTimeout(r, 2000));

        expect(consoleErrorOutput).toMatchObject([]);
        expect($('#loading').css('display')).toBe('none');
        expect($('#contents').css('display')).toBe('block');
        expect($('#settings-error').css('display')).toBe('none');
        expect($('#connection').css('display')).toBe('block');
        expect($('#fetch').css('display')).toBe('none');
    });
});

function initDom() {
    document.body.innerHTML =
        '<div id="loading"></div>' +
        '<div id="contents" style="display:none"></div>' +
        '<div id="settings-error" style="display:none"></div>' +
        '<div id="connection"></div>' +
        '<div id="fetch"></div>';
}

function initMockServerWithFooSettings() {
    return setupServer(
        rest.post('http://localhost/getParameters', (unused, res, ctx) => {
            return res(
                ctx.json({
                    clientApiKey: 'foo',
                    clientId: 'foo',
                })
            );
        })
    );
}
