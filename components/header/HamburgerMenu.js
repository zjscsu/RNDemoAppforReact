import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createDrawerNavigator} from '@react-navigation/drawer';

/*
const Drawer = createDrawerNavigator();

export default HamburgerScreen = () => {
  return (
    <Drawer.Navigator
      drawerPosition={'right'}
      drawerContent={() => (
        <View>
          <Text>Hamburger Stuff</Text>
        </View>
      )}>
      <Drawer.Screen name="HamburgerMenu" component={HamburgerMenu} />
    </Drawer.Navigator>
  );
};
*/

export default HamburgerMenu = () => {
  const toggleDrawer = () => {
    // navigation.toggleDrawer();
    console.log('Clicked');
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.hamburger}
        hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        onPress={toggleDrawer}>
        <Icon name={'bars'} size={24} color={'#888'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hamburger: {
    alignSelf: 'center',
    marginLeft: 12,
    zIndex: 0,
  },
});
