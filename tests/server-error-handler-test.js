const server = require('../youtube-custom-feed/bin/server/javascripts/vcf-server');

const mockResponse = () => {
    const response = { "locals": {} };
    response.status = jest.fn().mockReturnValue(response);
    response.render = jest.fn().mockImplementation((page, values) => {
        response.page = page;
        return response;
    });
    return response;
};

const mockRequest = () => {
    const request = {};
    request.get = jest.fn().mockReturnValue(request);
    return request;
};

const mockRequest2 = () => {
    const request = {};
    request.get = jest.fn().mockImplementation(param => {
        if (param == 'env') {
            return 'development';
        }
        return null;
    });
    return request;
};

describe('Error 404', () => {

    test('Call method', () => {
        var status = -1;
        server.errorHandler({}, {}, function (error) {
            status = error.status;
        });
        expect(status).toBe(404);
    });

});

describe('More errors', () => {

    test('Call method', () => {
        const error = { "message": "foo", "status": 500 };
        const request = { "app": mockRequest() };
        const response = mockResponse();
        server.errorHandlerPlus(error, request, response, null);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.page).toBe("error");
        expect(response.locals.message).toBe("foo");
        expect(response.locals.error).toStrictEqual({});
    });

    test('Dev environment and error 400', () => {
        const error = { "message": "foo", "status": 400 };
        const request = { "app": mockRequest2() };
        const response = mockResponse();
        server.errorHandlerPlus(error, request, response, null);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.locals.error).toStrictEqual(error);
    });

    test('No error status', () => {
        const error = { "message": "foo" };
        const request = { "app": mockRequest() };
        const response = mockResponse();
        server.errorHandlerPlus(error, request, response, null);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.locals.error).toStrictEqual({});
    });

});
