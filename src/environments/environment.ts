/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // FIREBASE: {
  //   'apiKey': 'AIzaSyD5mKP65SigZe59MeLutY_CZ-2CH72TOfA',
  //   'authDomain': 'maviba-web.firebaseapp.com',
  //   'databaseURL': 'https://maviba-web.firebaseio.com',
  //   'projectId': 'maviba-web',
  //   'storageBucket': 'maviba-web.appspot.com',
  //   'messagingSenderId': '494949217860',
  // },
  FIREBASE: {
    apiKey: "AIzaSyD2cq39SYem5HJi4-GNCVdUl-M-8WWOQnA",
    authDomain: "digirekord-fa7a2.firebaseapp.com",
    databaseURL: "https://digirekord-fa7a2.firebaseio.com",
    projectId: "digirekord-fa7a2",
    storageBucket: "digirekord-fa7a2.appspot.com",
    messagingSenderId: "723869244186"
  },
  googleMapsKey: 'AIzaSyB_6YbuEKewQ1Mc1Od4Tb0pV5-H6RrCokg',
};
