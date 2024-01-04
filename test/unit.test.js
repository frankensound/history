const { isValidMessage } = require('../src/utils/messaging');
describe('Tests for isValidMessage', () => {
    test('should validate a valid message', () => {
        const message = JSON.stringify({ username: 'testUser', id: 123 });
        expect(isValidMessage(message, "history")).toBe(true);
    });

    test('should invalidate a message with empty username', () => {
        const message = JSON.stringify({ username: '', id: 123 });
        expect(isValidMessage(message, "history")).toBe(false);
    });

    test('should invalidate a message with missing username', () => {
        const message = JSON.stringify({ id: 123 });
        expect(isValidMessage(message, "history")).toBe(false);
    });

    test('should invalidate a message with non-integer id', () => {
        const message = JSON.stringify({ username: 'testUser', id: 'abc' });
        expect(isValidMessage(message, "history")).toBe(false);
    });

    test('should invalidate a message with missing id', () => {
        const message = JSON.stringify({ username: 'testUser' });
        expect(isValidMessage(message, "history")).toBe(false);
    });

    test('should invalidate a incorrectly formatted JSON string', () => {
        const message = "This is not JSON";
        expect(isValidMessage(message, "history")).toBe(false);
    });
});