import DocTextService from "../service/DocTextService.js";
import fs from 'node:fs/promises'
import { DocTextView } from "../view/DocTextView.js";
const docTextView = new DocTextView();
function pipeResponse(stream, response) {
    stream.map(line => docTextView.renderLine(line)).pipe(response)
}
export default class RouterDocText {
    #docTextService
    constructor(emitter) {
        this.#docTextService = new DocTextService();
        emitter.on('/doc', (searchParams, response) => this.documentation(searchParams, response));
        emitter.on('/text', (searchParams, response) => this.text(searchParams, response))
    }
    async documentation(searchParams, response) {
        const file = searchParams.get('file');
        if (!file) {
            docTextView.renderError('argument "file" missing', response);
            return;
        }
        console.log(`documentation route, file: ${file}`);
        
        try {
            const handler = await fs.open(file);
            const stream = await this.#docTextService.getDocumentation(handler);
            pipeResponse(stream,response);
        } catch (error) {
            docTextView.renderError(`file ${file} cannot be opened`, response)
        }
        
    }
    async text(searchParams, response) {
       
        const file = searchParams.get('file');
        if (!file) {
            docTextView.renderError('argument "file" missing', response);
            return;
        }
        try {
            const handler = await fs.open(file);
            const stream = await this.#docTextService.getText(handler);
            pipeResponse(stream,response);
        } catch (error) {
            docTextView.renderError(`file ${file} cannot be opened`, response)
        }
    }
    getRoutes() {
        return ["/doc", "/text"]
    }
}