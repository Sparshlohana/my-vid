import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.sparshlohana.myvid",
    projectId: "13",
    databaseId: "13",
    userCollectionId: "13",
    videoCollectionId: "1313",
    storageId: "13",
};


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const response = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!response) throw new Error('User not created');

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: response.$id,
                email,
                username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const response = await account.createEmailPasswordSession(email, password);
        if (!response) throw new Error('User not signed in');
        return response;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};