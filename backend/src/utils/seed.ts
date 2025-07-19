import bcrypt from 'bcrypt';
import User from '../models/User';
import Workspace from '../models/Workspace';
import Project from '../models/Project';
import Task from '../models/Task';

export const seedData = async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create Users
    const users = await User.bulkCreate([
        {
            email: 'admin@collabflow.com',
            password: hashedPassword,
            role: 'Admin', // ✅ Matches ENUM
            isVerified: true
        },
        {
            email: 'developer@example.com',
            password: hashedPassword,
            role: 'Developer', // ✅ Matches ENUM
            isVerified: true
        },
        {
            email: 'manager@example.com',
            password: hashedPassword,
            role: 'ProjectManager', // ✅ FIXED: Match your ENUM definition
            isVerified: true
        }
    ], { returning: true });

    const adminUser = users.find(u => u.role === 'Admin');
    const developerUser = users.find(u => u.role === 'Developer');

    if (!adminUser || !developerUser) {
        throw new Error('Admin or Developer user not found after creation.');
    }

    // Create Workspace with ownerId
    const workspace = await Workspace.create({
        name: 'CollabFlow Workspace',
        ownerId: adminUser.id
    });

    // Create Project
    const project = await Project.create({
        name: 'CollabFlow Project',
        description: 'Test project',
        workspaceId: workspace.id
    });

    // Create Task
    await Task.create({
        name: 'Sample Task',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(),
        assignedTo: developerUser.id,
        projectId: project.id
    });

    console.log('✅ Seeding completed');
};
