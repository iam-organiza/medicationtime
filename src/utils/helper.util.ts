import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { IReminder } from "../features/reminders.feature";

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

export function getDifferenceInSeconds(date1: Date, date2: Date) {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return diffInMs / 1000;
  }

export function handleScheduleNotification(reminder: IReminder) {
    const date = new Date(reminder.timeOfDay);
    date.setSeconds(date.getSeconds() + 0);
    // PushNotificationIOS.addNotificationRequest({
    //     id: reminder.id,
    //     title: 'Medication Time',
    //     body: reminder.name,
    //     fireDate: date,
    //     repeats: true,
    //     repeatsComponent: {
    //         day: true
    //     },
    // });

    PushNotificationIOS.scheduleLocalNotification({
        alertTitle: 'Medication Time',
        alertBody: reminder.name,
        fireDate: date.toISOString(),
        repeatInterval: 'day',
    });

    PushNotificationIOS.removePendingNotificationRequests([])
}

export function removeScheduleNotification(identifiers: string[]) {
    PushNotificationIOS.removePendingNotificationRequests([...identifiers]);
}