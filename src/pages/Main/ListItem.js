import React, { useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import {
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  RemoveButton,
} from './styles';

const ANIMATION_DURATION = 550;
const ROW_HEIGHT = 160;
const listAnimated = new Animated.Value(0);

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ListItem({ item, showProfile, removeProfile }) {
  useEffect(() => {
    function Animations() {
      Animated.timing(listAnimated, {
        toValue: 1,
        duration: ANIMATION_DURATION,
      }).start();
    }

    Animations();
  }, []);

  const handleOnPressRemove = id => {
    console.tron.warn(id);
    Animated.timing(listAnimated, {
      toValue: 0,
      duration: ANIMATION_DURATION,
    }).start();
    removeProfile(id);
  };

  const handleOnPressShowProfile = id => {
    console.tron.warn('Show Profile');
    showProfile(id);
  };

  return (
    <User
      style={[
        {
          height: listAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, ROW_HEIGHT],
            extrapolate: 'clamp',
          }),
        },
        {
          opacity: listAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
        {
          transform: [
            { scale: listAnimated },
            {
              rotate: listAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: ['35deg', '0deg'],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    >
      <Avatar source={{ uri: item.avatar }} />
      <Name>{item.name}</Name>
      <Bio>{item.bio}</Bio>

      <ProfileButton onPress={() => handleOnPressShowProfile(item.id)}>
        <ProfileButtonText>Ver perfil</ProfileButtonText>
      </ProfileButton>
      <RemoveButton onPress={() => handleOnPressRemove(item.id)}>
        <Icon name="remove-circle-outline" size={20} color="#fff" />
      </RemoveButton>
    </User>
  );
}

ListItem.propTypes = {
  showProfile: PropTypes.func.isRequired,
  removeProfile: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    avatar: PropTypes.string,
    name: PropTypes.string,
    bio: PropTypes.string,
  }),
};

ListItem.defaultProps = {
  item: {
    avatar: '',
    name: '',
    bio: '',
  },
};
