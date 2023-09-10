import readline from "node:readline"
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const guessNumber = 5;
function f() {
readlineInterface.question("Enter any number: ", num => {
    console.log(`entering number is ${num}`);
    if (num != guessNumber) {
        f();
    }else readlineInterface.close();
})
}
f();

