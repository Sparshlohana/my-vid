import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.sparshlohana.myvid",
    projectId: "13",
    databaseId: "13",
    userCollectionId: "13",
    videoCollectionId: "1313",
    storageId: "13",
};

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId } = appwriteConfig;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform);

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
            databaseId,
            userCollectionId,
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

export const signIn = async (email, password) => {
    try {
        const response = await account.createEmailPasswordSession(email, password);
        if (!response) throw new Error('User not signed in');
        return response;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await account.get();
        if (!response) throw new Error('User not found');

        const user = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', response.$id)]
        );
        if (!user) throw new Error('User not found');
        return user.documents[0];

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId);
        if (!posts) throw new Error('Posts not found');
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [Query.orderDesc('$createdAt', Query.limit(7))]);
        if (!posts) throw new Error('Posts not found');
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [Query.search('title', query)]);
        if (!posts) throw new Error('Posts not found');
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const getUserPost = async (userId) => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [Query.equal('creator', userId)]);
        if (!posts) throw new Error('Posts not found');
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error);
    }
};