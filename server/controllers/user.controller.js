import User from '../mongodb/models/user.js';

const getAllUSers = async (req, res) => {};

const createUser = async (req, res) => {
    try {
        const { name, email, avatar } = req.body; // params from frontend(f.e)

        const userExists = await User.findOne({ email });

        if(userExists) return res.status(200).json(userExists); // return entire existing user data

        const newUser = await User.create({  // create new user
            name,
            email,
            avatar
        });

        res.status(200).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserInfoByID = async (req, res) => {};

export {
    getAllUSers,
    createUser,
    getUserInfoByID,
}