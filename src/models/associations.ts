import User from './user';
import Community from './community';
import Role from './role';
import Member from './member';

// Community User association
Community.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
User.hasMany(Community, { foreignKey: "ownerId" });

// Community Member association
Member.belongsTo(Community, { foreignKey: "communityId", as: "community" });
Community.hasMany(Member, { foreignKey: "communityId" });

// Member User association
Member.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Member, { foreignKey: "userId" });

// Member Role association
Member.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(Member, { foreignKey: "roleId" });


