export class MiscService {
    getCurrentDate() {
        return new Date().toLocaleDateString();
    }

    echoMessage(message: string) {
        return `The message is ${message}`;
    }
}
