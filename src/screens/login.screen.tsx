import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Alert,
  Button,
  HStack,
  Icon,
  Input,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base';
import React from 'react';
import {Keyboard} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store';
import Layout from '../components/layout/layout.component';
import routes from '../constants/routes';
import {login} from '../features/auth.feature';
import {selectUsers} from '../features/users.feature';
import {RootStackParamList} from '../navigations/root.navigation';

const LoginScreen = () => {
  const {goBack, navigate} =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const users = useSelector(selectUsers);
  const dispatch = useDispatch<AppDispatch>();

  const [submitting, setSubmitting] = React.useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = React.useState('');

  const [payload, setPayload] = React.useState({
    email: '',
    password: '',
  });

  async function handleLogin() {
    Keyboard.dismiss();

    if (!(payload.email in users)) {
      setLoginErrorMsg('User does not found.');
      return;
    }

    const user = users[payload.email];
    if (user.password !== payload.password) {
      setLoginErrorMsg('Invalid credentials.');
      return;
    }

    setSubmitting(true);
    try {
      const token = payload.email;
      await AsyncStorage.setItem('token', token);
      dispatch(login(token));

      setPayload({email: '', password: ''});
      setSubmitting(false);
    } catch (e) {
      console.warn(e);
      setSubmitting(false);
    }
  }

  React.useEffect(() => {
    if (loginErrorMsg.length > 0) {
      setTimeout(() => {
        setLoginErrorMsg('');
      }, 3000);
    }
  }, [loginErrorMsg]);

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
              Medication Time
            </Text>
          </VStack>

          <VStack flex={1}>
            {loginErrorMsg.length > 0 ? (
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
                        {loginErrorMsg}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>
            ) : null}
            <VStack space={5}>
              <VStack space={2}>
                <Text fontFamily={'Poppins'} fontSize={16} fontWeight={500}>
                  Email Address
                </Text>
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
                />
              </VStack>
              <VStack space={2}>
                <Text fontFamily={'Poppins'} fontSize={16} fontWeight={500}>
                  Password
                </Text>
                <Input
                  type={'text'}
                  secureTextEntry
                  rounded={8}
                  p={3}
                  placeholder="********"
                  fontFamily={'Poppins'}
                  fontSize={16}
                  value={payload.password}
                  onChangeText={(char: string) =>
                    setPayload(prev => ({...prev, password: char}))
                  }
                />
              </VStack>

              <Button
                isLoading={submitting}
                rounded={8}
                p={3}
                mt={5}
                onPress={() => handleLogin()}>
                <Text
                  textTransform={'uppercase'}
                  fontFamily={'Poppins'}
                  fontWeight={500}
                  color={'white'}
                  fontSize={16}>
                  Login
                </Text>
              </Button>
              <Text fontFamily={'Poppins'} fontSize={16}>
                Don't have an account?{' '}
                <Text
                  fontWeight={500}
                  color={'primary.700'}
                  onPress={() => navigate(routes.SignupRoute)}>
                  Sign up
                </Text>
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </View>
    </Layout>
  );
};

export default LoginScreen;
