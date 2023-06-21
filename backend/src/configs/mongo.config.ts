import mongoose from 'mongoose';

export const initializeMongo = (): void => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true
    });
}