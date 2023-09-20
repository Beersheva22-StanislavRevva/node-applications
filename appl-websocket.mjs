import { WebSocketServer } from "ws";
//import PromptSync from "prompt-sync";
import { PromptAsync } from "./PromptAsync.mjs";
const wss = new WebSocketServer({port: 8080});
wss.on('listening', () => {
    console.log(`Server is listening on port 8080`);
})
//const prompSync = PromptSync();
const prompAsync = new PromptAsync();
wss.on('connection', (ws, req) => {
    console.log(`connection from ${req.socket.remoteAddress} established`);
    console.log(`body inside request ${req.body}`);
    ws.send('Hello ');
    ws.on('close',() => {
        console.log(`connection from ${req.socket.remoteAddress} closed`);
    })
    ws.on(`message`, async message => {
        const answer = await prompAsync.prompt(message.toString() + "------>");
        ws.send(answer);
    })

})