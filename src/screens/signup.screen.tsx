import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Alert,
  Button,
  FormControl,
  HStack,
  Icon,
  Input,
  Pressable,
  Text,
  VStack,
  View,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {Keyboard} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store';
import Layout from '../components/layout/layout.component';
import routes from '../constants/routes';
import {addUser, selectUsers} from '../features/users.feature';
import {RootStackParamList} from '../navigations/root.navigation';
import {isEmailValid, isPasswordValid} from '../utils/helper.util';

const SignupScreen = () => {
  const {goBack, navigate} =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const users = useSelector(selectUsers);
  const dispatch = useDispatch<AppDispatch>();

  const [isEmailInputValid, setIsEmailInputValid] = React.useState(false);
  const [isPasswordInputValid, setIsPasswordInputValid] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [signupErrorMsg, setSignupErrorMsg] = React.useState('');

  const [payload, setPayload] = React.useState({
    email: '',
    password: '',
  });

  async function handleSignUp() {
    Keyboard.dismiss();

    if (!isEmailValid(payload.email)) {
      setIsEmailInputValid(true);
      return;
    }

    if (!isPasswordValid(payload.password)) {
      setIsPasswordInputValid(true);
      return;
    }

    setSubmitting(true);
    try {
      if (payload.email in users) {
        setSignupErrorMsg('User already exists.');
        setSubmitting(false);
        return;
      }

      await AsyncStorage.setItem(
        'users',
        JSON.stringify({...users, [payload.email]: payload}),
      );
      dispatch(addUser(payload));
      navigate(routes.SignupSuccessRoute);
      setPayload({email: '', password: ''});
      setIsEmailInputValid(false);
      setIsPasswordInputValid(false);
      setSubmitting(false);
    } catch (e) {
      console.warn(e);
      setSubmitting(false);
    }
  }

  React.useEffect(() => {
    if (signupErrorMsg.length > 0) {
      setTimeout(() => {
        setSignupErrorMsg('');
      }, 3000);
    }
  }, [signupErrorMsg]);

  return (
    <Layout>
      <View flex={1} p={3}>
        <View>
          <Pressable onPress={() => goBack()}>
            <Icon
              as={<AntDesign name="arrowleft" size={24} color="black" />}
              color={'black'}
              size={8}
            />
          </Pressable>
        </View>
        <VStack flex={1} space={32} py={3}>
          <VStack mt={3}>
            <Text fontFamily={'Poppins'} fontSize={32} fontWeight={500}>
              Let's Get Started
            </Text>
            <Text fontFamily={'Poppins'} color={'#939094'} fontSize={16}>
              Fill the form to continue
            </Text>
          </VStack>

          <VStack flex={1}>
            {signupErrorMsg.length > 0 ? (
              <Alert mb={3} maxW="400" status="danger" colorScheme="danger">
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack
                    flexShrink={1}
                    space={2}
                    alignItems="center"
                    justifyContent="space-between">
                    <HStack flexShrink={1} space={2} alignItems="center">
                      <Alert.Icon />
                      <Text
                        fontSize="md"
                        fontWeight="medium"
                        color="coolGray.800">
                        {signupErrorMsg}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>
            ) : null}
            <VStack space={5}>
              <VStack space={2}>
                <Text fontFamily={'Poppins'} fontSize={16} fontWeight={500}>
                  Your Email Address
                </Text>
                <FormControl isRequired isInvalid={isEmailInputValid}>
                  <Input
                    type={'text'}
                    rounded={8}
                    autoCapitalize={'none'}
                    p={3}
                    placeholder="john.doe@gmail.com"
                    fontFamily={'Poppins'}
                    fontSize={16}
                    value={payload.email}
                    onChangeText={(char: string) =>
                      setPayload(prev => ({...prev, email: char}))
                    }
                    onFocus={() => setIsEmailInputValid(false)}
                    onBlur={() => {
                      setIsEmailInputValid(!isEmailValid(payload.email));
                    }}
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    <Text fontFamily={'Poppins'} fontSize={10}>
                      Invalid email.
                    </Text>
                  </FormControl.ErrorMessage>
                </FormControl>
              </VStack>
              <VStack space={2}>
                <Text fontFamily={'Poppins'} fontSize={16} fontWeight={500}>
                  Choose a password
                </Text>
                <FormControl isRequired isInvalid={isPasswordInputValid}>
                  <Input
                    type={'text'}
                    secureTextEntry
                    rounded={8}
                    p={3}
                    placeholder="min. 8 characters"
                    fontFamily={'Poppins'}
                    fontSize={16}
                    value={payload.password}
                    onChangeText={(char: string) =>
                      setPayload(prev => ({...prev, password: char}))
                    }
                    onFocus={() => setIsPasswordInputValid(false)}
                    onBlur={() => {
                      setIsPasswordInputValid(
                        !isPasswordValid(payload.password),
                      );
                    }}
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    <Text fontFamily={'Poppins'} fontSize={10}>
                      Min. of 8 characters long, {'\n'}at least 1 uppercase
                      letter, {'\n'} 1 lowercase letter, {'\n'}1 one digit{' '}
                      {'\n'}& 1 special character.
                    </Text>
                  </FormControl.ErrorMessage>
                </FormControl>
              </VStack>

              <Button
                isLoading={submitting}
                rounded={8}
                p={3}
                mt={5}
                onPress={() => handleSignUp()}>
                <Text
                  textTransform={'uppercase'}
                  fontFamily={'Poppins'}
                  fontWeight={500}
                  color={'white'}
                  fontSize={16}>
                  Sign Up
                </Text>
              </Button>
              <Text fontFamily={'Poppins'} fontSize={16}>
                Already have an account?{' '}
                <Text
                  fontWeight={500}
                  color={'primary.700'}
                  onPress={() => navigate(routes.LoginRoute)}>
                  Login
                </Text>
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </View>
    </Layout>
  );
};

export default SignupScreen;
