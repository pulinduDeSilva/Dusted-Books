import { useState } from "react";
import roles from "../enums/roles";
import axios from "axios";

function userCreateForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [role, setRole] = useState<string>("admin");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    setError(null); // Reset error state
    setSuccess(null); // Reset success state

    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      password,
      role,
    };

    console.log("User Data:", userData);
    try {
      const respond = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/signup`,
        userData,
      );

      console.log("User created successfully:", respond.data);
      setSuccess("User created successfully!"); // Set success message
    } catch (error) {
      console.error("Error creating user:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            setError("User with this email already exists");
          } else {
            setError("An error occurred while creating the user");
          }
        } else {
          setError("Error occured when connecting to the server");
        }
      }
    }
  };

  return (
    <>
      <form className="max-w-md m-5 lg:mt-15" onSubmit={handleSubmit}>
        <div className="m-5">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-[0.5px] border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label
            htmlFor="floating_email"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="floating_password"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="floating_password"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Password
          </label>
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="floating_first_name"
              id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label
              htmlFor="floating_first_name"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              First name
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="floating_last_name"
              id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
              required
              onChange={(e) => setLastName(e.target.value)}
            />
            <label
              htmlFor="floating_last_name"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Last name
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <label htmlFor="roles">Choose a Role:</label>
          <select
            id="roles"
            name="roles"
            className="block w-full appearance-auto rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)} // Move it here!
          >
            <option value="admin">{roles.ADMIN}</option>
            <option value="customer">{roles.CUSTOMER}</option>
          </select>
        </div>

        <button
          type="submit"
          className="cursor-pointer hover:scale-103 transition-transform duration-50  ease-linear text-white bg-black box-border rounded-lg mt-4 border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Create User
        </button>
      </form>
    </>
  );
}

export default userCreateForm;
