// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,

    /**
     * Base url of the backend api
     */
    apiBaseUrl: 'http://localhost:3000',

    /**
     * Key by which the jwt-auth token is stored in the browser local storage
     */
    localStorageTokenKey: 'token',

    /**
     * Key by which the userId stored in the browser local storage
     */
    localStorageUserIdKey: 'userId',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
