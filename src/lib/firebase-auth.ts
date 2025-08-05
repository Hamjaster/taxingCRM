import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  ApplicationVerifier 
} from 'firebase/auth';
import { auth } from './firebase';

// Store confirmation result globally for verification
let confirmationResult: ConfirmationResult | null = null;

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present (assuming US)
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return phone; // Return as-is if already formatted or different format
}

export function setupRecaptcha(elementId: string): RecaptchaVerifier {
  const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
  
  return recaptchaVerifier;
}

export async function sendOTPWithFirebase(
  phoneNumber: string, 
  recaptchaVerifier: ApplicationVerifier
): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    confirmationResult = await signInWithPhoneNumber(
      auth, 
      formattedPhone, 
      recaptchaVerifier
    );
    
    console.log('OTP sent successfully to:', formattedPhone);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send OTP' 
    };
  }
}

export async function verifyOTPWithFirebase(
  otpCode: string
): Promise<{ success: boolean; error?: string; firebaseUser?: any }> {
  try {
    if (!confirmationResult) {
      return { 
        success: false, 
        error: 'No OTP request found. Please request a new code.' 
      };
    }

    const result = await confirmationResult.confirm(otpCode);
    const firebaseUser = result.user;
    
    // Clear the confirmation result after successful verification
    confirmationResult = null;
    
    return { 
      success: true, 
      firebaseUser 
    };
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: error.message || 'Invalid verification code' 
    };
  }
}

export function clearConfirmationResult(): void {
  confirmationResult = null;
}
