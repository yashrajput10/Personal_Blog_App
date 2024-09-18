const adminModel = require("../models/adminSchema");
const blogModel = require("../models/blog.model");
const profileModel = require("../models/myProfile.model");
const bcrypt = require('bcrypt');
const passport = require('passport');
const otpGenerator = require('otp-generator');
const User = require('../models/user');
const nodemailer = require("nodemailer");
const Category = require('../models/categoryModel');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 500,
    secure: true,
    auth: {
        user: "yasrajput8@gmail.com",
        pass: "@Demo123456",
    },
});

const defaultController = ((req, res) => {
    console.log(req.user);
    res.render('index');
   
})

const signInController = ((req, res) => {

    try {
        res.render('signIn');
    } catch (err) {
        console.log("Error ==>", err);
    }
})

const signUpController = ((req, res) => {

    try {
        res.render('signUp');
    } catch (err) {
        console.log("Error ==>", err);
    }
})

const registerAdmin = ((req, res) => {
    const { username, email, password } = req.body;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        try {
            const admin = new adminModel({
                username,
                email,
                password: hash
            })
            await admin.save();
            console.log("Admin added successfully...");
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/signIn');
        } catch (err) {
            console.log(err);
            req.flash('error_msg', 'Registration failed');
            res.redirect('/signUp');
        }
    })
});


const logoutAdmin = ((req, res) => {
    res.clearCookie('sessionId');
    res.redirect('/signIn');
})

const userId = async (req, res) => {
    try {
        let { sessionId } = req.cookies;

        if (sessionId) {
            res.render('index');
        } else {
            res.redirect('/signIn');
        }
    } catch (err) {
        console.log("Error ==>", err);
    }
};

const formController = (req, res) => {
    res.render('form', { title: "Form" });
};

const viewController = async (req, res) => {
    try {
        let { sessionId } = req.cookies;

        let blogs = await blogModel.find({ userId: sessionId });
        console.log("Blogs ==> ", blogs);
        res.render("userView", { blogs });

    } catch (err) {
        console.error("Error fetching user blogs:", err);
        res.status(500).send("Error fetching user blogs.");
    }
};

const addBlog = async (req, res) => {
    try {
        let { editId } = req.body;
        console.log("req.file", req.file);
        console.log("req.body", req.body);

        if (!editId) {
            console.log(req.body);
            let doc = new blogModel({
                blogName: req.body.blogName,
                category,
                type: req.body.type,
                title: req.body.title,
                description: req.body.description,
                userId: req.cookies.sessionId
            });

            await doc.save();

            console.log("Blog Created...", doc);

            res.redirect('/userBlog');
        } else {
            let updatedBlog = await blogModel.updateOne({ "_id": editId }, {
                blogName: req.body.blogname,
                type: req.body.type,
                title: req.body.title,
                description: req.body.description,
            });

            console.log("update Completed...", updatedBlog);
            res.redirect('/userBlog');
        }
    } catch (error) {
        console.error("Error adding/editing blog:", error);
        res.status(500).send("Error adding/editing blog.");
    }
};

const editController = async (req, res) => {
    try {
        let { id } = req.params;

        let singleBlog = await blogModel.findById(id);

        res.render('edit', { singleBlog });
    } catch (error) {
        console.error("Error fetching blog for editing:", error);
        res.status(500).send("Error fetching blog for editing.");
    }
};

const deleteController = async (req, res) => {
    try {
        let { id } = req.params;

        let deletedBlog = await blogModel.findOne({ _id: id });
        console.log("deletedBlog", deletedBlog);

        await blogModel.deleteOne({ _id: id });

        res.redirect("/userBlog");
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).send("Error deleting blog.");
    }
};

const allBlog = async (req, res) => {
    try {
        const allBlog = await blogModel.find({});
        console.log("allBlog", allBlog);

        res.render('allBlog', { blogs: allBlog });
    } catch (error) {
        console.error("Error fetching all blogs:", error);
    }
};

const myProfile = (req, res) => {
    res.render('myProfile');
};

const addProfile = async (req, res) => {
    let { editId } = req.body;

    if (!editId) {
        let doc = new profileModel({
            name: req.body.name,
            username: req.body.username,
            bio: req.body.bio,
            link: req.body.link,
            gender: req.body.gender,
            userId: req.cookies.sessionId
        });

        await doc.save();

        console.log("Profile Created...", doc);

        res.redirect('/myProfile');
    } else {
        let updatedProfile = await profileModel.updateOne({ "_id": editId }, {
            name: req.body.name,
            username: req.body.username,
            bio: req.body.bio,
            link: req.body.link,
            gender: req.body.gender,
        });

        console.log("Profile Updated...", updatedProfile);
        res.redirect('/myProfile');
    }
};

const editProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const singleProfile = await profileModel.findById(id);
        res.render('editProfile', { singleProfile });
    } catch (error) {
        console.error('Error rendering edit profile:', error);
    }
};


const changePassword = async (req, res) => {
    try {
        const userId = req.cookies.sessionId;
        const { opassword, npassword, cpassword } = req.body;

        const admin = await adminModel.findById(userId);
        if (!admin) {
            return res.redirect("/signIn");
        }

        if (admin.password !== opassword) {
            return res.render('changePassword', { error: "Old Password is Wrong!" });
        }

        if (npassword !== cpassword) {
            return res.render('changePassword', { error: "Old Password !" });
        }

        admin.password = npassword;
        await admin.save();

        res.redirect("/myProfile");
    } catch (err) {
        console.log(err);
        res.redirect("/signIn");
    }
}

const changepassword = (req, res) => {
    res.render("changePassword");
}

const category = async (req, res) => {
    
};

const forgetPass = (req, res) => {
    res.render('forgetPassword');
}

const findUser = (req, res) => {
    const { email } = req.body;
    adminModel.findOne({ email }).then((user) => {
        console.log("User ===>", user);

        const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        // Email data
        const mailOptions = {
            from: 'yasrajput8@gmail.com',
            to: user.email,
            subject: 'reset-password otp',
            text: `Hello, your otp: ${otp}. Don't share your otp to others.`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        console.log("OTP ==>", otp);
        res.cookie('id', user.id);
        res.cookie('opt', otp);
        res.redirect("/otpValidation");

    })
        .catch((err) => {
            console.log(err);
        })

}

const otpValidation = (req, res) => {
    res.render('otpValidation');
}

const submitOtp = (req, res) => {
    let { opt } = req.cookies;
    let { otp } = req.body;

    if (opt == otp) {
        res.redirect("/resetPass");
    } else {
        res.redirect("/signIn");
    }
}

const resetPass = (req, res) => {
    res.render('resetPassword');
}


const newPass = async (req, res) => {
    const { id } = req.cookies;
    const { npassword, cpassword } = req.body;

    

    if (npassword === cpassword) {
        const hashedPassword = await bcrypt.hash(npassword, 10);

        await adminModel.findByIdAndUpdate(id, {
            password: hashedPassword
        });

        res.redirect("/signIn");
    } else {
        res.redirect("/resetPass");
    }
};

module.exports = { defaultController, signInController, signUpController, registerAdmin, logoutAdmin, formController, addBlog, viewController, editController, deleteController, allBlog, myProfile, userId, editProfile, addProfile, changePassword, changepassword, category, forgetPass, findUser, otpValidation, submitOtp, resetPass, newPass };