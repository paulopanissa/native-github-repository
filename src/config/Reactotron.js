import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({
    name: 'App1',
    host: '192.168.15.9',
  })
    .useReactNative()
    .connect();

  tron.clear();

  console.tron = tron;
}
