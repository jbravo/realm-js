////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

declare namespace Realm {
    /**
     * The constructor of MongoDB Realm App.
     */
    type AppConstructor = new <FF extends FunctionFactory>(
        id: string,
        configuration?: Partial<AppConfiguration>,
    ) => App<FF>;

    /**
     * A MongoDB Realm App.
     */
    interface App<FF extends FunctionFactory = FunctionFactory> {
        /**
         * The id of this Realm app.
         */
        id: string;

        /**
         * Use this to call functions defined on the MongoDB Realm server.
         */
        functions: FF;

        /**
         * Login a user using a specific credential
         * @param credentials the credentials to use when logging in
         */
        login(credentials: Credentials): Promise<Realm.User>;
    }

    interface AppConfiguration {
        baseUrl: string;
    }

    interface Credentials {
        /**
         * Name of the authentication provider.
         */
        readonly providerName: string;
    
        /**
         * Type of the authentication provider.
         */
        readonly providerType: string;
    
        /**
         * The contents of this credential as they will be passed to the server.
         */
        readonly material: { [key: string]: string };
    
        // TODO: Add providerCapabilities?
    }

    interface User {
        identities: UserIdentity[];
        accessToken: string;
        profile: UserProfile;
    }

    interface UserIdentity {
        userId: string;
        providerType: string;
    }

    interface UserProfile {
        name?: string;
        email?: string;
        pictureURL?: string;
        firstName?: string;
        lastName?: string;
        gender?: string;
        birthday?: string;
        minAge?: string;
        maxAge?: string;
        userType: 'server' | 'normal';
    }

    /**
     * A function which executes on the MongoDB Realm platform.
     */
    type RealmFunction<R, A extends any[]> = (...args: A) => Promise<R>;

    /**
     * A collection of functions as defined on the MongoDB Server.
     */
    interface FunctionFactory {
        /**
         * Call a remote MongoDB Realm function by it's name.
         * Consider using `functions[name]()` instead of calling this method.
         * @param name Name of the function
         * @param args Arguments passed to the function
         */
        callFunction(name: string, ...args: any[]): Promise<any>;

        /**
         * All the functions are accessable as members on this instance.
         */
        [name: string]: RealmFunction<any, any[]>;
    }
}