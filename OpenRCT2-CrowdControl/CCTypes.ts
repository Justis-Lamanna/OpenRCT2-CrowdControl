enum CCStatus {
    SUCCESS = 0,
    FAILED,
    NOT_AVAILABLE,
    RETRY
}

enum CCRequestType {
    START = 1,
    STOP
}

interface CCEffect {
    id: number;
    code: string;
    viewer: string;
    type: number;
    parameters?: any[];
    cost?: number;
}

interface CCResponse {
    id: number;
    status: CCStatus;
    msg?: string;
}