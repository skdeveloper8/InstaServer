const User = require("../model/userSchema.js");
const Post = require("../model/PostSchema.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otp = require("../model/OtpSchema.js");
const dotenv = require('dotenv').config();

module.exports.register = async (req, res) => {
  try {
    const { username, email, name, password } = req.body;
    const result = await User.findOne({ email });
    if (result) {
      return res.json({
        success: false,
        message: " user already Register",
      });
    } else {
      const hashed = bcrypt.hashSync(password, 10);
      const follower = [];
      await User.create({
        username,
        email,
        name,
        follower,
        password: hashed,
      });
      return res.json({
        success: true,
        message: "Sucessfully Registered",
      });
    }
  } catch (err) {
    console.log("err", err);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    } else {
      const checked = await bcrypt.compare(password, user.password);
      if (!checked) {
        return res.json({
          success: false,
          message: "Username / Password Incorrct",
        });
      } else {
        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' })
        user = user.toObject();
        user.token = token;
        user.password = undefined;
        user.posts = null;
        return res.cookie("Token", token, { expires: new Date(Date.now() + 60 * 60 * 1000) }).json({
          success: true,
          message: "Sucessfully login",
          user
        });
      }
    }
  } catch (err) {
    console.log("err", err);
  }
};

module.exports.profile = async (req, res) => {
  console.log("req profile");
  try {
    const { id } = req.body;
    const data = await User.findById(id);
    data.password = undefined;
    res.json({
      success: true,
      data
    })
  } catch (err) {
  }
}
module.exports.createPost = async (req, res) => {
  const { image, description } = req.body;
  const current = req.user.user;
  const { _id } = req.user.user;
  if (image && description && current && _id) {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          posts: {
            image,
            description
          }
        }
      },
      { new: true }
    );

    await Post.create({
      image: req.body.image,
      description,
      user: {
        username: current.username,
        dp:current.dp
      }
    });
    if (user) {
      return res.json({
        success: true,
        message: "Posted Successfully"
      })
    }
  }

}

module.exports.editProfile = async (req, res) => {
  console.log("req edit profile");
  const { _id, username } = req.user.user;
  const {bio,dp}=req.body
  console.log(dp);
  try {
    if (bio) {
      await User.findByIdAndUpdate(_id, {
        bio , dp
      });
    }

    // Update user's posts with new profile picture
    if (dp) {
      
       await Post.updateMany(
        { "user.username": username },
        { $set: { "user.dp": req.body.dp } }
      );
    }
    res.clearCookie("User").json({
      success: true,
      message: "Profile Updated",
    });

  } catch (err) {
    console.error("Error in Edit Profile:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.search = async (req, res) => {
  console.log("req search");
  const { username } = req.body;
  try {
    const data = await User.find({ username: { $regex: new RegExp(username, 'i') } })
    if (data != []) {
      res.json({
        success: true,
        data
      })
    }
  } catch (error) {
    console.log(error, "error in Search");
    res.json({
      success: false,
      message: error
    })
  }
}

module.exports.resetPass = async (req, res) => {
  console.log("req reset pass");
  const { userOtp, newPassword } = req.body;
  try {
    const data = await otp.find({ email: req.user.user.email })
    if (data) {
      if (data[0].code === userOtp) {
        const hassPass = await bcrypt.hashSync(newPassword, 10);
        const result = await User.findOneAndUpdate({ username: req.user.user.username }, { password: hassPass })
        if (result) {
          res.clearCookie("User").json({
            success: true,
            message: "Password Change Successfully"

          })
        }
      } else {
        res.json({
          success: false,
          message: "OTP INCORRECT"
        })
      }
    }
  } catch (error) {
    console.log(error, "resetPass");
    res.json({
      success: false,
      message: error
    })
  }
}

module.exports.searchUser = async (req, res) => {
  console.log("req searchUser");
  const { id, username } = req.body;
  try {
    if (username) {
      const data = await User.findOne({ username });
      if (data) {
        return res.json({
          success: true,
          message: "User Found",
          data
        })
      }
    }
    if (id) {
      const data = await User.findById(id);
      if (data) {
        return res.json({
          success: true,
          message: "User Found",
          data
        })
      }
    }
  } catch (err) {
    console.log(err, "Error in searchUser");
    res.json({
      success: false,
      message: "Invalid"
    })
  }
}

module.exports.following = async (req, res) => {
  console.log("req following");
  const { username, dp } = req.body;
  const { _id } = req.user.user;
  try {
    const data = await User.findByIdAndUpdate(_id, { $push: { following: { username, dp } } }, { new: true })
    if (data)
      res.json({
        success: true,
        message: "Followed Successfully",
        data
      })
  } catch (error) {
    console.log(error, "Error in followers");
  }
}

module.exports.getFollowing = async (req, res) => {
  console.log("req getfollow");
  const { _id } = req.body;
  try {
    const data = await User.findById(_id)
    if (data) {
      res.json({
        success: true,
        messsage: "Data Found",
        data
      })
    }
  } catch (error) {
    console.log(error, "Error in getFollowing");
    res.json({
      success: false,
      message: error
    })
  }
}