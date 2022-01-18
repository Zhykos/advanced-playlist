const helpers = require('../src/bin/server/javascripts/vcf-server-helpers');

const originalConsoleError = console.error;
afterEach(() => (console.error = originalConsoleError));
let consoleErrorOutput = [];
const mockedConsoleError = (output) => consoleErrorOutput.push(output);

describe('Filter video tests', () => {
    beforeEach(() => {
        console.error = mockedConsoleError;
        consoleErrorOutput = [];
    });

    test('=~ whitelist', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~foo', video, helpers.filterStatus.WHITELIST);
        expect(video.filter).toBe(helpers.filterStatus.WHITELIST);
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('=~ blacklist', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~foo', video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBe(helpers.filterStatus.BLACKLIST);
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Not =~ whitelist', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~not', video, helpers.filterStatus.WHITELIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Not =~ blacklist', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~not', video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('> whitelist', () => {
        const video = { a: 4500 };
        helpers.filterVideo('a>1H11M', video, helpers.filterStatus.WHITELIST);
        expect(video.filter).toBe(helpers.filterStatus.WHITELIST);
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('> blacklist', () => {
        const video = { a: 4500 };
        helpers.filterVideo('a>1H11M', video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBe(helpers.filterStatus.BLACKLIST);
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Not > whitelist', () => {
        const video = { a: 3600 };
        helpers.filterVideo('a>1H11M', video, helpers.filterStatus.WHITELIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Not > blacklist', () => {
        const video = { a: 3600 };
        helpers.filterVideo('a>1H11M', video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Empty video =~', () => {
        const video = {};
        helpers.filterVideo('a=~foo', video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Empty video >', () => {
        const video = {};
        helpers.filterVideo('a>11M', video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Wrong filter', () => {
        const video = {};
        helpers.filterVideo('', video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Wrong regex', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~*', video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).not.toMatchObject([]);
    });

    test('Wrong expectation', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~foo', video, 'foo');
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('No param', () => {
        const video = { a: 'foo' };
        helpers.filterVideo();
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('No expectation param', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~foo', video);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Just filter param', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~foo');
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Wrong filter type', () => {
        const video = { a: 'foo' };
        helpers.filterVideo(12, video, helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).not.toMatchObject([]);
    });

    test('Wrong video format', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a=~foo', 'video', helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });

    test('Wrong regex operator', () => {
        const video = { a: 'foo' };
        helpers.filterVideo('a#o', 'video', helpers.filterStatus.BLACKLIST);
        expect(video.filter).toBeUndefined();
        expect(consoleErrorOutput).toMatchObject([]);
    });
});
