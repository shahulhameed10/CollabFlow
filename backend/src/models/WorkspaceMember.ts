import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/db';
import User from './User';
import Workspace from './Workspace';

class WorkspaceMember extends Model {
    public id!: number;
    public userId!: number;
    public workspaceId!: number;
    public role!: string; // 'Admin' | 'Member' etc.
}

WorkspaceMember.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    workspaceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Member'
    }
}, {
    sequelize,
    modelName: 'workspace_member'
});



export default WorkspaceMember;
