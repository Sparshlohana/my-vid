import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';


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
const storage = new Storage(client);

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
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [Query.orderDesc('$createdAt', Query.limit(7))]);
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
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [Query.equal('creator', userId), Query.orderDesc('$createdAt', Query.limit(7))]);
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

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
        } else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) {
            throw new Error('File not found');
        }

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
};

export const uploadFile = async (file, type) => {
    if (!file) {
        throw new Error('File not found');
    }

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    }

    try {
        const uploadedFile = await storage.createFile(storageId, ID.unique(), asset);
        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }

}

export const createVideo = async (formData) => {
    try {
        const [videoUrl, thumbnailUrl] = await Promise.all([
            uploadFile(formData.video, 'video'),
            uploadFile(formData.thumbnail, 'image')
        ]);

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: formData.title,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                prompt: formData.prompt,
                creator: formData.userId,
            }
        );

        return newPost;

    } catch (error) {
        throw new Error(error);
    }
};