export default class Icon {
    private path;
    private hostUrl;
    constructor(path: string, hostUrl: string);
    get uri(): string;
}
