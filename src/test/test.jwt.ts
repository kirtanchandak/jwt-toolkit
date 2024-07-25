import { encode_jwt } from "../jwt";

describe("JWT functions testing", () => {
    const originalDateNow = Date.now;

    beforeAll(() => {
        Date.now = jest.fn(() => 1609459200000);
    });

    afterAll(() => {
        Date.now = originalDateNow;
    });

    it("returns a JWT token when given secret, id, payload, and ttl", async () => {
        const secret = "secret";
        const id = 2;
        const payload = { name: "kirtan" };
        const ttl = 3600; // 1 hour
        const expected = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJuYW1lIjogImtpcnRhbiIsICJpZCI6IDIsICJpYXQiOiAxNjA5NDU5MjAwLCAiZXhwIjogMTYwOTQ2MjgwMH0.sTgrKw3MftlCoIBzvIXhRmOeA2Od3p34cmwEhTudYuc"; // This is an example, the actual value may vary

        const actual = await encode_jwt(secret, id, payload, ttl);
        
        expect(actual).toBe(expected);
    });

    it("returns a JWT token when given secret, id, and payload without ttl", async () => {
        const secret = "secret";
        const id = 2;
        const payload = { name: "kirtan" };
        const expected = "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJuYW1lIjogImtpcnRhbiIsICJpZCI6IDIsICJpYXQiOiAxNjA5NDU5MjAwfQ.R3nFMB72cDlD35nHivv5KHsVwsOP2axrbzTZMbn9g1M"; // This is an example, the actual value may vary

        const actual =  encode_jwt(secret, id, payload);
        
        expect(actual).toBe(expected);
    });
});
