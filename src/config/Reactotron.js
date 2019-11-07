import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({
    name: 'App1',
    host: '192.168.1.234',
  })
    .useReactNative()
    .connect();

  tron.clear();

  console.tron = tron;
}
