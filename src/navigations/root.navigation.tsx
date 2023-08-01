import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store';
import routes from '../constants/routes';
import storageKeys from '../constants/storage.keys';
import {selectToken} from '../features/auth.feature';
import {initReminders} from '../features/reminders.feature';
import {initUsers} from '../features/users.feature';
import AddRemindersScreen from '../screens/addreminder.screen';
import EditRemindersScreen from '../screens/editreminder.screen';
import LoginScreen from '../screens/login.screen';
import OnboardingScreen from '../screens/onboarding.screen';
import SignupScreen from '../screens/signup.screen';
import SignupSuccessScreeen from '../screens/signup.success.screen';
import HomeNavigation from './home.navigation';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  SignupSuccess: undefined;
  Home: undefined;
  AddReminder: undefined;
  EditReminder: {name: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const token = useSelector(selectToken);
  const dispatch = useDispatch<AppDispatch>();

  async function initUsersStorage() {
    try {
      const asyncUsers = await AsyncStorage.getItem(storageKeys.usersKey);

      if (asyncUsers !== null) {
        const users = JSON.parse(asyncUsers);

        dispatch(initUsers(users));
        return;
      }

      await AsyncStorage.setItem(storageKeys.usersKey, JSON.stringify({}));
      dispatch(initUsers({}));
      return;
    } catch (e) {
      console.warn(e);
    }
  }

  async function initRemindersStorage() {
    try {
      const asyncUsers = await AsyncStorage.getItem(storageKeys.RemindersKey);

      if (asyncUsers !== null) {
        const users = JSON.parse(asyncUsers);

        dispatch(initUsers(users));
        return;
      }

      await AsyncStorage.setItem(storageKeys.RemindersKey, JSON.stringify({}));
      dispatch(initReminders({}));
      return;
    } catch (e) {
      console.warn(e);
    }
  }

  React.useEffect(() => {
    void initUsersStorage();
    void initRemindersStorage();
    PushNotificationIOS.removeAllPendingNotificationRequests();
  }, []);

  return (
    <Stack.Navigator>
      {token === null ? (
        <>
          <Stack.Screen
            name={routes.OnboardingRoute}
            component={OnboardingScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={routes.LoginRoute}
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={routes.SignupRoute}
            component={SignupScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={routes.SignupSuccessRoute}
            component={SignupSuccessScreeen}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={routes.HomeRoute}
            component={HomeNavigation}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={routes.AddReminderRoute}
            component={AddRemindersScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name={routes.EditReminderRoute}
            component={EditRemindersScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
