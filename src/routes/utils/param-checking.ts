import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { toUnixSeconds } from './date-utils';

/**
 * Middleware that tries to extract the skip and limit query parameters from
 * the request url and checks their validity.
 * If they are not set, their default value is -1.
 * If they are set with a non-numerical value, an error response is returned.
 * The parsed params can be found in the "locals" field of the response.
 *
 * @param req
 * @param res
 * @param next
 */
export const skipLimitChecker = function (req: Request, res: Response, next: NextFunction) {
    const regexp: RegExp = /[a-zA-Z]/;
    const skip: string = (req.query.skip as string) || '-1';
    const limit: string = (req.query.limit as string) || '-1';

    if (regexp.test(skip) || regexp.test(limit)) {
        return res.status(400).json({
            timestamp: toUnixSeconds(new Date()),
            errorMessage: 'Wrong skip or limit',
            requestPath: req.path,
        });
    }

    res.locals.skip = parseInt(skip, 10);
    res.locals.limit = parseInt(limit, 10);

    next();
};

/**
 * Middleware that tries to extract the userId request parameter from
 * the request url.
 * If the parameter is invalid, an error response is returned.
 * The parsed param can be found in the "locals" field of the response.
 *
 * @param req
 * @param res
 * @param next
 */
export const retrieveUserId = function (req: Request, res: Response, next: NextFunction) {
    try {
        res.locals.userId = Types.ObjectId(req.params.userId);

        next();
    } catch (err) {
        return res.status(404).json({
            timestamp: toUnixSeconds(new Date()),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
};

/**
 * Middleware that tries to extract the chatId request parameter from
 * the request url.
 * If the parameter is invalid, an error response is returned.
 * The parsed param can be found in the "locals" field of the response.
 *
 * @param req
 * @param res
 * @param next
 */
export const retrieveChatId = function (req: Request, res: Response, next: NextFunction) {
    try {
        res.locals.chatId = Types.ObjectId(req.params.chatId);
        next();
    } catch (err) {
        return res.status(404).json({
            timestamp: toUnixSeconds(new Date()),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
};

/**
 * Middleware that tries to extract the matchId request parameter from
 * the request url.
 * If the parameter is invalid, an error response is returned.
 * The parsed param can be found in the "locals" field of the response.
 *
 * @param req
 * @param res
 * @param next
 */
export const retrieveMatchId = function (req: Request, res: Response, next: NextFunction) {
    try {
        res.locals.matchId = Types.ObjectId(req.params.matchId);

        next();
    } catch (err) {
        res.status(404).json({
            timestamp: toUnixSeconds(new Date()),
            errorMessage: err.message,
            requestPath: req.path,
        });
    }
};

export const retrieveId = function (s_id: string) {
    try {
        return Types.ObjectId(s_id);
    } catch (err) {
        throw new Error('No user with that identifier');
    }
};
