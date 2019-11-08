import React, { useState, useEffect, useCallback } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import ListItem from './ListItem';
import { Container, Form, Input, SubmitButton, List } from './styles';

export default function Main({ navigation }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddUser = useCallback(async () => {
    try {
      setLoading(true);

      const userExists = users.filter(item => item.login === newUser);

      if (userExists.length > 0) {
        setLoading(false);
        return;
      }

      const response = await api.get(`/users/${newUser}`);

      const data = {
        id: response.data.id,
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      setUsers([...users, data]);
      setNewUser('');
      Keyboard.dismiss();
    } catch (e) {
      console.tron.warn(e);
    } finally {
      setLoading(false);
    }
  }, [newUser, users]);

  const handleRemove = useCallback(
    id => {
      const listUser = users.filter(user => user.id !== id);
      setUsers(listUser);
    },
    [users]
  );

  const handleNavigate = useCallback(
    user => {
      navigation.navigate('User', { user });
    },
    [navigation]
  );

  useEffect(() => {
    async function loadAsyncStorage() {
      const asyncUsers = await AsyncStorage.getItem('users');

      if (asyncUsers) {
        setUsers(JSON.parse(asyncUsers));
      }
    }

    loadAsyncStorage();
  }, []);

  useEffect(() => {
    function controlUsers() {
      console.tron.log(users);
      AsyncStorage.setItem('users', JSON.stringify(users));
    }

    controlUsers();
  }, [users]);

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          value={newUser}
          onChangeText={text => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            showProfile={handleNavigate}
            removeProfile={handleRemove}
            key={item.id}
            item={item}
          />
        )}
      />
    </Container>
  );
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

Main.navigationOptions = {
  title: 'Usuários',
};
