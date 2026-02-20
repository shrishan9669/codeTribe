import { Router } from "express";
import { prisma } from './Prisma/client.js';
import bcrypt from "bcryptjs";
import { signJwt } from "./auth/jwt.js";
import { OAuth2Client } from "google-auth-library";
import { Resend } from 'resend';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import path from "path";
import Usermiddleware from "./middleware/middelware.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// IMPORTANT: dist/src se env 2 level upar hota hai
dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});
const userRouter = Router();
userRouter.post("/createUser", async (req, res) => {
    const { name, email, password, techStack } = req.body;
    if (!name || !email || !password || !techStack || !Array.isArray(techStack)) {
        return res.status(400).json({
            ok: false,
            msg: "Required fields missing!!"
        });
    }
    console.log(techStack);
    try {
        const Exist = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (Exist) {
            return res.status(400).json({
                ok: false,
                msg: "User already exists!!"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const User = await prisma.user.create({
            data: {
                name, email, password: hashedPassword, techStack
            }
        });
        return res.status(200).json({
            ok: true,
            msg: "User created successfully",
            User
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "failed to create user"
        });
    }
});
userRouter.get("/userLogin", async (req, res) => {
    const { email, password } = req.query;
    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            msg: "Required fields missing!!"
        });
    }
    try {
        const Exists = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!Exists) {
            return res.status(400).json({
                ok: false,
                msg: "User doesn't exist!!"
            });
        }
        const validPassword = bcrypt.compare(password, Exists.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Password doesn't match!!"
            });
        }
        const token = signJwt({ userId: Exists.id, email: Exists.email });
        return res.status(200).json({
            ok: true,
            msg: "User signedIn successfully",
            token
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "failed to login user"
        });
    }
});
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const resend = new Resend(process.env.RESEND_API_KEY);
userRouter.post('/google-login', async (req, res) => {
    try {
        const { token } = req.body; // token is Google id_token from frontend
        if (!token)
            return res.status(400).json({ ok: false, msg: "id_token missing" });
        // verify token with google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || ""
        });
        const payload = ticket.getPayload();
        console.log("Here is your payload ", payload);
        if (!payload)
            return res.status(401).json({ ok: false, msg: "Invalid google token" });
        const email = payload.email;
        if (!email)
            return res.status(400).json({ ok: false, msg: "Email not available in token" });
        // check existing user by email
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            //  User exists nahi → error response
            return res.status(404).json({ ok: false, msg: "User doesn't exist!!" });
        }
        //  User exists → login successful
        const jwtToken = signJwt({ userId: user.id, email: user.email });
        console.log("This is jwt token " + jwtToken);
        return res.json({ ok: true, name: user.name, email: user.email, token: jwtToken, msg: "Successfully logined!!" });
    }
    catch (err) {
        console.error("Google login error:", err);
        return res.status(500).json({ ok: false, error: "Authentication failed" });
    }
});
userRouter.get('/send-otp', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.json({
            ok: false,
            msg: "Email is required!!"
        });
    }
    try {
        const Exists = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!Exists) {
            return res.json({
                ok: false,
                msg: "Email doesn't exist!!"
            });
        }
        const otp = crypto.randomInt(100000, 999999); //Otp generate
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "OTP Confirmation to change the password",
            html: `Hi ${Exists.name}. Your OTP for Changing the password is ${otp}`,
        });
        return res.json({
            ok: true,
            msg: "OTP sent to " + email,
            otp
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
});
userRouter.post('/forgetPassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.json({
                ok: false,
                msg: "Email required!!"
            });
        }
        const Exists = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!Exists) {
            return res.json({
                ok: false,
                msg: "User doesn't exist!!"
            });
        }
        await prisma.user.update({
            where: {
                email
            },
            data: {
                password: newPassword
            }
        });
        return res.json({
            ok: true,
            msg: "Password updated successfully!!",
        });
    }
    catch (err) {
        console.log(err);
    }
});
userRouter.get('/User', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized!!"
        });
    }
    try {
        const Exists = await prisma.user.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                bio: true,
                email: true,
                location: true,
                techStack: true,
                github: true,
                linkdin: true
            }
        });
        if (!Exists) {
            return res.status(404).json({
                ok: false,
                msg: "User doesn't exist!!"
            });
        }
        return res.json({
            ok: true,
            msg: "User found successfully",
            user: Exists
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get user details!!"
        });
    }
});
userRouter.post("/updatePassword", Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized!!"
        });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword.trim() || !newPassword.trim()) {
        return res.status(400).json({
            ok: false,
            msg: "Check password fields again!!"
        });
    }
    try {
        const Exist_With_Current = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (Exist_With_Current?.password !== currentPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Current password is wrong!! Check again."
            });
        }
        await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                password: newPassword
            }
        });
        return res.json({
            ok: true,
            msg: "Password updated successfully",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to update user password!!"
        });
    }
});
userRouter.post("/updateProfile", Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized!!"
        });
    }
    const { name, email, bio, location, github, linkedin, techStack } = req.body;
    if (!name || !email || !Array.isArray(techStack) || !bio || !location || !github || !linkedin) {
        return res.status(400).json({
            ok: false,
            msg: "Check password fields again!!"
        });
    }
    try {
        const User = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                name, email, bio, linkdin: linkedin, github, location, techStack
            }
        });
        return res.json({
            ok: true,
            msg: "Profile updated successfully",
            User
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to update user details!!"
        });
    }
});
// ..............................Group logic
userRouter.post('/groups', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(400).json({
            ok: false,
            msg: "Problem with authentication"
        });
    }
    const { name, description, isPublic } = req.body;
    if (!name || !description || typeof isPublic !== 'boolean') {
        return res.status(400).json({
            ok: false,
            msg: "Name, description and isPublic are required",
        });
    }
    try {
        const result = await prisma.$transaction(async (tx) => {
            const group = await tx.group.create({
                data: {
                    name,
                    description,
                    isPublic,
                },
            });
            await tx.groupMember.create({
                data: {
                    userId: Number(id),
                    groupId: group.id,
                    role: "HOST",
                },
            });
            return group;
        });
        return res.json({
            ok: true,
            msg: "Group created Successfully!!",
            result
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to create group",
        });
    }
});
userRouter.get('/groups/my', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    try {
        const Groups = await prisma.groupMember.findMany({
            where: {
                userId: Number(id)
            },
            include: {
                group: {
                    include: {
                        _count: {
                            select: {
                                members: true
                            }
                        }
                    }
                }
            }
        });
        return res.json({
            ok: true,
            myGroups: Groups
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get my groups"
        });
    }
});
userRouter.delete('/groups/removeMember', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId, memberId } = req.query;
    if (!groupId || isNaN(Number(groupId)) || !memberId || isNaN(Number(memberId))) {
        return res.status(400).json({
            ok: false,
            msg: "Invalid group or Member!!"
        });
    }
    try {
        // check if group exists
        const Group_Exists = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!Group_Exists) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist!!"
            });
        }
        // check whether EDITOR exist with this group id
        const Member_Exists = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    groupId: Number(groupId),
                    userId: Number(memberId)
                }
            }
        });
        if (!Member_Exists) {
            return res.status(400).json({
                ok: false,
                msg: "Member doesn't exist!!"
            });
        }
        // check only admins should be allowed to remove EDITOR
        const OnlyAdmins_allowed = await prisma.groupMember.findFirst({
            where: {
                role: 'HOST',
                groupId: Number(groupId),
                userId: Number(id)
            }
        });
        if (!OnlyAdmins_allowed) {
            return res.status(400).json({
                ok: false,
                msg: "Only admin is allowed to remove a EDITOR!!"
            });
        }
        // prevent Host to delete himself
        if (OnlyAdmins_allowed.userId === Number(memberId)) {
            return res.status(400).json({
                ok: false,
                msg: "Host cannot remove himself",
            });
        }
        // now can remove member
        await prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId: Number(memberId),
                    groupId: Number(groupId)
                }
            }
        });
        return res.json({
            ok: true,
            msg: "Member deleted successfully!!"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to remove "
        });
    }
});
userRouter.post('/groups/rolechange', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId, memberId, changeTo } = req.body;
    if (!groupId || !memberId) {
        return res.status(400).json({
            ok: false,
            msg: "invalid group or member"
        });
    }
    if (!changeTo || !['HOST', 'EDITOR'].includes(changeTo)) {
        return res.status(400).json({
            ok: false,
            msg: "Changing role can only be HOST or member!!"
        });
    }
    try {
        //  check group
        const Group = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!Group) {
            return res.status(404).json({
                ok: false,
                msg: "Group doesn't exist!!"
            });
        }
        // check member exist
        const Member = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    groupId: Number(groupId),
                    userId: Number(memberId)
                }
            }
        });
        if (!Member) {
            return res.status(404).json({
                ok: false,
                msg: "Member doesn't exist!!"
            });
        }
        // Only hosts allowed to change the role
        const Check_host = await prisma.groupMember.findFirst({
            where: {
                role: 'HOST',
                userId: Number(id),
                groupId: Number(groupId)
            }
        });
        if (!Check_host) {
            return res.json({
                ok: false,
                msg: "Only hosts are allowed to change role of a member!!"
            });
        }
        // if HOST is demoting himself to "member"
        if (Check_host.userId === Number(memberId) &&
            Member.role === 'HOST' &&
            changeTo === 'EDITOR') {
            // Check other HOST counts
            const host_count = await prisma.groupMember.count({
                where: {
                    role: 'HOST',
                    groupId: Number(groupId)
                }
            });
            if (host_count === 1) {
                return res.json({
                    ok: false,
                    msg: "You are last HOST!!"
                });
            }
        }
        // now u can change the role to changeTo
        await prisma.groupMember.update({
            where: {
                userId_groupId: {
                    userId: Number(memberId),
                    groupId: Number(groupId)
                }
            },
            data: {
                role: changeTo
            }
        });
        return res.json({
            ok: true,
            msg: "Role changed successfully!!"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to change role"
        });
    }
});
userRouter.get('/totalGroups', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    try {
        const TotalGroups = await prisma.groupMember.count({
            where: {
                userId: Number(id)
            }
        });
        const hostGroups = await prisma.groupMember.count({
            where: {
                userId: Number(id),
                role: 'HOST'
            }
        });
        return res.json({
            ok: true,
            hostGroups,
            TotalGroups,
            name: req.user.name
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get no of groups"
        });
    }
});
userRouter.get('/groups/toJoin', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized!!"
        });
    }
    try {
        const Groups = await prisma.group.findMany({
            where: {
                isPublic: true,
                members: {
                    none: {
                        userId: Number(id)
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        members: true
                    }
                }
            }
        });
        return res.json({
            ok: true,
            msg: "Here are the suggested groups",
            Groups
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get groups"
        });
    }
});
userRouter.get('/groups/:groupId', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized!!"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(401).json({
            ok: false,
            name: 'ishan',
            msg: "Invalid group details!!"
        });
    }
    try {
        const Group = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                techStack: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        members: true
                    }
                }
            }
        });
        if (!Group) {
            return res.status(401).json({
                ok: false,
                msg: "Group doesn't exist!!"
            });
        }
        const UserRole = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: Number(id),
                    groupId: Number(groupId)
                }
            },
            select: {
                role: true
            }
        });
        const newGroup = { ...Group, role: UserRole?.role };
        return res.json({
            ok: true,
            msg: "Group fetched succesfully",
            newGroup
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get group details!!"
        });
    }
});
userRouter.delete('/groups/:groupId/delete', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.json({
            ok: false,
            msg: "Invalid group!!"
        });
    }
    try {
        const Group = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!Group) {
            return res.json({
                ok: false,
                msg: "Group doesn't exist!!"
            });
        }
        // only hosts can delete
        const Check_host = await prisma.groupMember.findFirst({
            where: {
                role: 'HOST',
                userId: Number(id),
                groupId: Number(groupId)
            }
        });
        if (!Check_host) {
            return res.json({
                ok: false,
                msg: "Only hosts are allowed to delete group!!"
            });
        }
        // Remove all members from the group
        await prisma.$transaction(async (tx) => {
            // removing all members from the group
            await tx.groupMember.deleteMany({
                where: {
                    groupId: Number(groupId)
                }
            });
            await tx.group.delete({
                where: {
                    id: Number(groupId)
                }
            });
        });
        return res.json({
            ok: true,
            msg: "Group deleted successfully!!"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to delete group!!"
        });
    }
});
userRouter.delete('/groups/:groupId/leave', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Invalid group!!",
        });
    }
    try {
        //  check group 
        const Group = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!Group) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist"
            });
        }
        // me as a member exist
        const MemberExists = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    groupId: Number(groupId),
                    userId: Number(id)
                }
            }
        });
        if (!MemberExists) {
            return res.status(400).json({
                ok: false,
                msg: "You are not a member of this group!!"
            });
        }
        // if HOST wants to leave then..check if another HOST exists or not 
        if (MemberExists.role === 'HOST') {
            // list all hosts of this group
            const host_count = await prisma.groupMember.count({
                where: {
                    groupId: Number(groupId),
                    role: 'HOST'
                }
            });
            if (host_count == 1) {
                return res.status(400).json({
                    ok: false,
                    msg: "You must assign another HOST before leaving"
                });
            }
        }
        // now can leave the group
        await prisma.groupMember.delete({
            where: {
                userId_groupId: {
                    userId: Number(id),
                    groupId: Number(groupId)
                }
            }
        });
        return res.json({
            ok: true,
            msg: "Left the group successfully!!"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to be removed!!"
        });
    }
});
userRouter.get('/groups/:groupId/members', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Invalid groupId"
        });
    }
    try {
        // Check if group exists
        const Exists = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!Exists) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist"
            });
        }
        // only allowed if user is a member of this group
        const If_User_A_Member = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: Number(id),
                    groupId: Number(groupId)
                }
            }
        });
        if (!If_User_A_Member) {
            return res.status(400).json({
                ok: false,
                msg: "You are not a member of this group!!"
            });
        }
        const Members = await prisma.groupMember.findMany({
            where: {
                groupId: Number(groupId)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        techStack: true
                    }
                }
            }
        });
        return res.json({
            ok: true,
            Members
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get members"
        });
    }
});
userRouter.post('/groups/:groupId/join', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized",
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Group id ivnalid!!"
        });
    }
    try {
        // check group exists or not
        const Check_Group = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!Check_Group) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist!!"
            });
        }
        if (!Check_Group.isPublic) {
            return res.status(400).json({
                ok: false,
                msg: "This group is private!!"
            });
        }
        // check previous entry exists
        const ExistsPrevious_Combo = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: Number(id),
                    groupId: Number(groupId)
                }
            }
        });
        if (ExistsPrevious_Combo) {
            return res.status(409).json({
                ok: false,
                msg: "Already a member of this group!!"
            });
        }
        // joining this group
        const New_Member = await prisma.groupMember.create({
            data: {
                userId: Number(id),
                groupId: Number(groupId),
                role: 'EDITOR'
            }
        });
        return res.json({
            ok: true,
            msg: "Join group successfully",
            New_Member
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "failed to join a group"
        });
    }
});
userRouter.post('/groups/:groupId/changeisPublic', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized",
        });
    }
    const { groupId } = req.params;
    const { isPublic } = req.body;
    if (!groupId || isNaN(Number(groupId)) || typeof (isPublic) !== 'boolean') {
        return res.status(400).json({
            ok: false,
            msg: "Group id ivnalid!!"
        });
    }
    console.log(isPublic + "Dekh lo");
    try {
        // check group exists or not
        const Check_Group = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!Check_Group) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist!!"
            });
        }
        // only hosts allowed to change group settings
        const Check_host = await prisma.groupMember.findFirst({
            where: {
                groupId: Number(groupId),
                userId: Number(id),
                role: 'HOST'
            }
        });
        if (!Check_host) {
            return res.status(400).json({
                ok: false,
                msg: "Only hosts are allowed to change group settings."
            });
        }
        await prisma.group.update({
            where: {
                id: Number(groupId)
            },
            data: {
                isPublic
            }
        });
        return res.json({
            ok: true,
            msg: `Settings changed to ${isPublic ? 'Public' : 'Private'}.`
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to update changes"
        });
    }
});
userRouter.post("/groups/:groupId/leaveAdminship", Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized",
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Group id ivnalid!!"
        });
    }
    try {
        // check group exists or not
        const Check_Group = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!Check_Group) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist!!"
            });
        }
        // check first you are Host or not
        const Check_admin = await prisma.groupMember.findFirst({
            where: {
                userId: Number(id),
                groupId: Number(groupId),
                role: 'HOST'
            }
        });
        if (!Check_admin) {
            return res.status(400).json({
                ok: false,
                msg: "Only Host can leave adminship!!"
            });
        }
        // see the admins count first
        const AdminCount = await prisma.groupMember.count({
            where: {
                role: 'HOST',
                groupId: Number(groupId)
            }
        });
        if (AdminCount === 1) {
            return res.status(400).json({
                ok: false,
                msg: "Atleast one Host should be there in a group!!"
            });
        }
        await prisma.groupMember.update({
            where: {
                userId_groupId: {
                    userId: Number(id),
                    groupId: Number(groupId)
                }
            },
            data: {
                role: "EDITOR"
            }
        });
        return res.json({
            ok: true,
            msg: "Adminship left successfully"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to change the role"
        });
    }
});
userRouter.get('/personal', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized",
        });
    }
    const { groupId } = req.query;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Group invalid",
        });
    }
    try {
        const User = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: Number(id),
                    groupId: Number(groupId)
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return res.json({
            ok: true,
            user: {
                role: User?.role,
                userId: User?.user?.id,
                name: User?.user?.name
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get personal details"
        });
    }
});
// Rooms logic...................
// create room
userRouter.post('/rooms/:groupId/create-room', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Group invalid"
        });
    }
    try {
        const GroupExist = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!GroupExist) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist"
            });
        }
        const RoomCode = await prisma.roomCode.findUnique({
            where: {
                groupId: Number(groupId)
            }
        });
        if (RoomCode) {
            return res.status(400).json({
                ok: false,
                msg: "Room already exists!!"
            });
        }
        const newRoom = await prisma.roomCode.create({
            data: {
                language: 'javascript',
                code: '',
                groupId: Number(groupId)
            }
        });
        return res.json({
            ok: true,
            msg: "Room fetched successfully.",
            newRoom
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get code"
        });
    }
});
userRouter.get('/rooms/:groupId/code', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Group invalid"
        });
    }
    try {
        const GroupExist = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!GroupExist) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist"
            });
        }
        const RoomCode = await prisma.roomCode.findUnique({
            where: {
                groupId: Number(groupId)
            }
        });
        if (!RoomCode) {
            return res.status(400).json({
                ok: false,
                msg: "room not found!!"
            });
        }
        return res.json({
            ok: true,
            msg: "Room fetched successfully.",
            RoomCode
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get code"
        });
    }
});
// Auto save functionality
userRouter.put('/rooms/:groupId/putCode', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Group invalid"
        });
    }
    const { code, language } = req.body;
    if (!code || !language) {
        return res.status(400).json({
            ok: false,
            msg: "Code and language required!!"
        });
    }
    try {
        const GroupExist = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!GroupExist) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist"
            });
        }
        const updateRoom = await prisma.roomCode.update({
            where: {
                groupId: Number(groupId)
            },
            data: {
                code,
                language
            }
        });
        return res.json({
            ok: true,
            msg: "Code updated successfully.",
            updateRoom
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get code"
        });
    }
});
// creating version or snapshot of code manually
userRouter.post('/rooms/:groupId/version', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Group invalid"
        });
    }
    const { code, language } = req.body;
    if (!code || !language) {
        return res.status(400).json({
            ok: false,
            msg: "Code and language required!!"
        });
    }
    try {
        // host only allowed to change code
        const isHost = await prisma.groupMember.findFirst({
            where: {
                role: 'HOST',
                groupId: Number(groupId),
                userId: Number(id)
            }
        });
        if (!isHost) {
            return res.status(400).json({
                ok: false,
                msg: "Only host is allowed to save versions"
            });
        }
        const GroupExist = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!GroupExist) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist"
            });
        }
        // Fetching RoomCode
        const room = await prisma.roomCode.findUnique({
            where: {
                groupId: Number(groupId)
            }
        });
        if (!room) {
            return res.status(400).json({
                ok: false,
                msg: "room not found!!"
            });
        }
        const CreateNewVersion = await prisma.codeVersion.create({
            data: {
                code,
                language,
                roomCodeId: room.id,
                createdBy: Number(id)
            }
        });
        return res.json({
            ok: true,
            msg: "Created new version code",
            CreateNewVersion
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to create version"
        });
    }
});
// getting version history
userRouter.get('/rooms/:groupId/versionHistory', Usermiddleware, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).json({
            ok: false,
            msg: "Unauthorized"
        });
    }
    const { groupId } = req.params;
    if (!groupId || isNaN(Number(groupId))) {
        return res.status(400).json({
            ok: false,
            msg: "Group invalid"
        });
    }
    try {
        const GroupExist = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });
        if (!GroupExist) {
            return res.status(400).json({
                ok: false,
                msg: "Group doesn't exist"
            });
        }
        // Fetching RoomCode
        const room = await prisma.roomCode.findUnique({
            where: {
                groupId: Number(groupId)
            }
        });
        if (!room) {
            return res.status(400).json({
                ok: false,
                msg: "No room found"
            });
        }
        // getting history
        const versions = await prisma.codeVersion.findMany({
            where: {
                roomCodeId: room.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return res.json({
            ok: true,
            msg: "Fetched version history successfully",
            versions
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Failed to get code"
        });
    }
});
userRouter.put('/changeAdmin', async (req, res) => {
    await prisma.groupMember.updateMany({
        where: {
            role: 'admin'
        },
        data: {
            role: 'HOST'
        }
    });
    await prisma.groupMember.updateMany({
        where: {
            role: 'member'
        },
        data: {
            role: 'EDITOR'
        }
    });
    return res.json({
        msg: "Ok"
    });
});
// Now restoring an older version to actual current code
// userRouter.post("/versions/:versionId/restore",Usermiddleware,async(req:any,res:any)=>{
//     const {id} = req.user
//     if(!id){
//       return res.status(401).json({
//         ok:false,
//         msg:"Unauthorized"
//       })
//     }
//     const {versionId} = req.params
//     if(!versionId || isNaN(Number(versionId))){
//       return res.status(400).json({
//         ok:false,
//         msg:"Version not found"
//       })
//     }
//     try{
//       const Version = await prisma.codeVersion.findUnique({
//         where:{
//           id:Number(versionId)
//         }
//       })
//       if (!Version) {
//         return res.status(404).json({ok:false, msg: "Version not found" });
//       }
//       console.log("Version code -> and id " + Version.roomCodeId + " " +   Version.code)
//      const updatedRoom = await prisma.roomCode.update({
//         where:{
//            id:Number(Version?.roomCodeId),
//         },
//         data:{
//           language:Version?.language,
//           code:Version?.code
//         }
//       })
//       console.log(updatedRoom)
//       return res.json({
//         ok:true,
//         msg:"Code restored successfully!!"
//       })
//     }
//     catch(err){
//       console.log(err)
//       return res.status(500).json({
//         msg:"Failed to restore code"
//       })
//     }
// })
userRouter.delete('/delete', async (req, res) => {
    await prisma.user.deleteMany({});
    return res.json({
        msg: "All deleted!!"
    });
});
export default userRouter;
//# sourceMappingURL=user.js.map