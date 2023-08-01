import {DeleteIcon, HStack, Icon, ScrollView, Text, VStack} from 'native-base';
import React from 'react';
import {Pressable} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Feather from 'react-native-vector-icons/Feather';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store';
import Layout from '../components/layout/layout.component';
import palette from '../constants/palette.constant';
import routes from '../constants/routes';
import storageKeys from '../constants/storage.keys';
import {selectToken} from '../features/auth.feature';
import {
  IReminder,
  initReminders,
  selectReminders,
} from '../features/reminders.feature';
import {RootStackParamList} from '../navigations/root.navigation';

const RemindersScreen = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector(selectReminders);
  console.log(reminders);

  const token = useSelector(selectToken);

  async function delReminder(name: string) {
    const remindersCopy: Record<string, IReminder> = {};

    Object.keys(reminders).forEach(key => {
      if (key !== name) {
        remindersCopy[key] = reminders[key];
      }
    });

    try {
      await AsyncStorage.removeItem(storageKeys.RemindersKey);

      await AsyncStorage.setItem(
        storageKeys.RemindersKey,
        JSON.stringify(remindersCopy),
      );
      dispatch(initReminders(remindersCopy));
    } catch (e) {
      // remove error
    }
  }

  return (
    <Layout background={'white'}>
      <VStack space={4} flex={1} p={3}>
        <Text fontFamily={'Poppins'} fontSize={24} fontWeight={500}>
          Reminders
        </Text>
        <ScrollView>
          <VStack flex={1}>
            {Object.keys(reminders).map(key =>
              reminders[key].addedBy === token ? (
                <Swipeable
                  key={key}
                  renderRightActions={(progress, dragX) => {
                    return (
                      <HStack>
                        <Pressable
                          onPress={() =>
                            navigate(routes.EditReminderRoute, {
                              name: reminders[key].name,
                            })
                          }>
                          <VStack
                            flex={1}
                            px={4}
                            bg={'primary.700'}
                            alignItems={'center'}
                            justifyContent={'center'}>
                            <Icon
                              as={
                                <Feather name="edit" size={24} color="black" />
                              }
                              size={5}
                              color={'white'}
                            />
                          </VStack>
                        </Pressable>
                        <Pressable
                          onPress={() => delReminder(reminders[key].name)}>
                          <VStack
                            flex={1}
                            px={4}
                            bg={'red.600'}
                            alignItems={'center'}
                            justifyContent={'center'}>
                            <DeleteIcon size={5} color={'white'} />
                          </VStack>
                        </Pressable>
                      </HStack>
                    );
                  }}>
                  <VStack py={3} shadow={2} bg={'white'}>
                    <Text fontFamily={'Poppins'} fontSize={18}>
                      {reminders[key].name}
                    </Text>
                    <HStack>
                      <Text
                        fontFamily={'Poppins'}
                        fontSize={13}
                        color={palette.basicGrey}>
                        Dosage: {reminders[key].dosage}{' '}
                      </Text>
                      <Text
                        fontFamily={'Poppins'}
                        fontSize={13}
                        color={palette.basicGrey}>
                        Frequency: {reminders[key].frequency}
                      </Text>
                    </HStack>
                    <Text
                      fontFamily={'Poppins'}
                      fontSize={13}
                      color={palette.basicGrey}>
                      Time of day:{' '}
                      {reminders[key].timeOfDay.morning && 'Morning '}
                      {reminders[key].timeOfDay.afternoon && 'Afternoon '}
                      {reminders[key].timeOfDay.evening && 'Evening '}
                    </Text>
                  </VStack>
                </Swipeable>
              ) : null,
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </Layout>
  );
};

export default RemindersScreen;
