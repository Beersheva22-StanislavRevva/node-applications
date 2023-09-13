import DocTextService from "../service/DocTextService.js";
import fs from 'node:fs/promises'
export default class RouterDocText {
    #docTextService
    constructor(emitter) {
        this.#docTextService = new DocTextService();
       emitter.on('/doc', (file, response) => this.documentation(file, response));
       emitter.on('/text', (file, response) => this.text(file, response));
    }
    async documentation(file, response) {
        console.log(`documentation route, file: ${file}`);
        const handler = await fs.open(file);
        await (await this.#docTextService.getDocumentation(handler)).pipe(response);
        response.on('finished', () => response.end());
    }
    async text(file,response) {
        console.log(`text route, file: ${file}`);
        const handler = await fs.open(file);
        console.log(`response headers: ${response.getHeaderNames()}`);
        const stream = await this.#docTextService.getText(handler);
        stream.pipe(response);
        response.on('finished', () => response.end());
    }
}