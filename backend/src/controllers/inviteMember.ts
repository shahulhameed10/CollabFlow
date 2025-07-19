import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import WorkspaceMember from '../models/WorkspaceMember';


//email invite to workspace
export const inviteMember = async (req: Request, res: Response) => {
    const { email, role, workspaceId } = req.body;

    try {
        // Add the member to WorkspaceMember table with status 'Invited'
        await WorkspaceMember.create({
            userId: null, // Will be set when user registers
            email,
            role,
            workspaceId,
        });

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your app password (not your regular password)
            }
        });

        const invitationLink = `http://localhost:3000/invite?workspaceId=${workspaceId}&email=${encodeURIComponent(email)}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Workspace Invitation - CollabFlow',
            html: `<p>You are invited to join workspace ${workspaceId}. Click <a href="${invitationLink}">here</a> to accept.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send invitation' });
    }
};
