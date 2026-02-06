// validation function
export const validateEmail = (email) => {
  if (!email.trim()) return "Email address is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please use a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";

  if (!/^(?=.*[a-z]).*/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/^(?=.*[A-Z]).*/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/^(?=.*\d)/.test(password)) {
    return "Password must have at least one digit ";
  }
  if (!/.{10,}$/.test(password)) {
    return "Password must be at least 10 characters long.";
  }
  if (!/^(?=.*[!@#$%^&*]).*/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return "";
};

export const validateAvatar = (file) => {
  if (file) {
    return "";
  }
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    return "profile picture must be a JPG, JPEG or PNG";
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return `Profile picture must be less than 5MB. Your file is ${(
      file.size /
      (1024 * 1024)
    ).toFixed(2)}MB`;
  }
  return "";
};

// LIVE PASSWORD VALIDATION FUNCTION
export const checkPasswordRule = (password) => {
  return {
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
    length: password.length >= 10,
  };
};

export const validateResumeFile = (file)=>{
const allowedFileType=['application/pdf',]
if(!allowedFileType.includes(file.type)){
  return "Resume must be a PDF file"
}
const maxSize=5*1024*1024; //2MB
if(file.size>maxSize){
  return `Resume must be less than 5MB. Your file is ${(file.size/(1024*1024)).toFixed(2)}MB`
}

return null;
}

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
