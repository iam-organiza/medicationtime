import React from 'react';
import {StatusBar} from 'react-native';
import {Edges, SafeAreaView} from 'react-native-safe-area-context';

interface Props {
  children?: any;
  statusbarColor?: string;
  background?: string;
  edges?: Edges;
}

const Layout: React.FC<Props> = ({
  children,
  statusbarColor = '#fff',
  background = 'transparent',
  edges = undefined,
}) => {
  return (
    <SafeAreaView edges={edges} style={{flex: 1, backgroundColor: background}}>
      <StatusBar backgroundColor={statusbarColor} barStyle="dark-content" />
      {children}
    </SafeAreaView>
  );
};

//make this component available to the app
export default Layout;
