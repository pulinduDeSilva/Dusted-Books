const user = require("../model/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../util/jwtGenerate");



exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt); //password hashing

        // Check if user with the same email already exists
        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }


        const newUser = new user({ name, email, password: hashedpassword, role });
        await newUser.save();
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const foundUser = await user.findOne({email: req.body.email});

        if(!foundUser) {
            return res.status(401).json({
                message: "invalid credentials"
            });
        }
        const comparePass = await bcrypt.compare(password, foundUser.password);
        if(!comparePass) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        generateToken(res, foundUser);
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
            },
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
};