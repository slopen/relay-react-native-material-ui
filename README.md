# Relay / React Native / Material UI / Graphql Connections/Mutations Boilerplate

RANGE_ADD / RANGE_DELETE / NODE_DELETE / FIELDS_CHANGE examples

[react-native-relay-example](https://github.com/sibelius/react-native-relay-example) - example integration React Native / Relay

[react-router-native](https://github.com/jmurzy/react-router-native) - react router replacement

[react-relay-network-layer](https://github.com/nodkz/react-relay-network-layer) - batch Relay queries

[react-native-material-ui](https://github.com/xotahal/react-native-material-ui) - React Native Material UI (iOS/Android)


## Init

Check [React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html)

Check [React Native Vector Icons Installation](https://github.com/oblador/react-native-vector-icons#installation)

```
git clone https://github.com/slopen/relay-react-native-material-ui
cd relay-react-native-material-ui
npm i
adb reverse tcp:8081 tcp:8081
```

## Start GraphQL server

```
npm run server
```
http://localhost:9000

Same backend mock as:

[relay-boilerplate-itemslist](https://github.com/slopen/relay-boilerplate-itemslist)

[relay-boilerplate-itemslist-isomorphic](https://github.com/slopen/relay-boilerplate-itemslist-isomorphic)


Setup GraphQL endpoints in `src/config.js` for local network, using dev machine IP:
```
network: {
    url: 'http://192.168.0.239:9000/graphql',
    batchUrl: 'http://192.168.0.239:9000/batch'
}
```


## Deploy Android

```
npm run android
```


## Deploy iOS

```
npm run ios
```