import mongoose from 'mongoose';
import Property from '../mongodb/models/property.js';
import User from '../mongodb/models/user.js';

import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const getAllProperties = async (req, res) => {};
const getPropertyDetail = async (req, res) => {};

const createProperty = async (req, res) => {
    try {
        const { title, description, propertyType, location, price, photo, email } = req.body;

        // start new session
        const session = await mongoose.startSession(); // startSession protects the inserted properties in mongodb
        session.startTransaction();  // ensures session goes through

        const user = await User.findOne({ email }).session(session);

        if(!user) throw new Error('User not found');

        // get user photo through cloudinary
        const photoUrl = await cloudinary.uploader.upload(photo);

        const newProperty = await Property.create ({
            title,
            description,
            propertyType,
            location,
            price,
            photo: photoUrl.url,
            creator: user._id
        });

        user.allProperties.push(newProperty._id);
        await user.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: 'Property created successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProperty = async (req, res) => {};
const deleteProperty = async (req, res) => {};

export {
    getAllProperties,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty,
}