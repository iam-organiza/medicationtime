import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Fab, Icon, Text, View} from 'native-base';
import React from 'react';
import {Platform} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Layout from '../components/layout/layout.component';
import routes from '../constants/routes';
import {RootStackParamList} from '../navigations/root.navigation';

const UpcomingRemindersScreen = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Layout background="white">
      <View flex={1} p={3}>
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
      </View>
    </Layout>
  );
};

export default UpcomingRemindersScreen;
