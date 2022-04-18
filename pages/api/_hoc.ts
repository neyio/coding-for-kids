import { NextApiRequest, NextApiResponse } from "next";

enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTION = 'OPTION',
};

type RequestParams = Record<string, any>;

type APIContext<P = RequestParams> = {
    params: P;
    req: NextApiRequest;
    res: NextApiResponse;
};

type APIFunc<P = RequestParams, T = void> = (context: APIContext<P>) => T | Promise<T>;

type APIResponse<T = void> = {
    code: string;
    data: T | undefined;
    message: string | undefined;
};

type APIDef<P = RequestParams, T = void> = {
    post?: APIFunc<P, T>;
    put?: APIFunc<P, T>;
    get?: APIFunc<P, T>;
    del?: APIFunc<P, T>;
};

export function withApi<P = RequestParams, T = void>(func: APIFunc<P, T> | APIDef<P, T>) {
    return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
        const body: APIResponse<T> = {
            code: '000',
            data: undefined,
            message: undefined,
        };

        const context: APIContext<P> = {
            params: {} as P,
            req,
            res,
        };

        if (req.method === RequestMethod.POST || req.method === RequestMethod.PUT) {
            context.params = req.body || {};
        } else {
            context.params = (req.query as any) || {};
        }

        try {

            if (typeof func === 'function') {
                body.data = await func(context);
            } else {
                const { post, put, get, del } = func;
                if (req.method === RequestMethod.POST && post) {
                    body.data = await post(context);
                } else if (req.method === RequestMethod.GET && get) {
                    body.data = await get(context);
                } else if (req.method === RequestMethod.PUT && put) {
                    body.data = await put(context);
                } else if (req.method === RequestMethod.DELETE && del) {
                    body.data = await del(context);
                } else {
                    res.status(404).send('Page Note Found');
                    return;
                }
            }
        } catch (err) {
            const e = err as any;
            body.message = e.message || e.toString();
        }
        res.status(200).json(body);
    };
}
