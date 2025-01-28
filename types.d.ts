interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    rating: number;
    description: string;
    coverColor: string;
    coverUrl: string;
    authorPhotoUrl: string;
    videoUrl: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    profilePicture: string;
}

interface BookParams {
    title: string;
    author: string;
    genre: string;
    authorPhotoUrl: string;
    rating: number;
    description: string;
    coverColor: string;
    coverUrl: string;
    videoUrl: string;
}

interface BookInsert {
    title: string;
    author: string;
    genre: string;
    rating: number;
    description: string;
    coverColor: string;
    coverUrl: string;
    authorPhotoUrl: string;
    videoUrl: string;
}