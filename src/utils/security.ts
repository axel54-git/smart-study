/**
 * Cryptographic Security Utility for SmartStudy
 * Implements salted SHA-256 hashing to verify admin authorization.
 * The plaintext admin password is NEVER stored anywhere in the codebase.
 */

// One-way salted cryptographic digest for admin verification
const ADMIN_DIGEST_SALT = 'smartstudy_admin_salt_sec_2026';
const ADMIN_DIGEST_HASH = '4fbab923fba1a9e733800b42545d22e22264bc45bae21e82365aef68cdeedf1f';

// In-memory brute-force throttle
let failedAttempts = 0;
let lockoutUntil = 0;

export async function verifyAdminCredentials(input: string): Promise<{ success: boolean; error?: string }> {
  const now = Date.now();
  if (now < lockoutUntil) {
    const remainingSec = Math.ceil((lockoutUntil - now) / 1000);
    return {
      success: false,
      error: `অতিরিক্ত ভুল চেষ্টার কারণে সিস্টেম সাময়িকভাবে লক করা হয়েছে। ${remainingSec} সেকেন্ড পর আবার চেষ্টা করুন।`
    };
  }

  if (!input || typeof input !== 'string') {
    return { success: false, error: 'অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন।' };
  }

  // 1. Try server-side rate-limited verification endpoint first
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: input.trim() }),
    });

    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || 'অতিরিক্ত ভুল চেষ্টার কারণে সিস্টেম সাময়িকভাবে লক করা হয়েছে।'
      };
    }

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.success && data.authorized) {
        failedAttempts = 0;
        lockoutUntil = 0;
        return { success: true };
      }
    }
  } catch (_netErr) {
    // Offline or serverless fallback - proceed to local cryptographic verification
  }

  // 2. Client-side cryptographic verification (using salted SHA-256 digest)
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${ADMIN_DIGEST_SALT}:${input.trim()}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (computedHash === ADMIN_DIGEST_HASH) {
      failedAttempts = 0;
      lockoutUntil = 0;
      return { success: true };
    } else {
      failedAttempts++;
      if (failedAttempts >= 5) {
        lockoutUntil = Date.now() + 60 * 1000; // 1-minute lockout
        return {
          success: false,
          error: 'পরপর ৫ বার ভুল পাসওয়ার্ড দেওয়া হয়েছে। নিরাপত্তা স্বার্থে ১ মিনিটের জন্য প্রবেশ স্থগিত করা হলো।'
        };
      }
      return {
        success: false,
        error: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।'
      };
    }
  } catch (err) {
    console.error('Authentication verification error:', err);
    return { success: false, error: 'যাচাইকরণে ত্রুটি দেখা দিয়েছে।' };
  }
}
