import UserForm from './create-user-form';

export default function CreateUserPage() {
  return (
    <div className="min-h-screen p-8">
      <main className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            Create New User
          </h1>
          <p className="text-gray-400 mt-2">
            Enter information to create a new user
          </p>
        </div>

        <UserForm mode="create" />
      </main>
    </div>
  );
} 