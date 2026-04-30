import { TOTP, NobleCryptoPlugin, ScureBase32Plugin } from 'otplib';

// Initialize plugins once
const cryptoPlugin = new NobleCryptoPlugin();
const base32Plugin = new ScureBase32Plugin();

// Create a configured TOTP instance
const totp = new TOTP({
    crypto: cryptoPlugin,
    base32: base32Plugin,
    // Industry standard defaults
    digits: 6,
    algorithm: 'sha1',
    period: 30
});

/**
 * Generates a new TOTP secret for the user.
 */
export const generateTOTPSecret = (): string => {
    // Generate a default-length base32 secret (usually 16 or 20 characters depending on implementation)
    return totp.generateSecret();
};

/**
 * Generates a OTPAuth URI for QR code generation.
 */
export const generateOTPAuthURI = (userEmail: string, issuer: string, secret: string): string => {
    const cleanLabel = userEmail.split('@')[0] || "user";
    // Using the class toURI method which handles parameters correctly
    return totp.toURI({
        secret,
        label: cleanLabel,
        issuer
    });
};

/**
 * Verifies a TOTP code against a secret.
 */
export const verifyTOTPCode = async (code: string, secret: string): Promise<{ isValid: boolean, error?: string, debug?: any }> => {
    try {
        const now = Math.floor(Date.now() / 1000);
        console.log(`[2FA-LIB] VERIFYING -> Code: ${code}, Secret(prefix): ${secret.substring(0, 4)}, ServerTime: ${now}`);

        // Try standard verification first with a sane window (5 minutes)
        // Note: epochTolerance in otplib v13 is in seconds.
        // It must not exceed 2940 seconds.
        const result = await totp.verify(code, {
            secret,
            epochTolerance: 300 // 5 minutes tolerance
        });

        console.log(`[2FA-LIB] Validation Result:`, result);

        if (result) {
            return {
                isValid: true,
                debug: { serverTime: now }
            };
        }

        // If it fails, let's find the exact drift by checking a wide window (±30 minutes)
        // This is ONLY for diagnostics, we don't return isValid: true for such large drifts.
        let detectedDrift: string | null = null;
        const SEARCH_WINDOW_STEPS = 60; // ±30 minutes (60 steps of 30s)

        for (let i = -SEARCH_WINDOW_STEPS; i <= SEARCH_WINDOW_STEPS; i++) {
            const timeStep = now + (i * 30);
            const isMatch = await (totp as any).verify(code, {
                secret,
                timestamp: timeStep * 1000,
                window: 0
            });
            if (isMatch) {
                detectedDrift = `${i * 30} seconds (${(i * 30 / 60).toFixed(1)} minutes)`;
                break;
            }
        }

        const diagnostics = {
            expectedNow: await (totp as any).generate(secret),
            detectedDrift: detectedDrift || "None found in ±30m window"
        };

        console.log(`[2FA-LIB] Diagnostic Result:`, diagnostics);

        return {
            isValid: false,
            debug: { serverTime: now, diagnostics }
        };
    } catch (err: any) {
        console.error("[2FA-LIB] Execution Error:", err);
        return { isValid: false, error: err?.message || String(err) };
    }
};
