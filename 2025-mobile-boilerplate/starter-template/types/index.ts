export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  verificationCode: string;
  profilePhoto?: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  country?: string;
}
