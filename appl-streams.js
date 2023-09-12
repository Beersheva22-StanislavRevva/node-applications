import fs from 'node:fs/promises'
import http from 'node:http'
//streams theory:
//writeable stream(write) Output stream
//readable stream(read) Input stream
//duplex (write, read) TCP socket
//transform ZipLibrary
//Examples:
// <readable stream>.pipe(<writable stream>)
// <socket stream>.map<request => protocol.getResponse(request)>.pipe(<socket stream>)
//pipeline(<readable stream>, <transform stream>, <writable stream>)
const isComments = process.argv[2] == 'comments'
const fileInput = process.argv[3] || 'appl-streams.js';
const fileOutput = process.argv[4] || 'appl-streams-out' ;
const handlerInput = await fs.open(fileInput);
const handlerOutput = await fs.open(fileOutput, 'w');
const streamOutput = handlerOutput.createWriteStream();
getStreamWith(handlerInput, isComments).pipe(streamOutput);
//handlerInput.readFile('utf-8').then(data => console.log(data));

function getStreamWith(handler, isComments) {
    let streamInput = handler.createReadStream();
    streamInput.setEncoding('utf-8');
    streamInput = streamInput.flatMap(chunk => chunk.split('\n')).filter(line => {
            const res = line.trim().startsWith('//');
            return isComments ? res : !res; 
    }).map(line => isComments ? line.substr('//'): line);
    return streamInput;
}