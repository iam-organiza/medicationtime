import PushNotificationIOS, {
  NotificationRequest,
} from '@react-native-community/push-notification-ios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Fab, Icon, Text, VStack} from 'native-base';
import React from 'react';
import {Platform} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Layout from '../components/layout/layout.component';
import palette from '../constants/palette.constant';
import routes from '../constants/routes';
import {RootStackParamList} from '../navigations/root.navigation';

const UpcomingRemindersScreen = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [upcomingNotifications, setUpcomingNotifications] = React.useState<
    NotificationRequest[]
  >([]);

  useFocusEffect(
    React.useCallback(() => {
      PushNotificationIOS.getPendingNotificationRequests(notifications => {
        setUpcomingNotifications([...notifications]);
      });
    }, []),
  );

  return (
    <Layout background="white">
      <VStack flex={1} p={3} space={4}>
        <Text fontFamily={'Poppins'} fontSize={24} fontWeight={500}>
          Upcoming Reminders
        </Text>

        <Fab
          renderInPortal={false}
          shadow={2}
          bottom={Platform.OS === 'ios' ? 0 : 3}
          placement="bottom-right"
          colorScheme="primary"
          size="lg"
          onPress={() => {
            navigate(routes.AddReminderRoute);
          }}
          icon={
            <Icon
              as={<AntDesign name="plus" size={24} color="black" />}
              size={5}
              color={'white'}
            />
          }
        />

        <VStack space={2}>
          {upcomingNotifications.map(upcomingNotification => (
            <VStack space={2} py={3} key={upcomingNotification.id}>
              <Text
                fontFamily={'Poppins'}
                color={palette.basicGrey}
                fontSize={12}
                fontWeight={500}>
                #{upcomingNotification.id}
              </Text>
              <Text fontFamily={'Poppins'} fontSize={18}>
                {upcomingNotification.body}
              </Text>
            </VStack>
          ))}
        </VStack>
      </VStack>
    </Layout>
  );
};

export default UpcomingRemindersScreen;
