import { ICompany, ICompanyFormErrors } from "../types/Company";
import { IPasswordData, IUser, IUserLogin, IUserToChange } from "../types/User";
import { validate } from "./validateFormElements";

export const validateRegisterForm = (formData: IUser) => {
  const errors: IUser = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const typedKey = key as keyof IUser;
      
      if (typedKey === 'name') {
        errors[typedKey] = validate.nameAndSurname(formData[typedKey], typedKey);
      } else if (typedKey === 'confirmPassword') {
        errors[typedKey] = validate.confirmPassword(formData.password, formData.confirmPassword);
      } else {
        errors[typedKey] = validate[typedKey](formData[typedKey]);
      }
    }
  }

  return errors;
}

export const validateLoginForm = (formData: IUserLogin) => {
  const errors: IUserLogin = {
    email: "",
    password: "",
  }

  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const typedKey = key as keyof IUserLogin;

      errors[typedKey] = validate[typedKey](formData[typedKey]);
    }
  }

  return errors;
}

export const validateResetPasswordForm = (formData: IPasswordData) => {
  const errors: IPasswordData = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  }

  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const typedKey = key as keyof IPasswordData;

      if (typedKey === 'confirmPassword') {
        errors[typedKey] = validate.confirmPassword(formData.newPassword, formData.confirmPassword);
        continue;
      }

      errors[typedKey] = validate.password(formData[typedKey]);
    }
  }

  return errors;
}

export const validateProfileForm = (formData: IUserToChange) => {
  const errors: IUserToChange = {
    name: "",
  }
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const typedKey = key as keyof IUser;

      if (typedKey === 'name') {
        errors[typedKey] = validate.nameAndSurname(formData[typedKey], typedKey);
      }
    }
  }

  return errors;
}

export const validateNewCompanyForm = (formData: Omit<ICompany, "idUser">) => {
  const errors: ICompanyFormErrors = {
    name: "",
    service: "",
    capital: "",
    price: ""
  }

  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const typedKey = key as keyof Omit<ICompany, "idUser">;

      switch(typedKey) {
        case 'name':
        case 'service':
          errors[typedKey] = validate.nameAndSurname(formData[typedKey], typedKey);
          break;
        case 'capital':
        case 'price':
          errors[typedKey] = validate.moneyValue(formData[typedKey], key)
      }
    }
  }

  return errors;
}