For Development

Every time clone this repo

```
npm install
npx pod-install
npx expo prebuild --platform ios
npx expo run:ios
```

```
npm start
press w to open web
npx expo run:ios
press i to open iOS simulator
```

For Web Build

```
npm run bundle-web:web
```

For iOS Build and Run:

First build ios pod

```
npx expo prebuild --platform ios
npx expo prebuild --platform ios --clean
```

please add Info.plist if you clean prebuild (no need after 0.0.2,add it in app.json)

```
<key>NSMicrophoneUsageDescription</key>
<string>Give Wander permission to use your microphone. Your record wont be shared without your permission.</string>
```

ipa bundle (remember to change the buildNumber and clean prebuild)

```
eas build --platform ios
```

Other command may try when add link packages

```
npx pod-install
cd ios
pod install
```
