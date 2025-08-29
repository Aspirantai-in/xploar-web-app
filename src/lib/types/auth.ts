// Authentication and User Profile Types
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  roles: string[];
  permissions: string[];
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    profilePicture?: string;
  };
  academicInfo?: {
    currentEducation?: 'HIGH_SCHOOL' | 'UNDERGRADUATE' | 'GRADUATE' | 'POSTGRADUATE' | 'WORKING_PROFESSIONAL';
    fieldOfStudy?: string;
    institution?: string;
    graduationYear?: number;
    academicAchievements?: string[];
  };
  examInfo?: {
    targetExam?: string;
    examYear?: number;
    attemptNumber?: number;
    previousAttempts?: any[];
    targetRank?: string;
  };
  preferences: {
    timezone: string;
    language: string;
    notificationSettings: {
      email: boolean;
      sms: boolean;
      push: boolean;
      reminderTime?: string;
    };
    studyPreferences?: {
      preferredStudyTime?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
      breakDuration?: number;
      weeklyOffDays?: string[];
      aiRecommendations?: boolean;
    };
  };
  subscription?: {
    plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    startDate?: string;
    endDate?: string;
    features?: string[];
    isActive?: boolean;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  deviceInfo?: {
    deviceId?: string;
    deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET';
    os?: string;
    osVersion?: string;
  };
}

export interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  mobileNumber?: string;
  countryCode?: string;
  preferences: {
    timezone: string;
    language: string;
    notificationSettings: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export interface OnboardingData {
  goal: string;
  startDate: string;
  targetHoursPerDay: number;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  subjects: {
    mandatory: string[];
    optional?: string[];
    languages?: string[];
  };
  studyPattern: 'MORNING_PERSON' | 'EVENING_PERSON' | 'FLEXIBLE';
  breakDuration: number;
  weeklyOffDays: string[];
  aiRecommendations: boolean;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isOnboardingComplete: boolean;
}

// WhatsApp OTP Types
export interface WhatsAppOTPRequest {
  mobileNumber: string;
  countryCode: string;
  purpose: 'REGISTRATION' | 'LOGIN';
}

export interface WhatsAppOTPVerifyRequest {
  mobileNumber: string;
  countryCode: string;
  otp: string;
  purpose: 'REGISTRATION' | 'LOGIN';
}

export interface WhatsAppOTPState {
  isLoading: boolean;
  otpToken: string | null;
  expiresAt: string | null;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
  // WhatsApp OTP methods
  sendWhatsAppOTP: (request: WhatsAppOTPRequest) => Promise<void>;
  verifyWhatsAppOTP: (request: WhatsAppOTPVerifyRequest) => Promise<void>;
  whatsappOTP: WhatsAppOTPState;
}
