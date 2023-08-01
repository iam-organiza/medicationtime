import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button, Stack, Text, VStack} from 'native-base';
import React from 'react';
import Layout from '../components/layout/layout.component';
import routes from '../constants/routes';
import {RootStackParamList} from '../navigations/root.navigation';

const OnboardingScreen = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Layout>
      <VStack flex={1}>
        <Stack flex={1} justifyContent={'center'}>
          <Text fontFamily={'Poppins'} fontSize={24} textAlign={'center'}>
            Welcome to Medication time
          </Text>
        </Stack>
        <VStack>
          <Button rounded={0} p={3} onPress={() => navigate(routes.LoginRoute)}>
            <Text
              textTransform={'uppercase'}
              fontFamily={'Poppins'}
              fontWeight={500}
              fontSize={16}
              color={'white'}>
              Log in
            </Text>
          </Button>
          <Button
            variant={'outline'}
            rounded={0}
            p={3}
            onPress={() => navigate(routes.SignupRoute)}>
            <Text
              textTransform={'uppercase'}
              fontFamily={'Poppins'}
              fontWeight={500}
              fontSize={16}>
              Sign Up
            </Text>
          </Button>
        </VStack>
      </VStack>
    </Layout>
  );
};

export default OnboardingScreen;
