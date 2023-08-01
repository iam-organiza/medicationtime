import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon, Text} from 'native-base';
import {Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import palette from '../constants/palette.constant';
import routes from '../constants/routes';
import {logout} from '../features/auth.feature';
import RemindersScreen from '../screens/reminders.screen';
import UpcomingRemindersScreen from '../screens/upcomingreminders.screen';

export type RootTabParamList = {
  UpcomingReminders: undefined;
  Reminders: undefined;
  Logout: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function Logout() {
  const dispatch = useDispatch();

  async function delToken() {
    try {
      await AsyncStorage.removeItem('token');
      dispatch(logout());
    } catch (e) {
      // remove error
    }
  }

  React.useEffect(() => {
    void delToken();
  }, []);

  return null;
}

const HomeNavigation = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 96 : 72,
          },
          tabBarIconStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: palette.basicGrey,
          tabBarLabelStyle: {
            fontFamily: 'Poppins',
            fontSize: 12,
            color: palette.primary,
          },
        }}>
        <Tab.Screen
          name={routes.UpcomingRemindersRoute}
          component={UpcomingRemindersScreen}
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                fontFamily="Poppins"
                color={focused ? 'primary.700' : 'black'}>
                Upcoming
              </Text>
            ),
            tabBarIcon: ({focused, color, size}) => (
              <Icon
                as={<MaterialIcons name="event" size={24} color="black" />}
                size={5}
                color={focused ? 'primary.700' : 'black'}
              />
            ),
          }}
        />
        <Tab.Screen
          name={routes.RemindersRoute}
          component={RemindersScreen}
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                fontFamily="Poppins"
                color={focused ? 'primary.700' : 'black'}>
                Reminders
              </Text>
            ),
            tabBarIcon: ({focused, color, size}) => (
              <Icon
                as={
                  <MaterialCommunityIcons
                    name="clipboard-text-outline"
                    size={24}
                    color="black"
                  />
                }
                size={5}
                color={focused ? 'primary.700' : 'black'}
              />
            ),
          }}
        />
        <Tab.Screen
          name={'Logout'}
          component={Logout}
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                fontFamily="Poppins"
                color={focused ? 'primary.700' : 'black'}>
                Logout
              </Text>
            ),
            tabBarIcon: ({focused, color, size}) => (
              <Icon
                as={<Ionicons name="log-out" size={24} color="black" />}
                size={5}
                color={focused ? 'primary.700' : 'black'}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default HomeNavigation;
