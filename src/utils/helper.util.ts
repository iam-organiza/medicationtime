
export function isEmailValid(email: string): boolean {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    return expression.test(email);
}

export function isPasswordValid(password: string): boolean {
    const expression: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

    return expression.test(password);
}

export function isReminderNameValid(name: string) {
    if (name.length < 1) {
       return false; 
    }

    return true;
}

export function isReminderDosageValid(dosage: string) {
    if (dosage.length < 1 || !/^\d+$/.test(dosage)) {
       return false; 
    }

    return true;
}

export function isReminderFrequencyValid(frequency: string) {
    if (frequency.length < 1 || !/^\d+$/.test(frequency)) {
       return false; 
    }

    return true;
}