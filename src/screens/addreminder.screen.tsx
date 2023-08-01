import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Button,
  CloseIcon,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Text,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {Keyboard, Pressable} from 'react-native';
import uuid from 'react-native-uuid';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store';
import Layout from '../components/layout/layout.component';
import storageKeys from '../constants/storage.keys';
import {selectToken} from '../features/auth.feature';
import {
  addReminder,
  IReminder,
  selectReminders,
} from '../features/reminders.feature';
import {
  handleScheduleNotification,
  isReminderDosageValid,
  isReminderFrequencyValid,
  isReminderNameValid,
} from '../utils/helper.util';

const AddRemindersScreen = () => {
  const {goBack} = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector(selectReminders);
  const token = useSelector(selectToken);

  const [payload, setPayload] = React.useState<IReminder>({
    id: `${uuid.v4()}`,
    name: '',
    dosage: '',
    frequency: '',
    timeOfDay: new Date().getTime(),
    addedBy: token!,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [addReminderSuccessMsg, setAddReminderSuccessMsg] = React.useState('');
  const [addReminderErrorMsg, setAddReminderErrorMsg] = React.useState('');
  const [isNameInputInvalid, setIsNameInputInvalid] = React.useState(false);
  const [isDosageInputInvalid, setIsDosageInputInvalid] = React.useState(false);
  const [isFrequencyInputInvalid, setisFrequencyInputInvalid] =
    React.useState(false);
  const [isTimeOfDayInputInvalid, setisTimeOfDayInputInvalid] =
    React.useState(false);

  async function handleAddReminder() {
    Keyboard.dismiss();

    if (!isReminderNameValid(payload.name)) {
      setIsNameInputInvalid(true);
      return;
    }

    if (!isReminderDosageValid(payload.dosage)) {
      setIsDosageInputInvalid(true);
      return;
    }

    if (!isReminderFrequencyValid(payload.frequency)) {
      setisFrequencyInputInvalid(true);
      return;
    }

    // const isReminderTimeOfDayValid = Object.entries(payload.timeOfDay).some(
    //   ([key, value]) => value,
    // );

    // if (!isReminderTimeOfDayValid) {
    //   setisTimeOfDayInputInvalid(true);
    //   return;
    // }

    setSubmitting(true);
    try {
      if (payload.name in reminders) {
        setAddReminderErrorMsg('Reminder with that name already exists.');
        setSubmitting(false);
        return;
      }

      await AsyncStorage.setItem(
        storageKeys.RemindersKey,
        JSON.stringify({...reminders, [payload.name]: payload}),
      );
      dispatch(addReminder(payload));
      setAddReminderSuccessMsg('Reminder added successfully.');
      setPayload({
        id: `${uuid.v4()}`,
        name: '',
        dosage: '',
        frequency: '',
        timeOfDay: new Date().getTime(),
        addedBy: token!,
      });
      setIsNameInputInvalid(false);
      setIsDosageInputInvalid(false);
      setisFrequencyInputInvalid(false);
      setisTimeOfDayInputInvalid(false);
      setSubmitting(false);

      handleScheduleNotification(payload);
    } catch (e) {
      console.warn(e);
      setSubmitting(false);
    }
  }

  React.useEffect(() => {
    if (addReminderErrorMsg.length > 0) {
      setTimeout(() => {
        setAddReminderErrorMsg('');
      }, 3000);
    }

    if (addReminderSuccessMsg.length > 0) {
      setTimeout(() => {
        setAddReminderSuccessMsg('');
      }, 5000);
    }
  }, [addReminderErrorMsg, addReminderSuccessMsg]);

  return (
    <Layout background="white">
      <VStack flex={1} space={12} p={3}>
        <HStack alignItems={'center'} justifyContent={'space-between'}>
          <Text fontFamily={'Poppins'} fontSize={24} fontWeight={500}>
            Add Reminder
          </Text>
          <Pressable onPress={() => goBack()}>
            <CloseIcon color={'black'} size={5} />
          </Pressable>
        </HStack>
        {addReminderErrorMsg.length > 0 ? (
          <Alert mb={3} maxW="400" status="danger" colorScheme="danger">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                    {addReminderErrorMsg}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        ) : null}
        {addReminderSuccessMsg.length > 0 ? (
          <Alert mb={3} maxW="400" status="success" colorScheme="success">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                    {addReminderSuccessMsg}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        ) : null}
        <ScrollView>
          <VStack space={5}>
            <VStack space={2}>
              <Text fontFamily={'Poppins'} fontSize={16} fontWeight={500}>
                Name
              </Text>
              <FormControl isRequired isInvalid={isNameInputInvalid}>
                <Input
                  type={'text'}
                  rounded={8}
                  autoCapitalize={'none'}
                  p={3}
                  placeholder=""
                  fontFamily={'Poppins'}
                  fontSize={16}
                  value={payload.name}
                  onChangeText={(text: string) =>
                    setPayload(prev => ({...prev, name: text}))
                  }
                  onFocus={() => setIsNameInputInvalid(false)}
                  onBlur={() =>
                    setIsNameInputInvalid(!isReminderNameValid(payload.name))
                  }
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  <Text fontFamily={'Poppins'} fontSize={10}>
                    Required.
                  </Text>
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>
            <VStack space={2}>
              <Text fontFamily={'Poppins'} fontSize={16} fontWeight={500}>
                Dosage
              </Text>
              <FormControl isRequired isInvalid={isDosageInputInvalid}>
                <Input
                  type={'text'}
                  keyboardType={'number-pad'}
                  rounded={8}
                  autoCapitalize={'none'}
                  p={3}
                  placeholder=""
                  fontFamily={'Poppins'}
                  fontSize={16}
                  value={payload.dosage}
                  onChangeText={(text: string) =>
                    setPayload(prev => ({...prev, dosage: text}))
                  }
                  onFocus={() => setIsDosageInputInvalid(false)}
                  onBlur={() =>
                    setIsDosageInputInvalid(
                      !isReminderDosageValid(payload.dosage),
                    )
                  }
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  <Text fontFamily={'Poppins'} fontSize={10}>
                    Only digits allowed and cannot be blank.
                  </Text>
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>
            <VStack space={2}>
              <Text fontFamily={'Poppins'} fontSize={16} fontWeight={500}>
                Frequency (days)
              </Text>
              <FormControl isRequired isInvalid={isFrequencyInputInvalid}>
                <Input
                  type={'text'}
                  keyboardType={'number-pad'}
                  rounded={8}
                  autoCapitalize={'none'}
                  p={3}
                  placeholder=""
                  fontFamily={'Poppins'}
                  fontSize={16}
                  value={payload.frequency}
                  onChangeText={(text: string) =>
                    setPayload(prev => ({...prev, frequency: text}))
                  }
                  onFocus={() => setisFrequencyInputInvalid(false)}
                  onBlur={() =>
                    setisFrequencyInputInvalid(
                      !isReminderFrequencyValid(payload.dosage),
                    )
                  }
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  <Text fontFamily={'Poppins'} fontSize={10}>
                    Only digits allowed and cannot be blank.
                  </Text>
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>
            <VStack space={2}>
              <Text fontFamily={'Poppins'} fontSize={16} fontWeight={500}>
                Time of Day
              </Text>
              <FormControl isRequired isInvalid={isTimeOfDayInputInvalid}>
                <VStack space={2}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date(payload.timeOfDay)}
                    mode={'time'}
                    is24Hour={true}
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate;

                      if (currentDate) {
                        setPayload(prev => ({
                          ...prev,
                          timeOfDay: currentDate.getTime(),
                        }));
                      }
                    }}
                  />
                  {/* <BouncyCheckbox
                    fillColor="#0e7490"
                    iconStyle={{borderColor: 'red'}}
                    innerIconStyle={{
                      borderRadius: 10,
                      borderColor: palette.basicGrey,
                    }}
                    textComponent={
                      <Text fontFamily={'Poppins'} fontSize={16}>
                        {' '}
                        Morning
                      </Text>
                    }
                    isChecked={payload.timeOfDay.morning}
                    onPress={(isChecked: boolean) => {
                      if (isChecked) setisTimeOfDayInputInvalid(false);

                      setPayload(prev => ({
                        ...prev,
                        timeOfDay: {...prev.timeOfDay, morning: isChecked},
                      }));
                    }}
                  />
                  <BouncyCheckbox
                    fillColor="#0e7490"
                    iconStyle={{borderColor: 'red'}}
                    innerIconStyle={{
                      borderRadius: 10,
                      borderColor: palette.basicGrey,
                    }}
                    textComponent={
                      <Text fontFamily={'Poppins'} fontSize={16}>
                        {' '}
                        Afternoon
                      </Text>
                    }
                    isChecked={payload.timeOfDay.afternoon}
                    onPress={(isChecked: boolean) => {
                      if (isChecked) setisTimeOfDayInputInvalid(false);

                      setPayload(prev => ({
                        ...prev,
                        timeOfDay: {...prev.timeOfDay, afternoon: isChecked},
                      }));
                    }}
                  />
                  <BouncyCheckbox
                    fillColor="#0e7490"
                    iconStyle={{borderColor: 'red'}}
                    innerIconStyle={{
                      borderRadius: 10,
                      borderColor: palette.basicGrey,
                    }}
                    textComponent={
                      <Text fontFamily={'Poppins'} fontSize={16}>
                        {' '}
                        Evening
                      </Text>
                    }
                    isChecked={payload.timeOfDay.evening}
                    onPress={(isChecked: boolean) => {
                      if (isChecked) setisTimeOfDayInputInvalid(false);

                      setPayload(prev => ({
                        ...prev,
                        timeOfDay: {...prev.timeOfDay, evening: isChecked},
                      }));
                    }}
                  /> */}
                </VStack>
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  <Text fontFamily={'Poppins'} fontSize={10}>
                    Required.
                  </Text>
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            <Button
              isLoading={submitting}
              rounded={8}
              p={3}
              mt={5}
              onPress={() => handleAddReminder()}>
              <Text
                textTransform={'uppercase'}
                fontFamily={'Poppins'}
                fontWeight={500}
                color={'white'}
                fontSize={16}>
                Set Reminder
              </Text>
            </Button>
          </VStack>
        </ScrollView>
      </VStack>
    </Layout>
  );
};

export default AddRemindersScreen;
