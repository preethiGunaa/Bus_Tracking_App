const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, userType, phone } = req.body;

        console.log('🔵 BACKEND REGISTRATION - Received data:', {
            name, email, role, userType, phone
        });

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // 🎯 FIX: Handle both role and userType fields
        let finalRole = 'user';
        if (role) {
            finalRole = role;
        } else if (userType) {
            finalRole = userType;
        }

        console.log('🔵 FINAL ROLE TO SAVE:', finalRole);

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role: finalRole, // Use the determined role
            phone
        });

        console.log('🔵 USER CREATED WITH ROLE:', user.role);

        // If user created successfully
        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role, // This should now show 'driver'
                    phone: user.phone,
                    token: generateToken(user._id),
                },
                message: 'User registered successfully'
            });
        }
    } catch (error) {
        console.log('🔵 REGISTRATION ERROR:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        console.log('🔵 BACKEND LOGIN - Attempting login:', { email, userType });

        // Find user and include password (since we have select: false in model)
        const user = await User.findOne({ email }).select('+password');

        console.log('🔵 FOUND USER WITH ROLE:', user?.role);

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            // Verify user's role matches the requested userType
            if (userType && user.role !== userType) {
                console.log('🔵 ROLE MISMATCH:', user.role, '!=', userType);
                return res.status(401).json({
                    success: false,
                    message: `This account is for ${user.role}s. Please login as ${user.role}`
                });
            }

            console.log('🔵 LOGIN SUCCESSFUL - Role:', user.role);
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    token: generateToken(user._id),
                },
                message: 'Login successful'
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.log('🔵 LOGIN ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

module.exports = { registerUser, loginUser };