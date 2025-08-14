import AddUserModal from "./UserTop";
import CreateRoleModal from "./CreateRoleModal";

export default function UserManagement() {
  const refreshRoles = () => {
    // Logic to refresh roles in AddUserModal (can use lifting state up or context)
  };

  return (
    <div className="flex gap-3">
      <AddUserModal onRolesUpdated={refreshRoles} />
      <CreateRoleModal onRoleCreated={refreshRoles} />
    </div>
  );
}
