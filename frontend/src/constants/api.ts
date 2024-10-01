// Interface for interacting with the backend

const URL = "";

class APIService {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }
};

const instance = new APIService(URL);

export default instance;
