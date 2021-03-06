type TypecheckResult = {
    ok: boolean;
    errors: TypeError[]
};

type TypecheckMethod = (...args: any[]) => boolean;

export default function (obj: Record<string, any>, map?: Record<string, TypecheckMethod>): TypecheckResult;