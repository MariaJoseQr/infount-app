

export class CustomResponse<T> {
    result?: T | null;
    resultType?: ResultType;
    message?: string;
    status?: number;

    constructor(result?: T | null, resultType?: ResultType, message?: string, status?: number) {
        this.result = result;
        this.resultType = resultType;
        this.message = message;
        this.status = status;
    }
}

export enum ResultType {
    OK, WARNING, ERROR
}