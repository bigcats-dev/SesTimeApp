import 'dotenv/config';

export default ({ config }) => ({
  expo: {
    name: process.env.APP_ENV === 'production' ? 'SesTimeApp' : 'SesTimeApp (DEV)',
    slug: 'SesTimeApp',
    version: '1.0.4',
    runtimeVersion: {
      policy: 'appVersion'
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: "sestimeapp",
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/0e1cffb8-b52f-48eb-80e0-801ca52d0a0e"
    },
    splash: {
      image: './assets/splashx.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      userInterfaceStyle: "light",
      forceDarkMode: false,
      edgeToEdgeEnabled: true,
      permissions: ['CAMERA', 'RECEIVE_BOOT_COMPLETED'],
      package: 'com.siamexpress.timestamp',
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      versionCode: 3
    },

    web: {
      favicon: './assets/favicon.png',
    },

    plugins: [
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID.',
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
          recordAudioAndroid: true,
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/adaptive-icon.png',
          color: '#ffffff',
          defaultChannel: 'default',
          sounds: [],
          enableBackgroundRemoteNotifications: false,
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            networkSecurityConfig: "./assets/android/network_security_config.xml",
            cleartextTrafficPermitted: true
          }
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ]
    ],

    extra: {
      eas: {
        projectId: '0e1cffb8-b52f-48eb-80e0-801ca52d0a0e',
      },
      apiUrl: process.env.API_URL || 'https://siamexpresssurvey.com/timestamp',
      appEnv: process.env.APP_ENV || 'development',
    },

    owner: 'bigcats',
  },
});
