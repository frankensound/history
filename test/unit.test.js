const { isValidMessage } = require('../src/utils/messaging');
describe('Tests for isValidMessage', () => {
    test('should validate a valid message', () => {
        const message = JSON.stringify({ userId: "1saf435224e05", songId: 123 });
        expect(isValidMessage(message, "history")).toBe(true);
    });

    test('should invalidate a message with empty userId', () => {
        const message = JSON.stringify({ userId: "", song_id: 123 });
        expect(isValidMessage(message, "history")).toBe(false);
    });

    test('should invalidate a message with missing username', () => {
        const message = JSON.stringify({ song_id: 123 });
        expect(isValidMessage(message, "history")).toBe(false);
    });

    test('should invalidate a message with non-integer songId', () => {
        const message = JSON.stringify({ userId: "1saf435224e05", songId: "abc" });
        expect(isValidMessage(message, "history")).toBe(false);
    });

    test('should invalidate a message with missing songId', () => {
        const message = JSON.stringify({ userId: "1saf435224e05" });
        expect(isValidMessage(message, "history")).toBe(false);
    });

    test('should invalidate a incorrectly formatted JSON string', () => {
        const message = "This is not JSON";
        expect(isValidMessage(message, "history")).toBe(false);
    });
});