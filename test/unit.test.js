const { isValidMessage } = require('../src/utils/middleware/messaging/rabbitmq');
describe('Tests for isValidMessage', () => {
    test('should validate a valid message', () => {
        const message = JSON.stringify({ username: 'testUser', id: 123 });
        expect(isValidMessage(message)).toBe(true);
    });

    test('should invalidate a message with empty username', () => {
        const message = JSON.stringify({ username: '', id: 123 });
        expect(isValidMessage(message)).toBe(false);
    });

    test('should invalidate a message with missing username', () => {
        const message = JSON.stringify({ id: 123 });
        expect(isValidMessage(message)).toBe(false);
    });

    test('should invalidate a message with non-integer id', () => {
        const message = JSON.stringify({ username: 'testUser', id: 'abc' });
        expect(isValidMessage(message)).toBe(false);
    });

    test('should invalidate a message with missing id', () => {
        const message = JSON.stringify({ username: 'testUser' });
        expect(isValidMessage(message)).toBe(false);
    });

    test('should invalidate a malformed JSON string', () => {
        const message = "This is not JSON";
        expect(isValidMessage(message)).toBe(false);
    });
});