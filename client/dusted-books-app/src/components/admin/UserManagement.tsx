import UserCreateForm from "../User_CreateForm";

function UserManagement() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <p>Welcome to User Management where you can manage users.</p>
        <aside>
            <UserCreateForm />
        </aside>
      </div>
    </>
  );
}

export default UserManagement;
