// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { withApi } from "../_hoc";
import axios from 'axios';
import qs from 'query-string';

type ReqData = {
    code: string;
}

type ResData = {
    sid: string;
}

const exec = async (code: string) => {
    
}

export default withApi<ReqData, ResData>({
    post: async ({ params: { code } }) => {

        const data = qs.stringify({
            lang: 'python3',
            code: code,
            input: '',
            save: false,
        });

        const res: ResData = { sid: '' };

        const result = await axios({
            method: 'POST',
            url: 'https://ide.geeksforgeeks.org/main.php',
            responseType: 'json',
            data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        });
        if (result.status === 200) {
            const { status, sid, message } = result.data;
            if (status == 'SUCCESS' && sid) {
                res.sid = sid;
            } else {
                throw new Error(message);
            }
        } else {
            throw new Error(result.statusText);
        }
        return res;
    }
});
