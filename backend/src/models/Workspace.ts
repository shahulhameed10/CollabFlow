import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/db';
import User from './User';
import Project from './Project';
import WorkspaceMember from './WorkspaceMember';

class Workspace extends Model {
    public id!: number;
    public name!: string;
    public ownerId!: number;
    public brandingLogo?: string; // Optional branding field
}

Workspace.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull:true
    },
    brandingLogo: {
        type: DataTypes.STRING,
        allowNull: true // Branding is optional
    }
}, {
    sequelize,
    modelName: 'workspace'
});



export default Workspace;
