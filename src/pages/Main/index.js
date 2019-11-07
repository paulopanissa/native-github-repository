import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import ListItem from './ListItem';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  ErrorContainer,
  ErrorText,
  List,
} from './styles';

export default function Main() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [error, setError] = useState(null);

  async function handleAddUser() {
    try {
      const userExists = users.filter(item => item.login === newUser);

      console.tron.log(userExists);

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
    }
  }

  const handleRemove = id => {
    const listUser = users.filter(user => user.id !== id);
    setUsers(listUser);
  };

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
        <SubmitButton onPress={handleAddUser}>
          <Icon name="add" size={20} color="#fff" />
        </SubmitButton>
      </Form>
      <ErrorContainer>
        <ErrorText>Texto</ErrorText>
      </ErrorContainer>
      <List
        data={users}
        keyExtractor={user => user.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            showProfile={() => {
              console.tron.log('showProfile');
            }}
            removeProfile={handleRemove}
            key={item.id}
            item={item}
          />
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Usuários',
};
