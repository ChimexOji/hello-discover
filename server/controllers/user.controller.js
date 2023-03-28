import User from '../mongodb/models/user.js';

const getAllUSers = async (req, res) => {
    try {
        const users = await User.find({}).limit(req.query._end);

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    };
};

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

const getUserInfoByID = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id }).populate('allProperties');

        if(user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getAllUSers,
    createUser,
    getUserInfoByID,
}