import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

export const skipLimitChecker = function (req: Request, res: Response, next: NextFunction) {
    const regexp: RegExp = /[a-zA-Z]/
    const skip: string = req.params.skip || "0"
    const limit: string = req.params.limit || "0"
    if (regexp.test(skip) || regexp.test(limit)){
        return res.status(400).json({
                                        timestamp: Math.floor(new Date().getTime() / 1000),
                                        errorMessage: "wrong skip or limit",
                                        requestPath: req.path,
                                    })
    }
    res.locals.skip = skip
    res.locals.limit = limit
    next()
}


export const retrieveUserId = function (req: Request, res: Response, next: NextFunction) {
    try {
        const userId: Types.ObjectId = Types.ObjectId(req.params.userId);
        res.locals.userId = userId;
        next();
    } catch (err) {
        return res.status(404).json({
                                        timestamp: Math.floor(new Date().getTime() / 1000),
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

export const retrieveChatId = function (req: Request, res: Response, next: NextFunction) {
    try {
        const chatId: Types.ObjectId = Types.ObjectId(req.params.chatId);
        res.locals.chatId = chatId;
        next();
    } catch (err) {
        return res.status(404).json({
                                        timestamp: Math.floor(new Date().getTime() / 1000),
                                        errorMessage: err.message,
                                        requestPath: req.path,
                                    });
    }
};

export const retrieveMatchId = function (req: Request, res: Response, next: NextFunction) {
    try {
        res.locals.matchId = Types.ObjectId(req.params.matchId);

        next();
    } catch (err) {
        res.status(404).json({
                                 timestamp: Math.floor(new Date().getTime() / 1000),
                                 errorMessage: err.message,
                                 requestPath: req.path,
                             });
    }
};
