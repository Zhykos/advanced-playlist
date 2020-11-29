const helpers = require('../youtube-custom-feed/vcf-server-helpers');

const originalConsoleError = console.error;
afterEach(() => (console.error = originalConsoleError));
let consoleErrorOutput = [];
const mockedConsoleError = output => consoleErrorOutput.push(output);
beforeEach(() => {
    console.error = mockedConsoleError;
    consoleErrorOutput = [];
});

test('filterVideo =~ whitelist', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~foo", video, helpers.filterStatus.WHITELIST);
    expect(video.filter).toBe(helpers.filterStatus.WHITELIST);
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo =~ blacklist', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~foo", video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBe(helpers.filterStatus.BLACKLIST);
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo not =~ whitelist', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~not", video, helpers.filterStatus.WHITELIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo not =~ blacklist', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~not", video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo > whitelist', () => {
    const video = { "a": "1H" };
    helpers.filterVideo("a>1H11M", video, helpers.filterStatus.WHITELIST);
    expect(video.filter).toBe(helpers.filterStatus.WHITELIST);
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo > blacklist', () => {
    const video = { "a": "1H" };
    helpers.filterVideo("a>1H11M", video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBe(helpers.filterStatus.BLACKLIST);
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo not > whitelist', () => {
    const video = { "a": "1H" };
    helpers.filterVideo("a>11M", video, helpers.filterStatus.WHITELIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo not > blacklist', () => {
    const video = { "a": "1H" };
    helpers.filterVideo("a>11M", video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo empty video =~', () => {
    const video = {};
    helpers.filterVideo("a=~foo", video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo empty video >', () => {
    const video = {};
    helpers.filterVideo("a>11M", video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo wrong filter', () => {
    const video = {};
    helpers.filterVideo("", video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo wrong regex', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~*", video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).not.toMatchObject([]);
});

test('filterVideo wrong expectation', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~foo", video, "foo");
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo no param', () => {
    const video = { "a": "foo" };
    helpers.filterVideo();
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo no expectation param', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~foo", video);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo just filter param', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~foo");
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('filterVideo wrong filter type', () => {
    const video = { "a": "foo" };
    helpers.filterVideo(12, video, helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).not.toMatchObject([]);
});

test('filterVideo wrong video format', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a=~foo", "video", helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});

test('Wrong regex operator', () => {
    const video = { "a": "foo" };
    helpers.filterVideo("a#o", "video", helpers.filterStatus.BLACKLIST);
    expect(video.filter).toBeUndefined();
    expect(consoleErrorOutput).toMatchObject([]);
});